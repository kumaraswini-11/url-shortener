import { NextRequest } from "next/server";

/**
 * Extracts the visitor IP from a NextRequest object.
 * Works with Vercel, Cloudflare, and typical proxies.
 * @param request NextRequest
 * @returns visitor IP as string
 */
export function getVisitorIp(request: NextRequest): string {
  // Cloudflare
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // Standard reverse proxy headers
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;

  // Fallback
  return "0.0.0.0";
}
