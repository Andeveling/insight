/**
 * Results Loading State
 * Skeleton screen for results page
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function ResultsLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Header skeleton */}
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-96" />
      </div>

      {/* Calculating message */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-center gap-4 py-8">
          <Spinner className="h-6 w-6" />
          <p className="text-lg font-medium">
            Calculating your top 5 strengths...
          </p>
        </CardContent>
      </Card>

      {/* Top 5 strengths skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Domain distribution skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
