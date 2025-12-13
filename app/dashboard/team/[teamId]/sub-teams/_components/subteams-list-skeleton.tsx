/**
 * SubTeams List Skeleton
 *
 * Loading skeleton for the sub-teams list page.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteams-list-skeleton
 */

import { Skeleton } from "@/components/ui/skeleton";

export function SubTeamsListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SubTeamCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function SubTeamCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      {/* Members */}
      <div className="flex -space-x-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-8 w-8 rounded-full border-2 border-background"
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
