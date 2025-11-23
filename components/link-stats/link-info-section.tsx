"use client";

import { ExternalLink } from "lucide-react";
import QRCodeSVG from "react-qr-code";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { LinkData } from "@/lib/utils/stats-utils";

interface LinkInfoSectionProps {
  link: LinkData;
  shortUrl: string;
}

export function LinkInfoSection({ link, shortUrl }: LinkInfoSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-mono text-primary">
            {shortUrl}
          </h1>
          <CopyButton text={shortUrl} />
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <code className="text-muted-foreground break-all">
            {link.targetUrl}
          </code>
          <CopyButton text={link.targetUrl} size="icon" variant="ghost" />
          <Button size="icon" variant="ghost" asChild>
            <a href={link.targetUrl} target="_blank" rel="noopener">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <QRCodeSVG id="qr-svg" value={shortUrl} size={108} level="H" />
      </div>
    </div>
  );
}
