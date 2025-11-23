"use client";

import { ArrowLeft, FileText, QrCode } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DeleteAction } from "@/components/links-management/delete-dialog";
import {
  LinkData,
  ClickEvent,
  downloadQR,
  exportToCSV,
} from "@/lib/utils/stats-utils";
import { ActionButton } from "./action-button";

interface HeaderActionsProps {
  shortUrl: string;
  link: LinkData;
  clicks: ClickEvent[];
}

export function HeaderActions({ shortUrl, link, clicks }: HeaderActionsProps) {
  return (
    <div className="flex justify-between mb-4">
      <Button variant="secondary" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="size-4 mr-2" /> Back
        </Link>
      </Button>

      <div className="flex gap-2">
        <ActionButton
          icon={QrCode}
          label="Download QR"
          onClick={() => downloadQR(shortUrl, link.code)}
        />
        <ActionButton
          icon={FileText}
          label="Export CSV"
          onClick={() => exportToCSV(link, clicks)}
        />
        <DeleteAction
          code={link.code}
          onDelete={() => toast.success("Link deleted!")}
        />
      </div>
    </div>
  );
}
