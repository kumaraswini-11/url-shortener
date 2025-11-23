import { LineChart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClickEvent } from "@/lib/utils/stats-utils";
import { ClickRow } from "./click-row";

interface StatsTableProps {
  clicks: ClickEvent[];
  totalClicks: number;
}

export function StatsTable({ clicks, totalClicks }: StatsTableProps) {
  const hasClicks = clicks.length > 0;
  const showLimitedMessage = hasClicks && clicks.length > 10;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">
          Click Analytics
        </h2>
        {hasClicks && (
          <Badge variant="secondary">Latest {clicks.length} clicks</Badge>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["Time", "Location", "Device", "Browser / OS", "IP"].map(
              (header) => (
                <TableHead key={header} className="text-xs uppercase">
                  {header}
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasClicks ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <LineChart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="font-medium">No clicks yet</p>
                <p className="text-sm text-muted-foreground">
                  Share your link to start tracking
                </p>
              </TableCell>
            </TableRow>
          ) : (
            clicks
              .slice(0, 10)
              .map((click) => <ClickRow key={click.id} click={click} />)
          )}
        </TableBody>
      </Table>

      {showLimitedMessage && (
        <div className="text-center py-3 text-xs text-muted-foreground border-t">
          Showing first 10 of {totalClicks} total clicks
        </div>
      )}
    </>
  );
}
