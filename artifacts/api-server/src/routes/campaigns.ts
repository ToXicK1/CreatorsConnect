import { Router, type IRouter } from "express";
import { eq, and, gte, lte, ilike, sql } from "drizzle-orm";
import { db, campaignsTable, applicationsTable } from "@workspace/db";
import {
  ListCampaignsQueryParams,
  ListCampaignsResponse,
  CreateCampaignBody,
  GetCampaignParams,
  GetCampaignResponse,
  UpdateCampaignParams,
  UpdateCampaignBody,
  UpdateCampaignResponse,
  DeleteCampaignParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result;
}

router.get("/campaigns", async (req, res): Promise<void> => {
  const query = ListCampaignsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { status, category, platform, minBudget, maxBudget, brandId, search } = query.data;
  const conditions = [];

  if (status) conditions.push(eq(campaignsTable.status, status));
  if (category) conditions.push(eq(campaignsTable.category, category));
  if (brandId) conditions.push(eq(campaignsTable.brandId, brandId));
  if (minBudget) conditions.push(gte(campaignsTable.budget, minBudget));
  if (maxBudget) conditions.push(lte(campaignsTable.budget, maxBudget));
  if (search) {
    conditions.push(
      sql`(${campaignsTable.title} ilike ${"%" + search + "%"} or ${campaignsTable.description} ilike ${"%" + search + "%"})`
    );
  }

  let rows = await db
    .select()
    .from(campaignsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(campaignsTable.createdAt);

  let filtered = rows;
  if (platform) {
    filtered = rows.filter((c) => c.platforms.includes(platform));
  }

  res.json(ListCampaignsResponse.parse(filtered.map((r) => serializeDates(r as unknown as Record<string, unknown>))));
});

router.post("/campaigns", async (req, res): Promise<void> => {
  const parsed = CreateCampaignBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(campaignsTable).values(parsed.data).returning();
  res.status(201).json(GetCampaignResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

router.get("/campaigns/:id", async (req, res): Promise<void> => {
  const params = GetCampaignParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  res.json(GetCampaignResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

router.put("/campaigns/:id", async (req, res): Promise<void> => {
  const params = UpdateCampaignParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCampaignBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(campaignsTable)
    .set(parsed.data)
    .where(eq(campaignsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  res.json(UpdateCampaignResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

router.delete("/campaigns/:id", async (req, res): Promise<void> => {
  const params = DeleteCampaignParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.delete(campaignsTable).where(eq(campaignsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
