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

import { SubTeamsList } from "./_components/subteams-list";
import { SubTeamsListSkeleton } from "./_components/subteams-list-skeleton";

import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { getSubTeamsList } from "@/lib/services/subteam.service";

interface PageProps {
  params: Promise<{
    teamId: string;
  }>;
}

export default async function SubTeamsPage({ params }: PageProps) {
  const { teamId } = await params;

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

      {/* Dynamic content */}
      <Suspense fallback={<SubTeamsListSkeleton />}>
        <SubTeamsListContent teamId={teamId} />
      </Suspense>
    </div>
  );
}

/**
 * Dynamic content component - handles session, authorization, and data fetching
 */
async function SubTeamsListContent({ teamId }: { teamId: string }) {
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

  // Fetch sub-teams
  const subTeams = await getSubTeamsList(teamId);

  return <SubTeamsList subTeams={subTeams} teamId={teamId} />;
}
