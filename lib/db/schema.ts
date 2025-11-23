import {
  pgTable,
  varchar,
  timestamp,
  integer,
  text,
  index,
} from "drizzle-orm/pg-core";

// 1. Links Table definition
export const links = pgTable(
  "links",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 32 }).notNull().unique(), // 32 = safe for long custom codes
    targetUrl: text("target_url").notNull(),
    clicks: integer("total_clicks").notNull().default(0), // total number of clicks on that particular shortened URL
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastClickedAt: timestamp("last_clicked_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft delete
  },
  (table) => [
    index("links_created_at_idx").on(table.createdAt),
    index("links_last_clicked_at_idx").on(table.lastClickedAt),
    index("links_deleted_at_idx").on(table.deletedAt),
  ]
);

// 2. Clicks Table definition (Analytics)
export const clicks = pgTable(
  "clicks",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    linkId: integer("link_id")
      .notNull()
      .references(() => links.id, { onDelete: "cascade" }),

    // Core
    clickedAt: timestamp("clicked_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ipAddress: varchar("ip_address", { length: 45 }).notNull(), // IPv6 support

    // Raw user agent (always store)
    userAgent: text("user_agent").notNull(),

    // Location (optional — from IP geolocation API — not from UA parser)
    country: varchar("country", { length: 2 }),
    countryName: varchar("country_name", { length: 100 }),
    region: varchar("region", { length: 100 }),
    city: varchar("city", { length: 100 }),
    latitude: varchar("latitude", { length: 20 }),
    longitude: varchar("longitude", { length: 20 }),

    // ua-parser-js fields
    browserName: varchar("browser_name", { length: 50 }),
    browserVersion: varchar("browser_version", { length: 50 }),
    engineName: varchar("engine_name", { length: 50 }),
    engineVersion: varchar("engine_version", { length: 50 }),
    osName: varchar("os_name", { length: 50 }),
    osVersion: varchar("os_version", { length: 50 }),
    deviceVendor: varchar("device_vendor", { length: 100 }), // Apple, Samsung
    deviceModel: varchar("device_model", { length: 100 }), // iPhone, Pixel 8
    deviceType: varchar("device_type", { length: 20 }), // mobile, tablet, desktop, etc.
    cpuArchitecture: varchar("cpu_architecture", { length: 20 }), // arm, x86
  },
  (table) => [
    index("clicks_link_id_idx").on(table.linkId),
    index("clicks_timestamp_idx").on(table.clickedAt),
    index("clicks_country_idx").on(table.country),
    index("clicks_browser_name_idx").on(table.browserName),
  ]
);

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Click = typeof clicks.$inferSelect;
