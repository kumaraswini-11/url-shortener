import type { MetadataRoute } from "next";

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
      url: `${BASE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // 2. Dynamic Routes (Generated from data)
  // TODO: Implement if needed

  // Combine static and dynamic routes
  return [...staticRoutes];
}
