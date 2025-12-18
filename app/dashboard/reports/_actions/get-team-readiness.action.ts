"use server";

/**
 * Get Team Readiness Action
 *
 * Fetches team member progress and calculates readiness for team report generation.
 * Only team leaders can check team readiness.
 *
 * @feature 009-contextual-reports
 */

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

import {
	buildTeamRequirements,
	calculateIndividualScore,
	calculateTeamScore,
	type IndividualProgressData,
	isTeamReady,
	type TeamProgressData,
} from "../_lib/readiness-calculator";
import type {
	TeamMemberReadiness,
	TeamReadiness,
} from "../_schemas/readiness.schema";

/**
 * Result type for team readiness action
 */
export interface GetTeamReadinessResult {
	success: boolean;
	data?: TeamReadiness;
	error?: string;
}

/**
 * Get team readiness status for report generation
 *
 * @param teamId - The team ID to check readiness for
 * @returns Team readiness data with score, requirements, and member breakdown
 */
export async function getTeamReadiness(
	teamId: string,
): Promise<GetTeamReadinessResult> {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "Usuario no autenticado",
			};
		}

		const userId = session.user.id;

		// Verify user is a team leader
		const membership = await prisma.teamMember.findFirst({
			where: {
				userId,
				teamId,
				role: "LEADER",
			},
			include: {
				team: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!membership) {
			return {
				success: false,
				error: "Solo los líderes de equipo pueden ver el estado de preparación",
			};
		}

		// Fetch all team members with their gamification data
		const teamMembers = await prisma.teamMember.findMany({
			where: { teamId },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						image: true,
						userStrengths: {
							select: { id: true },
							take: 1,
						},
					},
				},
			},
		});

		// Get gamification data for all members
		const memberIds = teamMembers.map((m) => m.userId);
		const gamificationData = await prisma.userGamification.findMany({
			where: {
				userId: { in: memberIds },
			},
		});

		// Create a map for quick lookup
		const gamificationMap = new Map(gamificationData.map((g) => [g.userId, g]));

		// Calculate individual readiness for each member
		const memberBreakdown: TeamMemberReadiness[] = teamMembers.map((member) => {
			const gamification = gamificationMap.get(member.userId);
			const hasStrengths = (member.user.userStrengths?.length ?? 0) > 0;

			const progressData: IndividualProgressData = {
				modulesCompleted: gamification?.modulesCompleted ?? 0,
				xpTotal: gamification?.xpTotal ?? 0,
				challengesCompleted: gamification?.challengesCompleted ?? 0,
				hasStrengths,
			};

			const individualScore = calculateIndividualScore(progressData);

			return {
				userId: member.userId,
				userName: member.user.name ?? "Usuario",
				userAvatar: member.user.image ?? undefined,
				individualScore,
				isReady: individualScore >= 50, // Minimum 50% for individual readiness
			};
		});

		// Build team progress data
		const teamData: TeamProgressData = {
			members: memberBreakdown,
			teamId,
			teamName: membership.team.name,
		};

		// Calculate team readiness
		const score = calculateTeamScore(memberBreakdown);
		const requirements = buildTeamRequirements(teamData);
		const ready = isTeamReady(teamData);

		// Build result
		const readiness: TeamReadiness = {
			type: "team",
			score,
			isReady: ready,
			requirements,
			calculatedAt: new Date(),
			memberBreakdown,
			teamId,
			teamName: membership.team.name,
		};

		return {
			success: true,
			data: readiness,
		};
	} catch (error) {
		console.error("[getTeamReadiness] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}

/**
 * Get teams that the current user is a leader of
 *
 * @returns List of teams the user can generate reports for
 */
export async function getLeadTeams(): Promise<{
	success: boolean;
	teams?: Array<{ id: string; name: string; memberCount: number }>;
	error?: string;
}> {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "Usuario no autenticado",
			};
		}

		const userId = session.user.id;

		const leaderships = await prisma.teamMember.findMany({
			where: {
				userId,
				role: "LEADER",
			},
			include: {
				team: {
					select: {
						id: true,
						name: true,
						_count: {
							select: { members: true },
						},
					},
				},
			},
		});

		const teams = leaderships.map((l) => ({
			id: l.team.id,
			name: l.team.name,
			memberCount: l.team._count.members,
		}));

		return {
			success: true,
			teams,
		};
	} catch (error) {
		console.error("[getLeadTeams] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}
