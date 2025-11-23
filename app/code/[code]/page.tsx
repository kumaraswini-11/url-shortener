import { format, formatDistanceToNow } from "date-fns";
import QRCodeSVG from "react-qr-code";
import { UAParser } from "ua-parser-js";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  FileText,
  QrCode,
  Calendar,
  Clock,
  LineChart,
  TrendingUp,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { DeleteAction } from "@/components/links/links-columns";
import { linkData } from "@/app/page";
import { Route } from "next";

interface ClickEvent {
  id: string;
  timestamp: string;
  ip: string;
  location: string;
  userAgent: string;
}

export interface LinkStats {
  code: string;
  targetUrl: string;
  totalClicks: number;
  createdAt: string;
  lastClickedAt: string | null;
  clicks: ClickEvent[];
}

interface DeviceInfo {
  browser: string;
  os: string;
  deviceType: string;
  deviceLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
}

// Parse user agent to extract device info
const parser = new UAParser();
const parseDeviceInfo = (ua: string): DeviceInfo => {
  parser.setUA(ua);
  const result = parser.getResult();
  const deviceType = result.device.type || "desktop";

  return {
    browser: `${result.browser.name || "Unknown"} ${
      result.browser.version?.split(".")[0] || ""
    }`.trim(),
    os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
    deviceType,
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

// Export clicks data to CSV
const exportClicksToCSV = (data: LinkStats): void => {
  try {
    const headers = ["Timestamp", "Location", "IP", "Browser", "OS", "Device"];
    const rows = data.clicks.map((click) => {
      const { browser, os, deviceLabel } = parseDeviceInfo(click.userAgent);
      return [
        format(new Date(click.timestamp), "yyyy-MM-dd HH:mm:ss"),
        click.location,
        click.ip,
        browser,
        os,
        deviceLabel,
      ]
        .map((f) => `"${f}"`)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.code}-analytics-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Analytics exported!");
  } catch (error) {
    toast.error("Export failed");
  }
};

// Download QR code as PNG
const downloadQRCode = (shortUrl: string, code: string): void => {
  try {
    const svg = document.getElementById("qr-svg") as unknown as SVGSVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.drawImage(img, 0, 0, 1024, 1024);
      }
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `${code}-qrcode.png`;
      a.click();
      toast.success("QR code downloaded!");
    };

    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    img.src = URL.createObjectURL(svgBlob);
  } catch (error) {
    toast.error("Download failed");
  }
};

const StatBadge = ({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-muted/70   min-w-0">
    <div className="p-2 rounded-md bg-primary/10">
      <Icon className="size-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-foreground leading-none mb-1">
        {value}
      </div>
      <div className="text-xs text-muted-foreground leading-tight">
        {subtext}
      </div>
    </div>
  </div>
);

const ActionBtn = ({
  icon: Icon,
  label,
  onClick,
  variant = "secondary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "ghost" | "default" | "outline" | "secondary";
}) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          onClick={onClick}
          className="h-9 w-9 transition-all hover:scale-105"
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs px-2 py-1">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ClickRow = ({ click }: { click: ClickEvent }) => {
  const { deviceLabel, Icon, browser, os } = parseDeviceInfo(click.userAgent);
  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      <TableCell className="px-4 py-3 text-xs font-medium whitespace-nowrap">
        {format(new Date(click.timestamp), "MMM d, h:mm a")}
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {click.location}
        </div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">{deviceLabel}</span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-xs">
        <div className="font-medium">{browser}</div>
        <div className="text-[11px] text-muted-foreground">{os}</div>
      </TableCell>
      <TableCell className="px-4 py-3">
        <code className="text-[11px] text-muted-foreground bg-muted/70 px-2 py-1 rounded">
          {click.ip}
        </code>
      </TableCell>
    </TableRow>
  );
};

// Main Component
export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  // Await params in Server Component
  const { code } = await params;
  console.log("Dynamic code from params:", code);

  // TODO: Server-side fetch
  // const link = await getLinkByCode(code);
  // if (!link) {
  //   notFound();
  // }

  const shortUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${linkData.code}`
      : "";
  const hasClicks = linkData.clicks.length > 0;

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/10 px-4 py-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="secondary" size="sm" asChild className="gap-2 h-9">
            <Link href="/">
              <ArrowLeft className="size-4" />
              <span className="text-sm">Back</span>
            </Link>
          </Button>

          {/*  Action Buttons */}
          <div className="flex items-center gap-1.5">
            <ActionBtn
              icon={QrCode}
              label="Download QR"
              onClick={() => downloadQRCode(shortUrl, linkData.code)}
            />
            <ActionBtn
              icon={FileText}
              label="Export CSV"
              onClick={() => exportClicksToCSV(linkData)}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex">
                  <DeleteAction
                    code={linkData.code}
                    onDelete={() => toast.success("Deleted!")}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                Delete Link
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-muted/40 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-4 space-y-4">
            {/* URL Section */}
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="flex-1 space-y-1 min-w-0">
                {/* Short URL */}
                <div className="flex items-center gap-2 flex-wrap pl-1">
                  <h1 className="text-2xl font-bold font-mono text-primary break-all leading-tight">
                    {shortUrl}
                  </h1>
                  <CopyButton text={shortUrl} className="h-7 w-7 shrink-0" />
                </div>

                {/* Target URL */}
                <div className="flex items-center gap-3 flex-wrap text-sm bg-muted/40 rounded-md px-1 py-1">
                  <code className="text-muted-foreground break-all text-sm">
                    {linkData.targetUrl}
                  </code>
                  <div className="flex items-center gap-1">
                    <CopyButton
                      text={linkData.targetUrl}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                      className="h-6 w-6"
                    >
                      <Link
                        href={linkData.targetUrl as Route}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="shrink-0">
                <div className="p-3 bg-white rounded-lg border-2 border-primary/15 shadow-lg">
                  <QRCodeSVG
                    id="qr-svg"
                    value={shortUrl}
                    size={108}
                    level="H"
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatBadge
                icon={TrendingUp}
                label="Total Clicks"
                value={linkData.totalClicks.toLocaleString()}
                subtext="All-time interactions"
              />
              <StatBadge
                icon={Calendar}
                label="Created"
                value={format(new Date(linkData.createdAt), "MMM d, yyyy")}
                subtext={formatDistanceToNow(new Date(linkData.createdAt), {
                  addSuffix: true,
                })}
              />
              <StatBadge
                icon={Clock}
                label="Last Click"
                value={
                  linkData.lastClickedAt
                    ? formatDistanceToNow(new Date(linkData.lastClickedAt), {
                        addSuffix: true,
                      })
                    : "Never"
                }
                subtext={
                  linkData.lastClickedAt
                    ? format(new Date(linkData.lastClickedAt), "MMM d, h:mm a")
                    : "Awaiting first click"
                }
              />
            </div>
          </CardHeader>

          {/* Analytics Table */}
          <CardContent className="px-6">
            <div className="px-4 py-2 flex items-center justify-between bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Click Analytics
              </h2>
              {hasClicks && (
                <Badge variant="secondary" className="text-xs px-2 py-1 h-5">
                  Recent {linkData.clicks.length} clicks
                </Badge>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table className="border border-card rounded-2xl">
                <TableHeader>
                  <TableRow className="border-b border-muted/40">
                    {["Time", "Location", "Device", "Browser / OS", "IP"].map(
                      (label) => (
                        <TableHead
                          key={label}
                          className="px-4 py-2 text-xs font-medium uppercase tracking-tight text-muted-foreground"
                        >
                          {label}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!hasClicks ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 bg-white/30"
                      >
                        <div className="flex flex-col items-center gap-2.5">
                          <LineChart className="h-10 w-10 text-muted-foreground/40" />
                          <p className="text-base font-medium text-muted-foreground">
                            No clicks yet
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Share your link to start tracking
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    linkData.clicks
                      .slice(0, 10)
                      .map((click) => <ClickRow key={click.id} click={click} />)
                  )}
                </TableBody>
              </Table>
            </div>

            {hasClicks && linkData.clicks.length > 10 && (
              <div className="px-5 py-2 bg-muted/20 border-t border-muted/30 text-center">
                <p className="text-xs text-muted-foreground">
                  Showing 10 of {linkData.clicks.length} total clicks
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
