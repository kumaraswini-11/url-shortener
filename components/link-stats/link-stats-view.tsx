"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Clock, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HeaderActions } from "@/components/link-stats/header-actions";
import { LinkInfoSection } from "@/components/link-stats/link-info-section";
import { StatBadge } from "@/components/link-stats/stat-badge";
import { StatsTable } from "@/components/link-stats/stats-table";
import { LinkStatsViewProps } from "@/lib/utils/stats-utils";

export function LinkStatsView({ link, clicks, shortUrl }: LinkStatsViewProps) {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/10 px-4 py-6">
      <div className="container mx-auto max-w-6xl">
        <HeaderActions shortUrl={shortUrl} link={link} clicks={clicks} />

        <Card className="shadow-xl">
          <CardHeader className="space-y-6">
            <LinkInfoSection link={link} shortUrl={shortUrl} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatBadge
                icon={TrendingUp}
                label="Total Clicks"
                value={link.clicks.toLocaleString()}
                subtext="All time"
              />
              <StatBadge
                icon={Calendar}
                label="Created"
                value={format(link.createdAt, "MMM d, yyyy")}
                subtext={formatDistanceToNow(link.createdAt, {
                  addSuffix: true,
                })}
              />
              <StatBadge
                icon={Clock}
                label="Last Click"
                value={
                  link.lastClickedAt
                    ? formatDistanceToNow(link.lastClickedAt, {
                        addSuffix: true,
                      })
                    : "Never"
                }
                subtext={
                  link.lastClickedAt
                    ? format(link.lastClickedAt, "MMM d, h:mm a")
                    : "—"
                }
              />
            </div>
          </CardHeader>

          <CardContent>
            <StatsTable clicks={clicks} totalClicks={link.clicks} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
