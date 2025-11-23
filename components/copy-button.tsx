"use client";

import { Copy, Check } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  text: string;
  label?: string;
  duration?: number;
}

export function CopyButton({
  text,
  label = "Copy to clipboard",
  duration = 1500,
  ...props
}: CopyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Official React 19 recommendation for UI feedback during async actions
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        // Cleanup timeout if component unmounts early
        setTimeout(() => setCopied(false), duration);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  };

  const isLoading = isPending || copied;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={isPending}
            aria-label={copied ? "Copied!" : label}
            {...props}
          >
            <span className="sr-only">{isLoading ? "Copied!" : label}</span>
            {isLoading ? (
              <Check className="size-4 text-green-600" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isLoading ? "Copied!" : label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
