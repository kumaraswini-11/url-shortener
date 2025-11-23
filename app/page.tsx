import { desc, isNull } from "drizzle-orm";
import { LinksTableContainer } from "@/components/links/links-table-container";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { Header } from "@/components/header";
import { UrlShortener } from "@/components/url-shortener";
// import { cacheTag } from "next/cache";

export async function getLinks() {
  try {
    // ("use cache");
    // cacheTag("get-all-links");

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
