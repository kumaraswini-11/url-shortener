"use client";

import { Suspense, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  LinkRow,
  createLinksColumns,
} from "@/components/links-management/links-columns";
import { LinkDataTable } from "@/components/links-management/links-data-table";
import { deleteLink } from "@/lib/actions/delete-link";

interface LinksTableContainerProps {
  initialLinks: LinkRow[];
}

export function LinksTableContainer({
  initialLinks,
}: LinksTableContainerProps) {
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [isPending, startTransition] = useTransition();

  // Give filterd results
  const filteredLinks = links.filter((link) =>
    `${link.code} ${link.targetUrl}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (code: string) => {
    startTransition(async () => {
      try {
        await deleteLink(code);

        // Remove the deleted link from local state
        setLinks((prev) => prev.filter((link) => link.code !== code));

        toast.success("Link deleted successfully");
      } catch (err) {
        console.error("Failed to delete link:", err);
        toast.error("Failed to delete link");
      }
    });
  };

  const columns = createLinksColumns(handleDelete);

  return (
    <div className="space-y-4 max-w-7xl mx-auto mt-2">
      {/* Search */}
      <div className="relative max-w-md mt-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search links by code or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Suspense fallback={null}>
        <LinkDataTable
          columns={columns}
          data={filteredLinks}
          isLoading={isPending}
        />
      </Suspense>
    </div>
  );
}
