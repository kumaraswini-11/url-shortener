import { z } from "zod";

// Zod schemas for validation
export const shortCodeSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]{6,32}$/, "Invalid short code");

export const urlShortenerFormSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  customCode: shortCodeSchema.optional(),
});

export type UrlFormData = z.infer<typeof urlShortenerFormSchema>;
