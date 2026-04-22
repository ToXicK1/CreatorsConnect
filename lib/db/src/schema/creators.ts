import { pgTable, text, serial, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const creatorsTable = pgTable("creators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  bio: text("bio").notNull(),
  profileImageUrl: text("profile_image_url"),
  category: text("category").notNull(),
  languages: text("languages").array().notNull().default([]),
  state: text("state").notNull(),
  city: text("city").notNull(),
  platforms: text("platforms").notNull().default("[]"),
  totalFollowers: integer("total_followers").notNull().default(0),
  engagementRate: real("engagement_rate").notNull().default(0),
  avgViews: integer("avg_views").notNull().default(0),
  ratePerPost: real("rate_per_post").notNull().default(0),
  ratePerReel: real("rate_per_reel").notNull().default(0),
  ratePerVideo: real("rate_per_video").notNull().default(0),
  tags: text("tags").array().notNull().default([]),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCreatorSchema = createInsertSchema(creatorsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Creator = typeof creatorsTable.$inferSelect;
