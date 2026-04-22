import { Router, type IRouter } from "express";
import { eq, sql, and } from "drizzle-orm";
import { db, brandsTable } from "@workspace/db";
import {
  ListBrandsQueryParams,
  ListBrandsResponse,
  CreateBrandBody,
  GetBrandParams,
  GetBrandResponse,
  UpdateBrandParams,
  UpdateBrandBody,
  UpdateBrandResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result;
}

router.get("/brands", async (req, res): Promise<void> => {
  const query = ListBrandsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { industry, search } = query.data;
  const conditions = [];
  if (industry) conditions.push(eq(brandsTable.industry, industry));
  if (search) {
    conditions.push(
      sql`(${brandsTable.name} ilike ${"%" + search + "%"} or ${brandsTable.description} ilike ${"%" + search + "%"})`
    );
  }

  const rows = await db
    .select()
    .from(brandsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(brandsTable.name);

  res.json(ListBrandsResponse.parse(rows.map((r) => serializeDates(r as unknown as Record<string, unknown>))));
});

router.post("/brands", async (req, res): Promise<void> => {
  const parsed = CreateBrandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(brandsTable).values(parsed.data).returning();
  res.status(201).json(GetBrandResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

router.get("/brands/:id", async (req, res): Promise<void> => {
  const params = GetBrandParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(brandsTable).where(eq(brandsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Brand not found" });
    return;
  }

  res.json(GetBrandResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

router.put("/brands/:id", async (req, res): Promise<void> => {
  const params = UpdateBrandParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBrandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(brandsTable)
    .set(parsed.data)
    .where(eq(brandsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Brand not found" });
    return;
  }

  res.json(UpdateBrandResponse.parse(serializeDates(row as unknown as Record<string, unknown>)));
});

export default router;
