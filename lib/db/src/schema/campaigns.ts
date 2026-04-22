import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const campaignsTable = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  brandName: text("brand_name").notNull(),
  brandLogoUrl: text("brand_logo_url"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  brief: text("brief").notNull(),
  category: text("category").notNull(),
  platforms: text("platforms").array().notNull().default([]),
  deliverables: text("deliverables").array().notNull().default([]),
  budget: real("budget").notNull(),
  budgetType: text("budget_type").notNull().default("fixed"),
  targetLanguages: text("target_languages").array().notNull().default([]),
  targetStates: text("target_states").array().notNull().default([]),
  minFollowers: integer("min_followers").notNull().default(0),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("open"),
  applicationCount: integer("application_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;
