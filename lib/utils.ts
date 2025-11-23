import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper: Truncate long URLs for display
export const truncateUrl = (url: string, maxLength = 50) => {
  return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
};

// Helper: Generate random alphanumeric code
export const generateRandomCode = (length: number = 6): string => {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
};
