"use server";

import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";

// Server Action for delete
export async function deleteLink(code: string) {
  const result = await db
    .update(links)
    .set({ deletedAt: new Date() })
    .where(eq(links.code, code))
    .returning();

  if (result.length === 0) {
    throw new Error("Link not found");
  }

  // Refresh the dashboard instantly
  revalidatePath("/");
  revalidatePath("/code/[code]");

  return { success: true };
}
