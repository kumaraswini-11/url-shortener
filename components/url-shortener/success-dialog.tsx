"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CopyButton } from "@/components/copy-button";

interface SuccessDialogProps {
  shortenedUrl: string | null;
  onClose: () => void;
}

export function SuccessDialog({ shortenedUrl, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={!!shortenedUrl} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-xl">Your URL is ready!</DialogTitle>
        <DialogDescription>
          Here is your shortened URL. You can copy it and share anywhere. For
          analytics and more features, visit the details page.
        </DialogDescription>
        <div className="flex items-center gap-2 my-4">
          <span className="font-mono bg-accent p-2 rounded select-all flex-1">
            {shortenedUrl}
          </span>
          <CopyButton text={shortenedUrl ?? ""} />
        </div>
        <p className="text-sm text-muted-foreground">
          For more details or analytics,{" "}
          <a
            href={shortenedUrl ?? "#"}
            className="underline"
            target="_blank"
            rel="noopener"
          >
            visit the respective link page
          </a>
          .
        </p>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
