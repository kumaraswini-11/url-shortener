import { format } from "date-fns";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

// ----- Types -----
export interface ClickEvent {
  id: string | number;
  clickedAt: Date;
  ipAddress: string;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  userAgent: string;
}

export interface LinkData {
  id: string | number;
  code: string;
  targetUrl: string;
  clicks: number;
  createdAt: Date;
  lastClickedAt: Date | null;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  deviceLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export interface LinkStatsViewProps {
  link: LinkData;
  clicks: ClickEvent[];
  shortUrl: string;
}

// ----- Utils functions -----
// Singleton parser instance
const parser = new UAParser();

// Parse User Agent into structured device info
export const parseDeviceInfo = (userAgent: string): DeviceInfo => {
  parser.setUA(userAgent);
  const result = parser.getResult();
  const deviceType = result.device.type ?? "desktop";

  return {
    browser: `${result.browser.name || "Unknown"} ${
      result.browser.version?.split(".")[0] || ""
    }`.trim(),
    os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
    deviceLabel:
      deviceType === "mobile"
        ? "Mobile"
        : deviceType === "tablet"
        ? "Tablet"
        : "Desktop",
    Icon:
      deviceType === "mobile"
        ? Smartphone
        : deviceType === "tablet"
        ? Tablet
        : Monitor,
  };
};

// Get Geo location
export const getLocation = (click: ClickEvent): string =>
  [click.city, click.region, click.country].filter(Boolean).join(", ") ||
  "Unknown";

// Export link analytics to CSV
export const exportToCSV = (link: LinkData, clicks: ClickEvent[]): void => {
  const headers = ["Timestamp", "Location", "IP", "Browser", "OS", "Device"];

  const rows = clicks.map((click) => {
    const { browser, os, deviceLabel } = parseDeviceInfo(click.userAgent);
    return [
      format(click.clickedAt, "yyyy-MM-dd HH:mm:ss"),
      getLocation(click),
      click.ipAddress,
      browser,
      os,
      deviceLabel,
    ]
      .map((value) => `"${value}"`)
      .join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${link.code}-analytics-${format(
    new Date(),
    "yyyy-MM-dd"
  )}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
  toast.success("Exported successfully!");
};

// Download QR code as PNG
export const downloadQR = (shortUrl: string, code: string): void => {
  setTimeout(() => {
    const svg = document.getElementById("qr-svg") as SVGSVGElement | null;
    if (!svg) {
      toast.error("QR code not ready");
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      context!.fillStyle = "white";
      context!.fillRect(0, 0, 1024, 1024);
      context!.drawImage(image, 0, 0, 1024, 1024);
      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${code}-qrcode.png`;
        anchor.click();
        URL.revokeObjectURL(url);
        toast.success("QR code downloaded!");
      });
    };

    image.src = "data:image/svg+xml;base64," + btoa(source);
  }, 100);
};
