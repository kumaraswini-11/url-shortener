import { UAParser } from "ua-parser-js";

export interface ParsedUserAgent {
  browserName: string | null;
  browserVersion: string | null;
  engineName: string | null;
  engineVersion: string | null;
  osName: string | null;
  osVersion: string | null;
  deviceVendor: string | null;
  deviceModel: string | null;
  deviceType: string | null;
  cpuArchitecture: string | null;
}

/**
 * Parses a raw User-Agent string into structured device/browser/OS info.
 * @param userAgent Raw User-Agent string from request headers
 * @returns ParsedUserAgent object
 */
export function parseUserAgent(userAgent: string | null): ParsedUserAgent {
  const ua = new UAParser(userAgent || "");

  return {
    browserName: ua.getBrowser().name ?? null,
    browserVersion: ua.getBrowser().version ?? null,
    engineName: ua.getEngine().name ?? null,
    engineVersion: ua.getEngine().version ?? null,
    osName: ua.getOS().name ?? null,
    osVersion: ua.getOS().version ?? null,
    deviceVendor: ua.getDevice().vendor ?? null,
    deviceModel: ua.getDevice().model ?? null,
    deviceType: ua.getDevice().type ?? null,
    cpuArchitecture: ua.getCPU().architecture ?? null,
  };
}
