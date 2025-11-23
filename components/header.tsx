"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Link2 className="size-6 text-primary" />
          <span className="font-bold text-xl">TinyLink</span>
        </Link>
      </div>
    </header>
  );
}
