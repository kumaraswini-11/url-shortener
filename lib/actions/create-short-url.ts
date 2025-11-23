"use server";

import { revalidatePath } from "next/cache";

import { urlShortenerFormSchema } from "@/lib/zod-schemas";
import { UrlFormData } from "@/lib/zod-schemas";

import { BASE_URL } from "../constants";

export async function createShortUrl(data: UrlFormData) {
  const validated = urlShortenerFormSchema.parse(data);

  const response = await fetch(`${BASE_URL}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validated),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to shorten URL");
  }

  revalidatePath("/"); // This now WORKS because it's server-side
  return result; // { code: "abc123" }
}
