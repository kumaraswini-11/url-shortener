import { type NextRequest, NextResponse } from "next/server";
import { eq, or, ilike, desc } from "drizzle-orm";

// import { urlShortenerFormSchema } from "@/components/url-shortener";
import { generateRandomCode } from "@/lib/utils";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate input
    // const validation = urlShortenerFormSchema.safeParse(body);
    // if (!validation.success) {
    //   return NextResponse.json(
    //     { error: "Invalid input", details: validation.error },
    //     { status: 400 }
    //   );
    // }

    const { originalUrl, customCode } = body;

    // 2. Generate or use custom code
    const code = customCode?.trim() || generateRandomCode();

    // 3. Ensure code is unique
    const existing = await db.select().from(links).where(eq(links.code, code));
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Code already exists", code },
        { status: 409 }
      );
    }

    // 4. Insert new link
    const inserted = await db
      .insert(links)
      .values({
        code,
        targetUrl: originalUrl,
        clicks: 0,
      })
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search")?.trim() || "";

    let linksData;

    if (query) {
      // Search by code or targetUrl (case-insensitive)
      linksData = await db
        .select()
        .from(links)
        .where(
          or(
            ilike(links.code, `%${query}%`),
            ilike(links.targetUrl, `%${query}%`)
          )
        )
        .orderBy(desc(links.createdAt));
    } else {
      // Fetch all links if no search query
      linksData = await db.select().from(links).orderBy(desc(links.createdAt));
    }

    return NextResponse.json(linksData);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
