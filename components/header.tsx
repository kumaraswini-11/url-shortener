"use client";

import { Link2 } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/them-toggel";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div
        className={cn(
          "container p-4 max-w-7xl mx-auto",
          "flex items-center justify-between"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Link2 className="size-6 text-primary" />
          <span className="font-bold text-xl">TinyLink</span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
