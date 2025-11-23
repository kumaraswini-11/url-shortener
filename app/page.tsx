import { desc, isNull } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { LinksTableContainer } from "@/components/links-management/links-table-container";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { Header } from "@/components/header";
import { UrlShortener } from "@/components/url-shortener";

export async function getLinks() {
  "use cache";
  cacheTag("get-all-links");

  try {
    const allLinks = await db
      .select()
      .from(links)
      .where(isNull(links.deletedAt))
      .orderBy(desc(links.createdAt));

    console.log("Database query result:", allLinks);
    return allLinks;
  } catch (error) {
    console.error("Error fetching links:", error);
    return [];
  }
}

export async function LinksTable() {
  const links = await getLinks();
  return <LinksTableContainer initialLinks={links} />;
}

export default function Home() {
  return (
    <div className="contain-content max-w-7xl">
      <Header /> <UrlShortener /> <LinksTable />
    </div>
  );
}
