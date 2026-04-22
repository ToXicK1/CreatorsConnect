import { Router, type IRouter } from "express";
import { eq, and, gte, lte, ilike, sql } from "drizzle-orm";
import { db, creatorsTable } from "@workspace/db";
import {
  ListCreatorsQueryParams,
  ListCreatorsResponse,
  CreateCreatorBody,
  GetCreatorParams,
  GetCreatorResponse,
  UpdateCreatorParams,
  UpdateCreatorBody,
  UpdateCreatorResponse,
  DeleteCreatorParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result as T;
}

function parseCreator(row: typeof creatorsTable.$inferSelect) {
  return serializeDates({
    ...row,
    platforms: JSON.parse(row.platforms || "[]"),
  } as unknown as Record<string, unknown>);
}

router.get("/creators", async (req, res): Promise<void> => {
  const query = ListCreatorsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, language, platform, minFollowers, maxFollowers, state, search } = query.data;

  const conditions = [];
  if (category) conditions.push(eq(creatorsTable.category, category));
  if (state) conditions.push(eq(creatorsTable.state, state));
  if (minFollowers) conditions.push(gte(creatorsTable.totalFollowers, minFollowers));
  if (maxFollowers) conditions.push(lte(creatorsTable.totalFollowers, maxFollowers));
  if (search) {
    conditions.push(
      sql`(${creatorsTable.name} ilike ${"%" + search + "%"} or ${creatorsTable.username} ilike ${"%" + search + "%"} or ${creatorsTable.bio} ilike ${"%" + search + "%"})`
    );
  }

  let rows = await db
    .select()
    .from(creatorsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(creatorsTable.totalFollowers);

  const parsed = rows.map(parseCreator);

  // Filter by language and platform (stored as JSON)
  let filtered = parsed;
  if (language) {
    filtered = filtered.filter((c) => c.languages.includes(language));
  }
  if (platform) {
    filtered = filtered.filter((c) =>
      c.platforms.some((p: { platform: string }) => p.platform === platform)
    );
  }

  res.json(ListCreatorsResponse.parse(filtered));
});

router.post("/creators", async (req, res): Promise<void> => {
  const parsed = CreateCreatorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { platforms, ...rest } = parsed.data;
  const totalFollowers = platforms.reduce((sum: number, p: { followers: number }) => sum + p.followers, 0);

  const [row] = await db
    .insert(creatorsTable)
    .values({
      ...rest,
      platforms: JSON.stringify(platforms),
      totalFollowers,
    })
    .returning();

  res.status(201).json(GetCreatorResponse.parse(parseCreator(row)));
});

router.get("/creators/:id", async (req, res): Promise<void> => {
  const params = GetCreatorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(creatorsTable).where(eq(creatorsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Creator not found" });
    return;
  }

  res.json(GetCreatorResponse.parse(parseCreator(row)));
});

router.put("/creators/:id", async (req, res): Promise<void> => {
  const params = UpdateCreatorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCreatorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.platforms) {
    updateData.platforms = JSON.stringify(parsed.data.platforms);
    updateData.totalFollowers = parsed.data.platforms.reduce(
      (sum: number, p: { followers: number }) => sum + p.followers,
      0
    );
    delete updateData.platforms;
    updateData.platforms = JSON.stringify(parsed.data.platforms);
  }

  const [row] = await db
    .update(creatorsTable)
    .set(updateData as Partial<typeof creatorsTable.$inferInsert>)
    .where(eq(creatorsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Creator not found" });
    return;
  }

  res.json(UpdateCreatorResponse.parse(parseCreator(row)));
});

router.delete("/creators/:id", async (req, res): Promise<void> => {
  const params = DeleteCreatorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.delete(creatorsTable).where(eq(creatorsTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Creator not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
