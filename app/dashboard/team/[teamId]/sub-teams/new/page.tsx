/**
 * New Sub-Team Page
 *
 * Page for creating a new sub-team.
 * Uses PPR pattern with static shell and dynamic form.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/new/page
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { SubTeamForm } from "../_components/subteam-form";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
	getProjectTypeProfiles,
	getTeamMembersForSelector,
} from "@/lib/services/subteam.service";

interface PageProps {
	params: Promise<{
		teamId: string;
	}>;
}

export default async function NewSubTeamPage({ params }: PageProps) {
	const { teamId } = await params;

	return (
		<div className="space-y-6">
			{/* Static header */}
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
						<span className="sr-only">Volver</span>
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Crear Sub-Equipo
					</h1>
					<p className="text-muted-foreground">
						Selecciona miembros y configura el tipo de proyecto.
					</p>
				</div>
			</div>

			{/* Dynamic form */}
			<Suspense fallback={<FormSkeleton />}>
				<NewSubTeamFormContent teamId={teamId} />
			</Suspense>
		</div>
	);
}

/**
 * Form skeleton for loading state
 */
function FormSkeleton() {
	return (
		<div className="space-y-8">
			{/* Name field */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-10 w-full" />
			</div>

			{/* Description field */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-24 w-full" />
			</div>

			{/* Project type */}
			<div className="space-y-4">
				<Skeleton className="h-4 w-28" />
				<div className="grid gap-3 sm:grid-cols-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-24 w-full" />
					))}
				</div>
			</div>

			{/* Members */}
			<div className="space-y-4">
				<Skeleton className="h-4 w-36" />
				<Skeleton className="h-10 w-full" />
				<div className="grid gap-3 sm:grid-cols-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-20 w-full" />
					))}
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-4 pt-4 border-t">
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-32" />
			</div>
		</div>
	);
}

/**
 * Dynamic form content - handles session, authorization, and data fetching
 */
async function NewSubTeamFormContent({ teamId }: { teamId: string }) {
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

	// Fetch data in parallel
	const [members, projectTypes] = await Promise.all([
		getTeamMembersForSelector(teamId),
		getProjectTypeProfiles(),
	]);

	return (
		<SubTeamForm
			mode="create"
			teamId={teamId}
			members={members}
			projectTypes={projectTypes}
		/>
	);
}
