export interface GeoInfo {
  country?: string;
  countryName?: string;
  region?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
}

/**
 * Fetches geolocation info for a public IP.
 * Skips private/local IPs automatically.
 * @param ip IP address to lookup
 * @returns GeoInfo object or null if unavailable
 */
export async function getGeoFromIp(ip: string): Promise<GeoInfo | null> {
  // Skip private & local IPs
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.") // optional private range
  ) {
    return null;
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      country: data.country_code,
      countryName: data.country_name,
      region: data.region,
      city: data.city,
      latitude: data.latitude?.toString(),
      longitude: data.longitude?.toString(),
    };
  } catch (err) {
    console.error("Geo lookup failed:", err);
    return null;
  }
}
