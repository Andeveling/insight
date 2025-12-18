"use server";

/**
 * Get All Reports Readiness Action
 *
 * Fetches readiness status and report availability for all report types.
 * Used by the unified reports dashboard.
 *
 * @feature 009-contextual-reports
 */

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

import {
	calculateIndividualScore,
	type IndividualProgressData,
} from "../_lib/readiness-calculator";

/**
 * Individual report status
 */
export interface IndividualReportStatus {
	readinessScore: number;
	isReady: boolean;
	hasExistingReport: boolean;
	canRegenerate: boolean;
}

/**
 * Team report status
 */
export interface TeamReportStatus {
	teamId: string;
	teamName: string;
	memberCount: number;
	readinessScore: number;
	isReady: boolean;
	hasExistingReport: boolean;
	canRegenerate: boolean;
}

/**
 * All reports status
 */
export interface AllReportsStatus {
	individual: IndividualReportStatus | null;
	teams: TeamReportStatus[];
}

/**
 * Result type
 */
export interface GetAllReportsStatusResult {
	success: boolean;
	data?: AllReportsStatus;
	error?: string;
}

/**
 * Get status of all available reports for the current user
 */
export async function getAllReportsStatus(): Promise<GetAllReportsStatusResult> {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "Usuario no autenticado",
			};
		}

		const userId = session.user.id;

		// Fetch user data with gamification and strengths
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				userStrengths: {
					select: { id: true },
					take: 1,
				},
			},
		});

		if (!user) {
			return {
				success: false,
				error: "Usuario no encontrado",
			};
		}

		// Get gamification data
		const gamification = await prisma.userGamification.findUnique({
			where: { userId },
		});

		// Calculate individual readiness
		const hasStrengths = (user.userStrengths?.length ?? 0) > 0;
		const progressData: IndividualProgressData = {
			modulesCompleted: gamification?.modulesCompleted ?? 0,
			xpTotal: gamification?.xpTotal ?? 0,
			challengesCompleted: gamification?.challengesCompleted ?? 0,
			hasStrengths,
		};

		const individualScore = calculateIndividualScore(progressData);
		const individualIsReady = individualScore >= 50 && hasStrengths;

		// Check for existing individual report
		const existingIndividualReport = await prisma.report.findFirst({
			where: {
				userId,
				type: "INDIVIDUAL_FULL",
				status: "COMPLETED",
			},
			orderBy: { version: "desc" },
			select: { id: true, updatedAt: true },
		});

		// Individual report status
		const individualStatus: IndividualReportStatus = {
			readinessScore: individualScore,
			isReady: individualIsReady,
			hasExistingReport: !!existingIndividualReport,
			canRegenerate: !!existingIndividualReport,
		};

		// Get teams where user is a leader
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
						members: {
							include: {
								user: {
									select: {
										id: true,
										userStrengths: {
											select: { id: true },
											take: 1,
										},
									},
								},
							},
						},
					},
				},
			},
		});

		// Get gamification data for all team members
		const allMemberIds = leaderships.flatMap((l) =>
			l.team.members.map((m) => m.userId),
		);
		const memberGamification = await prisma.userGamification.findMany({
			where: {
				userId: { in: allMemberIds },
			},
		});
		const gamificationMap = new Map(
			memberGamification.map((g) => [g.userId, g]),
		);

		// Get existing team reports
		const teamIds = leaderships.map((l) => l.team.id);
		const existingTeamReports = await prisma.report.findMany({
			where: {
				teamId: { in: teamIds },
				type: "TEAM_FULL",
				status: "COMPLETED",
			},
			orderBy: { version: "desc" },
			select: { id: true, teamId: true },
		});
		const teamReportMap = new Map(
			existingTeamReports.map((r) => [r.teamId!, r]),
		);

		// Calculate team statuses
		const teamStatuses: TeamReportStatus[] = leaderships.map((leadership) => {
			const team = leadership.team;
			const members = team.members;

			// Calculate each member's readiness
			let readyMembersCount = 0;
			for (const member of members) {
				const memberGam = gamificationMap.get(member.userId);
				const memberHasStrengths = (member.user.userStrengths?.length ?? 0) > 0;

				const memberProgress: IndividualProgressData = {
					modulesCompleted: memberGam?.modulesCompleted ?? 0,
					xpTotal: memberGam?.xpTotal ?? 0,
					challengesCompleted: memberGam?.challengesCompleted ?? 0,
					hasStrengths: memberHasStrengths,
				};

				const memberScore = calculateIndividualScore(memberProgress);
				if (memberScore >= 50) {
					readyMembersCount++;
				}
			}

			const readyPercent =
				members.length > 0
					? Math.round((readyMembersCount / members.length) * 100)
					: 0;

			// Team is ready if at least 60% of members are ready
			const teamIsReady = readyPercent >= 60;
			const hasExisting = teamReportMap.has(team.id);

			return {
				teamId: team.id,
				teamName: team.name,
				memberCount: members.length,
				readinessScore: readyPercent,
				isReady: teamIsReady,
				hasExistingReport: hasExisting,
				canRegenerate: hasExisting,
			};
		});

		return {
			success: true,
			data: {
				individual: hasStrengths ? individualStatus : null,
				teams: teamStatuses,
			},
		};
	} catch (error) {
		console.error("[getAllReportsStatus] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}
