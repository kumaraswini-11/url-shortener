import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { links, clicks } from "@/lib/db/schema";
import { getGeoFromIp } from "@/lib/utils/get-geo-from-ip";
import { getVisitorIp } from "@/lib/utils/ip";
import { parseUserAgent } from "@/lib/utils/parse-user-agent";
// import { shortCodeSchema } from "@/lib/zod-schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // 1. Validate short code format
    // const parsedCode = shortCodeSchema.safeParse(code);
    // if (!parsedCode.success) {
    //   return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    // }

    // 2. Fetch link
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.code, code))
      .limit(1);

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // 3. Prevent redirecting soft-deleted links
    if (link.deletedAt) {
      return NextResponse.json(
        { error: "This link has been removed" },
        { status: 410 }
      );
    }

    // 4. Extract IP + User-Agent
    const ip = getVisitorIp(request);
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const parsedUA = parseUserAgent(userAgent);

    // 5. Background async analytics + click counter
    void (async () => {
      try {
        // Increment total clicks on links table
        await db
          .update(links)
          .set({
            clicks: sql`${links.clicks} + 1`,
            lastClickedAt: new Date(),
          })
          .where(eq(links.id, link.id));

        // Get geolocation info
        const geo = await getGeoFromIp(ip);

        // Insert full analytics row
        await db.insert(clicks).values({
          linkId: link.id,
          clickedAt: new Date(),
          ipAddress: ip,
          userAgent,
          ...parsedUA,
          ...(geo ?? {}),
        });
      } catch (bgError) {
        console.error("Background analytics insert failed:", bgError);
      }
    })();

    // 6. Safety check for redirect target
    try {
      new URL(link.targetUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid target URL stored in database" },
        { status: 500 }
      );
    }

    // 7. Perform redirect
    return NextResponse.redirect(link.targetUrl, { status: 302 });
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
