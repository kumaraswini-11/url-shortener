"use client";

import { Header } from "@/components/header";
import { UrlShortener } from "@/components/url-shortener";
import { LinkRow } from "@/components/links/links-columns";
import { LinksTableContainer } from "@/components/links/links-table-container";
import { LinkStats } from "./code/[code]/page";

export const sampleLinks: LinkRow[] = [
  {
    id: 1,
    code: "abc123",
    targetUrl: "https://www.google.com/search?q=nextjs+15",
    totalClicks: 42,
    lastClickedAt: "2025-01-12T14:23:00.000Z",
  },
  {
    id: 2,
    code: "devhub",
    targetUrl: "https://github.com/vercel/next.js",
    totalClicks: 128,
    lastClickedAt: "2025-01-14T09:55:00.000Z",
  },
  {
    id: 3,
    code: "docs",
    targetUrl: "https://nextjs.org/docs/app/building-your-application",
    totalClicks: 19,
    lastClickedAt: null, // never clicked
  },
  {
    id: 4,
    code: "yt001",
    targetUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    totalClicks: 256,
    lastClickedAt: "2025-01-13T18:20:00.000Z",
  },
  {
    id: 5,
    code: "blog42",
    targetUrl: "https://medium.com/@someone/how-i-built-a-link-shortener",
    totalClicks: 7,
    lastClickedAt: null,
  },
];

export const linkData: LinkStats = {
  code: "abc123",
  targetUrl:
    "https://example.com/very-long-url-that-needs-shortening?ref=marketing-campaign",
  totalClicks: 87,
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  lastClickedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  clicks: [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      ip: "203.0.113.42",
      location: "Tokyo, Japan",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      ip: "198.51.100.23",
      location: "Berlin, Germany",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129...",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      ip: "192.0.2.155",
      location: "Sydney, Australia",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Firefox/130...",
    },
  ],
};

// Simulate server fetch
async function getLinks() {
  // Replace with real DB call
  return sampleLinks;
}

export async function LinksTable() {
  const links = await getLinks();

  return <LinksTableContainer initialLinks={links} />;
}

export default function Home() {
  return (
    <div className="contain-content max-w-7xl">
      <Header />
      <UrlShortener />
      <LinksTable />
    </div>
  );
}
