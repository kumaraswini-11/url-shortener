import type { MetadataRoute } from "next";

// Define the base URL locally for simplicity
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

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
        // Disallow crawling of specific paths (e.g., private admin pages, search results)
        disallow: ["/private/"],
      },
    ],

    // 3. Sitemap location (Crucial for discovery)
    sitemap: `${BASE_URL}/sitemap.xml`,

    // 4. Host (Optional but recommended)
    host: BASE_URL,
  };
}
