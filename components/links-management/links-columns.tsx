"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Route } from "next";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "@/components/copy-button";
import { truncateUrl } from "@/lib/utils";
import { DeleteAction } from "./delete-dialog";

// Defines the structure for a single row of link data.
export type LinkRow = {
  id: string | number;
  code: string;
  targetUrl: string;
  clicks: number;
  lastClickedAt: Date | null;
};

// Reusable URL preview component (used in Original URL cell)
const UrlPreviewCell: React.FC<{ url: string }> = ({ url }) => {
  const hostname = new URL(url).hostname;
  const pathname = new URL(url).pathname;
  const displayText = `${hostname}${truncateUrl(pathname, 30)}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 max-w-[280px]">
            <span className="truncate text-sm" title={url}>
              {displayText}
            </span>
            <CopyButton text={url} label="Copy original URL" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-md break-all font-mono text-xs">
          {url}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Short URL cell with external link
const ShortUrlCell = ({ code }: { code: string }) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL!;
  const shortUrl = `${baseUrl}/${code}`;

  return (
    <Button variant="link" size="sm" className="h-auto p-0 font-medium" asChild>
      <Link href={shortUrl as Route} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center gap-1.5">
          {shortUrl}
          <ExternalLink className="size-3.5 opacity-60" />
        </span>
      </Link>
    </Button>
  );
};

// Last clicked relative + exact time tooltip
const LastClickedCell = ({ date }: { date: Date | null }) => {
  if (!date) {
    return <span className="text-muted-foreground text-sm">Never</span>;
  }

  const parsed = new Date(date);
  const relative = formatDistanceToNow(parsed, { addSuffix: true });
  const absolute = format(parsed, "PPP 'at' p");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm cursor-default">{relative}</span>
        </TooltipTrigger>
        <TooltipContent>{absolute}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Main column factory
export const createLinksColumns = (
  onDelete: (code: string) => Promise<void> | void
): ColumnDef<LinkRow>[] => [
  {
    accessorKey: "targetUrl",
    header: "Original URL",
    cell: ({ row }) => <UrlPreviewCell url={row.original.targetUrl} />,
    size: 320,
  },
  {
    accessorKey: "code",
    header: "Short Link",
    cell: ({ row }) => <ShortUrlCell code={row.original.code} />,
    size: 220,
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ row }) => <div className="font-medium">{row.original.clicks}</div>,
    size: 80,
    meta: { align: "center" },
  },
  {
    accessorKey: "lastClickedAt",
    header: "Last Click",
    cell: ({ row }) => <LastClickedCell date={row.original.lastClickedAt} />,
    size: 140,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9" asChild>
                <Link href={`/code/${row.original.code}`}>
                  <BarChart3 className="size-4" />
                  <span className="sr-only">
                    View analytics for {row.original.code}
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Analytics</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DeleteAction code={row.original.code} onDelete={onDelete} />
      </div>
    ),
    size: 100,
    enableSorting: false,
    enableHiding: false,
  },
];
