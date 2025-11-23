import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";

/**
 * Generates the robots.txt file.
 * The function name must be 'robots'.
 * @returns {MetadataRoute.Robots} An object defining robot access rules.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // 1. Global User-agent (Applies to all bots)
    rules: [
      {
        userAgent: "*", // Apply rules to all web crawlers
        allow: "/", // Allow crawling of the entire site by default
      },
    ],

    // 3. Sitemap location (Crucial for discovery)
    sitemap: `${BASE_URL}/sitemap.xml`,

    // 4. Host (Optional but recommended)
    host: BASE_URL,
  };
}
