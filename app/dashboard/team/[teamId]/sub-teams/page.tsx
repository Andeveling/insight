/**
 * Sub-Teams Page
 *
 * Main page for viewing and managing sub-teams of a team.
 * Uses PPR pattern with static shell and dynamic content.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/page
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { SubTeamsFilters } from "./_components/subteams-filters";
import { SubTeamsList } from "./_components/subteams-list";
import { SubTeamsListSkeleton } from "./_components/subteams-list-skeleton";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
  getProjectTypeProfiles,
  getSubTeamsList,
} from "@/lib/services/subteam.service";
import type { SubTeamFilters, SubTeamSortOption } from "@/lib/types";

interface PageProps {
  params: Promise<{
    teamId: string;
  }>;
  searchParams: Promise<{
    status?: string;
    projectType?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function SubTeamsPage({
  params,
  searchParams,
}: PageProps) {
  const { teamId } = await params;
  const search = await searchParams;

  // Parse filters from search params
  const filters: SubTeamFilters = {
    status: (search.status as SubTeamFilters["status"]) || "all",
    projectType: search.projectType || undefined,
    searchQuery: search.q || undefined,
  };

  const sort = (search.sort as SubTeamSortOption) || "created-desc";

  return (
    <div className="space-y-6">
      {/* Static header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sub-Equipos</h1>
          <p className="text-muted-foreground">
            Organiza tu equipo en grupos especializados para proyectos
            específicos.
          </p>
        </div>

        <Button asChild>
          <Link href={`/dashboard/team/${teamId}/sub-teams/new`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Sub-Equipo
          </Link>
        </Button>
      </div>

      {/* Filters - requires project types */}
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersContent />
      </Suspense>

      {/* Dynamic content */}
      <Suspense fallback={<SubTeamsListSkeleton />}>
        <SubTeamsListContent teamId={teamId} filters={filters} sort={sort} />
      </Suspense>
    </div>
  );
}

/**
 * Filters skeleton
 */
function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-10 w-full max-w-sm" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-[160px]" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[170px]" />
      </div>
    </div>
  );
}

/**
 * Filters content component
 */
async function FiltersContent() {
  const projectTypes = await getProjectTypeProfiles();
  return <SubTeamsFilters projectTypes={projectTypes} />;
}

/**
 * Dynamic content component - handles session, authorization, and data fetching
 */
async function SubTeamsListContent({
  teamId,
  filters,
  sort,
}: {
  teamId: string;
  filters: SubTeamFilters;
  sort: SubTeamSortOption;
}) {
  // Check session
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check user is member of the team
  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: session.user.id,
    },
  });

  if (!membership) {
    redirect("/dashboard");
  }

  // Fetch sub-teams with filters
  const subTeams = await getSubTeamsList(teamId, filters, sort);

  return <SubTeamsList subTeams={subTeams} teamId={teamId} />;
}
