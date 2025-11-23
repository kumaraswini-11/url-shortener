import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { shortCodeSchema } from "@/components/url-shortener";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.trim();

    // Validate code format
    const parsed = shortCodeSchema.safeParse(code);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      );
    }

    // Fetch link
    const [link] = await db.select().from(links).where(eq(links.code, code));

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.trim();

    // Validate code
    const parsed = shortCodeSchema.safeParse(code);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      );
    }

    // Perform delete
    // TODO: We can also use deletedAt column, instead of deleting. it avoids data loss.
    // await db
    //   .update(links)
    //   .set({ deletedAt: new Date() })
    //   .where(eq(links.code, code))
    //   .returning();
    const deleted = await db
      .delete(links)
      .where(eq(links.code, code))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
