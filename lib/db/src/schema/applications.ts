import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  creatorId: integer("creator_id").notNull(),
  creatorName: text("creator_name").notNull(),
  creatorUsername: text("creator_username").notNull(),
  creatorProfileImageUrl: text("creator_profile_image_url"),
  campaignTitle: text("campaign_title").notNull(),
  brandName: text("brand_name").notNull(),
  pitch: text("pitch").notNull(),
  proposedRate: real("proposed_rate"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
