import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsSkeleton() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background to-muted/10 px-4 py-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-9 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-full max-w-2xl" />
              </div>
              <Skeleton className="h-32 w-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
