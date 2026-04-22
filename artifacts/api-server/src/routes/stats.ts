import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, creatorsTable, brandsTable, campaignsTable, applicationsTable } from "@workspace/db";
import {
  GetPlatformStatsResponse,
  GetTopCreatorsQueryParams,
  GetTopCreatorsResponse,
  GetTrendingCampaignsQueryParams,
  GetTrendingCampaignsResponse,
  GetCategoryBreakdownResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeDates<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function parseCreator(row: typeof creatorsTable.$inferSelect) {
  return serializeDates({
    ...row,
    platforms: JSON.parse(row.platforms || "[]"),
  });
}

function parseCampaign(row: typeof campaignsTable.$inferSelect) {
  return serializeDates({ ...row });
}

router.get("/stats/platform", async (req, res): Promise<void> => {
  const [creatorCount] = await db.select({ count: sql<number>`count(*)::int` }).from(creatorsTable);
  const [brandCount] = await db.select({ count: sql<number>`count(*)::int` }).from(brandsTable);
  const [campaignCount] = await db.select({ count: sql<number>`count(*)::int` }).from(campaignsTable);
  const [openCampaignCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(campaignsTable)
    .where(eq(campaignsTable.status, "open"));
  const [appCount] = await db.select({ count: sql<number>`count(*)::int` }).from(applicationsTable);
  const [acceptedCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(applicationsTable)
    .where(eq(applicationsTable.status, "accepted"));

  const [totalFollowerRow] = await db
    .select({ total: sql<number>`sum(total_followers)::bigint` })
    .from(creatorsTable);
  const totalFollowers = Number(totalFollowerRow?.total || 0);
  const totalReachCrore = Math.round((totalFollowers / 10000000) * 10) / 10;

  const [avgEngRow] = await db
    .select({ avg: sql<number>`avg(engagement_rate)::float` })
    .from(creatorsTable);
  const averageEngagementRate = Math.round((avgEngRow?.avg || 0) * 100) / 100;

  const stats = {
    totalCreators: creatorCount?.count || 0,
    totalBrands: brandCount?.count || 0,
    totalCampaigns: campaignCount?.count || 0,
    openCampaigns: openCampaignCount?.count || 0,
    totalApplications: appCount?.count || 0,
    totalCollaborations: acceptedCount?.count || 0,
    totalReachCrore,
    averageEngagementRate,
  };

  res.json(GetPlatformStatsResponse.parse(stats));
});

router.get("/stats/top-creators", async (req, res): Promise<void> => {
  const query = GetTopCreatorsQueryParams.safeParse(req.query);
  const limit = query.success ? (query.data.limit ?? 10) : 10;

  const rows = await db
    .select()
    .from(creatorsTable)
    .orderBy(desc(creatorsTable.totalFollowers))
    .limit(limit);

  res.json(GetTopCreatorsResponse.parse(rows.map(parseCreator)));
});

router.get("/stats/trending-campaigns", async (req, res): Promise<void> => {
  const query = GetTrendingCampaignsQueryParams.safeParse(req.query);
  const limit = query.success ? (query.data.limit ?? 6) : 6;

  const rows = await db
    .select()
    .from(campaignsTable)
    .where(eq(campaignsTable.status, "open"))
    .orderBy(desc(campaignsTable.applicationCount))
    .limit(limit);

  res.json(GetTrendingCampaignsResponse.parse(rows.map(parseCampaign)));
});

router.get("/stats/category-breakdown", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      category: creatorsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(creatorsTable)
    .groupBy(creatorsTable.category)
    .orderBy(desc(sql<number>`count(*)`));

  res.json(GetCategoryBreakdownResponse.parse(rows));
});

export default router;
