import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, applicationsTable, campaignsTable } from "@workspace/db";
import {
  ListApplicationsQueryParams,
  ListApplicationsResponse,
  CreateApplicationBody,
  GetApplicationParams,
  GetApplicationResponse,
  UpdateApplicationParams,
  UpdateApplicationBody,
  UpdateApplicationResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result;
}

router.get("/applications", async (req, res): Promise<void> => {
  const query = ListApplicationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { campaignId, creatorId, status } = query.data;
  const conditions = [];
  if (campaignId) conditions.push(eq(applicationsTable.campaignId, campaignId));
  if (creatorId) conditions.push(eq(applicationsTable.creatorId, creatorId));
  if (status) conditions.push(eq(applicationsTable.status, status));

  const rows = await db
    .select()
    .from(applicationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(applicationsTable.createdAt);

  res.json(ListApplicationsResponse.parse(rows.map((r) => serializeDates(r as unknown as Record<string, unknown>))));
});

router.post("/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [campaign] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, parsed.data.campaignId));
  if (!campaign) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  const [row] = await db
    .insert(applicationsTable)
    .values({
      ...parsed.data,
      campaignTitle: campaign.title,
      brandName: campaign.brandName,
      creatorName: "Creator",
      creatorUsername: "creator",
    })
    .returning();

  await db
    .update(campaignsTable)
    .set({ applicationCount: campaign.applicationCount + 1 })
    .where(eq(campaignsTable.id, parsed.data.campaignId));

  res.status(201).json(GetApplicationResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

router.get("/applications/:id", async (req, res): Promise<void> => {
  const params = GetApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(GetApplicationResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

router.put("/applications/:id", async (req, res): Promise<void> => {
  const params = UpdateApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(applicationsTable)
    .set(parsed.data)
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(UpdateApplicationResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

export default router;
