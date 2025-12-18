"use server";

import { generateObject } from "ai";
import { connection } from "next/server";
import {
	canRegenerate,
	generateStrengthsHash,
	getModel,
	getModelId,
} from "@/lib/ai";
import { REPORT_XP_REWARDS } from "@/lib/constants/report-thresholds";
import { prisma } from "@/lib/prisma.db";
import {
	awardXp,
	checkBadgeUnlocks,
} from "@/lib/services/gamification.service";
import {
	buildTeamReportPrompt,
	TEAM_REPORT_SYSTEM_PROMPT,
	type TeamPromptContext,
} from "../_lib/ai-prompts";
import {
	buildTeamReportMetadataV2,
	type TeamDevelopmentContext,
	type TeamMemberDevelopmentContext,
} from "../_lib/development-context-builder";
import {
	calculateIndividualScore,
	calculateTeamScore,
	type IndividualProgressData,
	isTeamReady,
	type TeamProgressData,
} from "../_lib/readiness-calculator";
import { TeamReportSchema } from "../_schemas/team-report.schema";

export interface GenerateTeamReportResult {
	success: boolean;
	reportId?: string;
	error?: string;
	fromCache?: boolean;
	canRegenerate?: boolean;
	regenerateMessage?: string;
	/** Whether XP was awarded for this report */
	xpAwarded?: number;
	/** Whether this is a contextual v2 report */
	isContextual?: boolean;
}

export interface GenerateTeamReportOptions {
	teamId: string;
	forceRegenerate?: boolean;
	/** Skip readiness check (for backward compatibility, not recommended) */
	bypassReadinessCheck?: boolean;
}

/**
 * Generate a team assessment report
 *
 * @description
 * - Checks team readiness (all members must have sufficient progress)
 * - Checks if report already exists (returns cached if not regenerating)
 * - Gathers all team members with their strengths and profiles
 * - Builds team development context from gamification data
 * - Generates report using AI SDK with structured output (uses powerful model)
 * - Saves report to database with version tracking
 * - Awards XP to generator and contributing members
 * - Checks for badge unlocks
 */
export async function generateTeamReport(
	options: GenerateTeamReportOptions,
): Promise<GenerateTeamReportResult> {
	await connection();

	const {
		teamId,
		forceRegenerate = false,
		bypassReadinessCheck = false,
	} = options;

	try {
		// Fetch team with all members and their strengths first
		const team = await prisma.team.findUnique({
			where: { id: teamId },
			include: {
				members: {
					include: {
						user: {
							include: {
								profile: true,
								gamification: true,
								userStrengths: {
									include: {
										strength: {
											include: {
												domain: true,
											},
										},
									},
									orderBy: { rank: "asc" },
								},
							},
						},
					},
				},
			},
		});

		if (!team) {
			return { success: false, error: "Equipo no encontrado" };
		}

		if (team.members.length === 0) {
			return { success: false, error: "El equipo no tiene miembros" };
		}

		// Check if members have strengths
		const membersWithStrengths = team.members.filter(
			(m) => m.user.userStrengths.length > 0,
		);

		if (membersWithStrengths.length === 0) {
			return {
				success: false,
				error: "Ningún miembro del equipo tiene fortalezas asignadas",
			};
		}

		// Build team development context from gamification data
		const memberDevelopmentContexts: TeamMemberDevelopmentContext[] =
			membersWithStrengths.map((member) => {
				const gamification = member.user.gamification;
				const hasStrengths = member.user.userStrengths.length > 0;

				const progressData: IndividualProgressData = {
					modulesCompleted: gamification?.modulesCompleted ?? 0,
					xpTotal: gamification?.xpTotal ?? 0,
					challengesCompleted: gamification?.challengesCompleted ?? 0,
					hasStrengths,
				};

				return {
					userId: member.userId,
					userName: member.user.name ?? "Usuario",
					modulesCompleted: progressData.modulesCompleted,
					challengesCompleted: progressData.challengesCompleted,
					xpTotal: progressData.xpTotal,
					currentLevel: gamification?.currentLevel ?? 1,
					hasStrengths,
					readinessScore: calculateIndividualScore(progressData),
				};
			});

		// Calculate team readiness status
		const teamProgressData: TeamProgressData = {
			members: memberDevelopmentContexts.map((m) => ({
				userId: m.userId,
				userName: m.userName,
				individualScore: m.readinessScore,
				isReady: m.readinessScore >= 50,
			})),
			teamId,
			teamName: team.name,
		};

		const teamIsReady = isTeamReady(teamProgressData);
		const teamScore = calculateTeamScore(teamProgressData.members);

		// Check readiness unless bypassed
		if (!bypassReadinessCheck && !teamIsReady) {
			return {
				success: false,
				error: `El equipo no está listo para generar reportes (${teamScore}% preparación). Los miembros necesitan más actividad.`,
			};
		}

		// Build team development context for prompt enrichment
		const readyCount = memberDevelopmentContexts.filter(
			(m) => m.readinessScore >= 50,
		).length;

		const teamDevelopmentContext: TeamDevelopmentContext = {
			teamId,
			teamName: team.name,
			members: memberDevelopmentContexts,
			aggregated: {
				totalModulesCompleted: memberDevelopmentContexts.reduce(
					(sum, m) => sum + m.modulesCompleted,
					0,
				),
				totalChallengesCompleted: memberDevelopmentContexts.reduce(
					(sum, m) => sum + m.challengesCompleted,
					0,
				),
				totalXp: memberDevelopmentContexts.reduce(
					(sum, m) => sum + m.xpTotal,
					0,
				),
				averageLevel:
					memberDevelopmentContexts.reduce(
						(sum, m) => sum + m.currentLevel,
						0,
					) / memberDevelopmentContexts.length,
				membersWithStrengths: memberDevelopmentContexts.filter(
					(m) => m.hasStrengths,
				).length,
				readyMembersCount: readyCount,
				readyMembersPercent: Math.round(
					(readyCount / memberDevelopmentContexts.length) * 100,
				),
			},
		};

		// Calculate team strengths hash (combination of all member strengths)
		const allTeamStrengths = membersWithStrengths.flatMap((m) =>
			m.user.userStrengths.map((us) => ({
				strengthId: `${m.userId}-${us.strengthId}`,
				rank: us.rank,
			})),
		);
		const currentStrengthsHash = generateStrengthsHash(allTeamStrengths);

		// Check for existing report
		const existingReport = await prisma.report.findFirst({
			where: {
				teamId,
				type: "TEAM_FULL",
				status: "COMPLETED",
			},
			orderBy: { version: "desc" },
		});

		// Parse existing metadata
		const existingMetadata = existingReport?.metadata
			? (JSON.parse(existingReport.metadata) as {
					strengthsHash?: string;
					generatedAt?: string;
				})
			: null;

		// Check regeneration policy
		if (existingReport && forceRegenerate) {
			const regenerationCheck = canRegenerate({
				lastGeneratedAt: existingReport.updatedAt,
				lastStrengthsHash: existingMetadata?.strengthsHash ?? null,
				currentStrengthsHash,
			});

			if (!regenerationCheck.allowed) {
				return {
					success: true,
					reportId: existingReport.id,
					fromCache: true,
					canRegenerate: false,
					regenerateMessage: regenerationCheck.reason,
				};
			}
		}

		// Return cached report if exists and not forcing regeneration
		if (existingReport && !forceRegenerate) {
			const regenerationCheck = canRegenerate({
				lastGeneratedAt: existingReport.updatedAt,
				lastStrengthsHash: existingMetadata?.strengthsHash ?? null,
				currentStrengthsHash,
			});

			return {
				success: true,
				reportId: existingReport.id,
				fromCache: true,
				canRegenerate: regenerationCheck.allowed,
				regenerateMessage: regenerationCheck.reason,
			};
		}

		// Calculate next version
		const nextVersion = existingReport ? existingReport.version + 1 : 1;

		// Create or update report record
		const pendingReport = existingReport
			? await prisma.report.update({
					where: { id: existingReport.id },
					data: {
						status: "GENERATING",
						version: nextVersion,
						modelUsed: getModelId(),
						content: null,
						metadata: null,
					},
				})
			: await prisma.report.create({
					data: {
						type: "TEAM_FULL",
						status: "GENERATING",
						version: nextVersion,
						teamId: team.id,
						modelUsed: getModelId(),
					},
				});

		try {
			// Build prompt context with development context for richer insights
			const promptContext: TeamPromptContext = {
				team: {
					name: team.name,
					description: team.description ?? undefined,
				},
				members: membersWithStrengths.map((member) => ({
					name: member.user.name,
					role: member.role ?? undefined,
					career: member.user.profile?.career ?? undefined,
					strengths: member.user.userStrengths.map((us) => ({
						rank: us.rank,
						name: us.strength.name,
						domain: us.strength.domain.name,
					})),
				})),
				developmentContext: teamDevelopmentContext,
			};

			const startTime = Date.now();

			// Generate report using AI SDK with powerful model for team analysis
			const result = await generateObject({
				model: getModel("team"),
				schema: TeamReportSchema,
				system: TEAM_REPORT_SYSTEM_PROMPT,
				prompt: buildTeamReportPrompt(promptContext),
				maxOutputTokens: 16000, // Ensure enough tokens for complex team schema
			});

			const duration = Date.now() - startTime;

			// Build v2 metadata with team development snapshot
			const metadataV2 = buildTeamReportMetadataV2(teamDevelopmentContext);

			// Update report with generated content (include strengthsHash for regeneration policy)
			await prisma.report.update({
				where: { id: pendingReport.id },
				data: {
					status: "COMPLETED",
					content: JSON.stringify(result.object),
					metadata: JSON.stringify({
						...metadataV2,
						durationMs: duration,
						usage: result.usage,
						strengthsHash: currentStrengthsHash,
						memberCount: membersWithStrengths.length,
					}),
				},
			});

			// Delete old report if regenerating
			if (existingReport && forceRegenerate) {
				await prisma.report.delete({ where: { id: existingReport.id } });
			}

			// Find the leader who generated the report (for XP awards)
			const generatorMember = team.members.find((m) => m.role === "LEADER");
			const generatorUserId = generatorMember?.userId;

			// Award XP: Generator gets FIRST_TEAM_REPORT_GENERATOR, contributors get FIRST_TEAM_REPORT_CONTRIBUTOR
			let totalXpAwarded = 0;

			if (generatorUserId) {
				// Award XP to the report generator
				await awardXp({
					userId: generatorUserId,
					amount: REPORT_XP_REWARDS.FIRST_TEAM_REPORT_GENERATOR,
					source: "report_team_generator",
				});
				totalXpAwarded += REPORT_XP_REWARDS.FIRST_TEAM_REPORT_GENERATOR;

				// Check for badge unlocks for the generator
				await checkBadgeUnlocks(generatorUserId, {
					reportTeamGenerated: true,
				});
			}

			// Award XP to contributing members (non-leaders with strengths)
			const contributorMembers = membersWithStrengths.filter(
				(m) => m.role !== "LEADER",
			);

			for (const contributor of contributorMembers) {
				await awardXp({
					userId: contributor.userId,
					amount: REPORT_XP_REWARDS.FIRST_TEAM_REPORT_CONTRIBUTOR,
					source: "report_team_contributor",
				});
				totalXpAwarded += REPORT_XP_REWARDS.FIRST_TEAM_REPORT_CONTRIBUTOR;
			}

			return {
				success: true,
				reportId: pendingReport.id,
				fromCache: false,
				isContextual: true,
				xpAwarded: totalXpAwarded,
			};
		} catch (aiError) {
			// Mark report as failed
			await prisma.report.update({
				where: { id: pendingReport.id },
				data: {
					status: "FAILED",
					error: aiError instanceof Error ? aiError.message : "Unknown error",
				},
			});

			throw aiError;
		}
	} catch (error) {
		console.error("[generateTeamReport] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to generate report",
		};
	}
}

/**
 * Get an existing team report
 */
export async function getTeamReport(teamId: string) {
	await connection();

	const report = await prisma.report.findFirst({
		where: {
			teamId,
			type: "TEAM_FULL",
			status: "COMPLETED",
		},
		orderBy: { version: "desc" },
	});

	if (!report || !report.content) {
		return null;
	}

	return {
		id: report.id,
		version: report.version,
		createdAt: report.createdAt,
		updatedAt: report.updatedAt,
		modelUsed: report.modelUsed,
		metadata: report.metadata ? JSON.parse(report.metadata) : null,
		content: JSON.parse(report.content),
	};
}

/**
 * Get all reports for a team
 */
export async function getTeamReports(teamId: string) {
	await connection();

	const reports = await prisma.report.findMany({
		where: {
			teamId,
			status: "COMPLETED",
		},
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			type: true,
			version: true,
			createdAt: true,
			modelUsed: true,
		},
	});

	return reports;
}
