/**
 * Sub-Team Detail Page
 *
 * Page for viewing sub-team details.
 * Uses PPR pattern with static shell and dynamic content.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/[subTeamId]/page
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { SubTeamDetail } from "../_components/subteam-detail";
import { SubTeamDetailClient } from "../_components/subteam-detail-client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
	getSubTeamDetail,
	getTeamMembersForSelector,
	getSuggestedMembersForGap,
} from "@/lib/services/subteam.service";

interface PageProps {
	params: Promise<{
		teamId: string;
		subTeamId: string;
	}>;
}

export default async function SubTeamDetailPage({ params }: PageProps) {
	const { teamId, subTeamId } = await params;

	return (
		<div className="space-y-6">
			{/* Static back button */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href={`/dashboard/team/${teamId}/sub-teams`}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						<span className="sr-only">Volver a la lista</span>
					</Link>
				</Button>
			</div>

			{/* Dynamic content */}
			<Suspense fallback={<DetailSkeleton />}>
				<SubTeamDetailContent teamId={teamId} subTeamId={subTeamId} />
			</Suspense>
		</div>
	);
}

/**
 * Detail skeleton for loading state
 */
function DetailSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-6 w-16" />
					</div>
					<Skeleton className="h-4 w-64" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-24" />
				</div>
			</div>

			{/* Cards grid */}
			<div className="grid gap-6 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className="h-32 w-full" />
				))}
			</div>

			{/* Members */}
			<div className="space-y-4">
				<Skeleton className="h-6 w-36" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-24 w-full" />
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Dynamic content component - handles session, authorization, and data fetching
 */
async function SubTeamDetailContent({
	teamId,
	subTeamId,
}: {
	teamId: string;
	subTeamId: string;
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

	// Fetch sub-team detail
	const subTeam = await getSubTeamDetail(subTeamId);

	if (!subTeam) {
		notFound();
	}

	// Verify sub-team belongs to the team
	if (subTeam.parentTeamId !== teamId) {
		notFound();
	}

	// Get all team members for What-If simulator
	const allTeamMembers = await getTeamMembersForSelector(teamId);

	// Get suggested members for gaps
	const missingStrengths =
		subTeam.analysis?.gaps
			?.filter((g) => g.priority === "critical" || g.priority === "recommended")
			.map((g) => g.strengthName) || [];

	const suggestedMembers = await getSuggestedMembersForGap(
		teamId,
		subTeam.members,
		missingStrengths,
		3,
	);

	return (
		<>
			<SubTeamDetail subTeam={subTeam} teamId={teamId} />
			<SubTeamDetailClient
				subTeam={subTeam}
				teamId={teamId}
				availableMembers={allTeamMembers}
				suggestedMembers={suggestedMembers}
			/>
		</>
	);
}
