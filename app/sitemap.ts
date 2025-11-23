import { isNull } from "drizzle-orm";
import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";

// Define the base URL of your application
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

/**
 * Generates the sitemap.xml file.
 * The function name must be 'sitemap'.
 * @returns {Promise<MetadataRoute.Sitemap>} An array of sitemap entries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes (Manually defined)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // 2. Dynamic short links (optional but awesome for SEO)
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const allLinks = await db
      .select({
        code: links.code,
        createdAt: links.createdAt,
      })
      .from(links)
      .where(isNull(links.deletedAt)) // only active links
      .limit(50_000);

    dynamicRoutes = allLinks.map(({ code, createdAt }) => ({
      url: `${BASE_URL}/code/${code}`,
      lastModified: createdAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch (error) {
    console.warn("Failed to generate dynamic sitemap entries:", error);
  }

  // Combine static and dynamic routes
  return [...staticRoutes, ...dynamicRoutes];
}
