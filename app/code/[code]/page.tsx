"use cache";

import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { db } from "@/lib/db";
import { links, clicks } from "@/lib/db/schema";
import { LinkStatsView } from "@/components/stats/link-stats-view";
import { StatsSkeleton } from "@/components/stats/stats-skeleton";

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const shortUrl = `${baseUrl}/${link.code}`;

  return (
    <Suspense fallback={<StatsSkeleton />}>
      <LinkStatsView link={link} clicks={clickEvents} shortUrl={shortUrl} />
    </Suspense>
  );
}
