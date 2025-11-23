import { desc, isNull } from "drizzle-orm";
// import { cacheTag } from "next/cache";
// import { cacheLife } from "next/cache";

import { LinksTableContainer } from "@/components/links-management/links-table-container";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { Header } from "@/components/header";
import { UrlShortener } from "@/components/url-shortener";

export async function getLinks() {
  // "use cache";
  // cacheTag("get-all-links");
  // cacheLife({ revalidate: 100 }); // 1 minutes

  try {
    const allLinks = await db
      .select()
      .from(links)
      .where(isNull(links.deletedAt))
      .orderBy(desc(links.createdAt));

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
    <>
      <Header />
      <UrlShortener />
      <LinksTable />
    </>
  );
}
