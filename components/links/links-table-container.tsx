"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LinkRow, createLinksColumns } from "@/components/links/links-columns";
import { LinksDataTable } from "@/components/links/links-data-table";
import { deleteLink } from "@/lib/actions/delete-link";
import { toast } from "sonner";

interface LinksPageClientProps {
  initialLinks: LinkRow[];
}

export function LinksTableContainer({ initialLinks }: LinksPageClientProps) {
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (code: string) => {
    startTransition(async () => {
      try {
        await deleteLink(code);
        toast.success("Link deleted");
      } catch (err) {
        toast.error("Failed to delete link");
      }
    });
  };

  const filteredLinks = links.filter((link) =>
    `${link.code} ${link.targetUrl}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = createLinksColumns(handleDelete);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
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
      <LinksDataTable
        columns={columns}
        data={filteredLinks}
        isLoading={isPending}
      />
    </div>
  );
}
