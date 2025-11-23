import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

const startTime = Date.now();

export async function GET() {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);

    const uptime = Math.floor((Date.now() - startTime) / 1000);

    return NextResponse.json({
      ok: true,
      version: "1.0",
      uptime,
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        version: "1.0",
        error: "Database connection failed",
      },
      { status: 503 }
    );
  }
}
