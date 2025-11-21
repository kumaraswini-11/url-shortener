import {
  pgTable,
  varchar,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 8 }).notNull().unique(),
  targetUrl: varchar("target_url", { length: 2048 }).notNull(),
  totalClicks: integer("total_clicks").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastClickedAt: timestamp("last_clicked_at"),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
