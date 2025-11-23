import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { links, clicks } from "@/lib/db/schema";
import { LinkStatsView } from "@/components/link-stats/link-stats-view";
import { BASE_URL } from "@/lib/constants";

export default async function LinkStatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const linkResult = await db
    .select({
      id: links.id,
      code: links.code,
      targetUrl: links.targetUrl,
      clicks: links.clicks,
      createdAt: links.createdAt,
      lastClickedAt: links.lastClickedAt,
      deletedAt: links.deletedAt,
    })
    .from(links)
    .where(eq(links.code, code))
    .limit(1);

  if (linkResult.length === 0 || linkResult[0].deletedAt) {
    notFound();
  }

  const link = linkResult[0];

  // This query will stream in while the shell is already interactive!
  const clickEvents = await db
    .select({
      id: clicks.id,
      clickedAt: clicks.clickedAt,
      ipAddress: clicks.ipAddress,
      country: clicks.country,
      region: clicks.region,
      city: clicks.city,
      userAgent: clicks.userAgent,
    })
    .from(clicks)
    .where(eq(clicks.linkId, link.id))
    .orderBy(desc(clicks.clickedAt))
    .limit(50);

  const shortUrl = `${BASE_URL}/${link.code}`;

  // No Suspense needed! "use cache" handles streaming + fallback automatically
  return <LinkStatsView link={link} clicks={clickEvents} shortUrl={shortUrl} />;
}

//  Beautiful SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return {
    title: `Stats for ${BASE_URL}/${code}`,
    description: `Analytics and click details for your shortened link`,
  };
}
