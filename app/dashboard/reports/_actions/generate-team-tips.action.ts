"use server";

import { generateObject } from "ai";
import { connection } from "next/server";
import {
	canRegenerate,
	generateStrengthsHash,
	getModel,
	getModelId,
} from "@/lib/ai";
import { prisma } from "@/lib/prisma.db";
import {
	buildTeamTipsPrompt,
	TEAM_TIPS_SYSTEM_PROMPT,
	type TeamTipsPromptContext,
} from "../_lib/ai-prompts";
import { TeamTipsReportSchema } from "../_schemas/team-tips.schema";

export interface GenerateTeamTipsResult {
	success: boolean;
	reportId?: string;
	error?: string;
	fromCache?: boolean;
	canRegenerate?: boolean;
	regenerateMessage?: string;
}

export interface GenerateTeamTipsOptions {
	userId: string;
	teamId: string;
	forceRegenerate?: boolean;
}

/**
 * Generate a personal team tips report for a user
 *
 * @description
 * - Checks if report already exists (returns cached if not regenerating)
 * - Enforces regeneration policy: 30 days minimum OR strength changes
 * - Gathers user's strengths and all teammates' strengths
 * - Generates personalized advice for relating to each team member
 * - Includes book recommendations (personal + team)
 * - Saves report to database with version tracking
 */
export async function generateTeamTips(
	options: GenerateTeamTipsOptions,
): Promise<GenerateTeamTipsResult> {
	await connection();

	const { userId, teamId, forceRegenerate = false } = options;

	try {
		// Fetch user with strengths and profile
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				profile: true,
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
				teamMembers: {
					where: { teamId },
					include: {
						team: true,
					},
				},
			},
		});

		if (!user) {
			return { success: false, error: "Usuario no encontrado" };
		}

		if (user.userStrengths.length === 0) {
			return { success: false, error: "No tienes fortalezas asignadas" };
		}

		const teamMembership = user.teamMembers[0];
		if (!teamMembership) {
			return { success: false, error: "No perteneces a este equipo" };
		}

		// Fetch team with all OTHER members and their strengths
		const team = await prisma.team.findUnique({
			where: { id: teamId },
			include: {
				members: {
					where: {
						userId: { not: userId },
					},
					include: {
						user: {
							include: {
								profile: true,
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

		const teammatesWithStrengths = team.members.filter(
			(m) => m.user.userStrengths.length > 0,
		);

		if (teammatesWithStrengths.length === 0) {
			return {
				success: false,
				error:
					"Tus compañeros de equipo aún no tienen fortalezas asignadas. Este reporte necesita conocer sus perfiles.",
			};
		}

		// Calculate strengths hash (user + all teammates for change detection)
		const userStrengths = user.userStrengths.map((us) => ({
			strengthId: us.strengthId,
			rank: us.rank,
		}));
		const teammateStrengths = teammatesWithStrengths.flatMap((m) =>
			m.user.userStrengths.map((us) => ({
				strengthId: `${m.userId}-${us.strengthId}`,
				rank: us.rank,
			})),
		);
		const currentStrengthsHash = generateStrengthsHash([
			...userStrengths,
			...teammateStrengths,
		]);

		// Check for existing report (unique per user + team combo)
		const existingReport = await prisma.report.findFirst({
			where: {
				userId,
				teamId,
				type: "TEAM_TIPS",
				status: "COMPLETED",
			},
			orderBy: { version: "desc" },
		});

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

		const nextVersion = existingReport ? existingReport.version + 1 : 1;

		// Create or update report record
		const pendingReport = existingReport
			? await prisma.report.update({
					where: { id: existingReport.id },
					data: {
						status: "GENERATING",
						version: nextVersion,
						modelUsed: getModelId(),
					},
				})
			: await prisma.report.create({
					data: {
						type: "TEAM_TIPS",
						status: "GENERATING",
						version: nextVersion,
						userId: user.id,
						teamId: team.id,
						modelUsed: getModelId(),
					},
				});

		try {
			const promptContext: TeamTipsPromptContext = {
				user: {
					id: user.id,
					name: user.name,
					role: teamMembership.role ?? undefined,
					career: user.profile?.career ?? undefined,
					strengths: user.userStrengths.map((us) => ({
						rank: us.rank,
						name: us.strength.name,
						nameEs: us.strength.nameEs,
						domain: us.strength.domain.name,
						briefDefinition: us.strength.briefDefinition,
					})),
				},
				team: {
					name: team.name,
					description: team.description ?? undefined,
				},
				teammates: teammatesWithStrengths.map((member) => ({
					id: member.user.id,
					name: member.user.name,
					role: member.role ?? undefined,
					career: member.user.profile?.career ?? undefined,
					strengths: member.user.userStrengths.map((us) => ({
						rank: us.rank,
						name: us.strength.name,
						nameEs: us.strength.nameEs,
						domain: us.strength.domain.name,
					})),
				})),
			};

			const startTime = Date.now();

			const result = await generateObject({
				model: getModel("team"),
				schema: TeamTipsReportSchema,
				system: TEAM_TIPS_SYSTEM_PROMPT,
				prompt: buildTeamTipsPrompt(promptContext),
				maxOutputTokens: 16000,
			});

			const duration = Date.now() - startTime;

			await prisma.report.update({
				where: { id: pendingReport.id },
				data: {
					status: "COMPLETED",
					content: JSON.stringify(result.object),
					metadata: JSON.stringify({
						generatedAt: new Date().toISOString(),
						durationMs: duration,
						usage: result.usage,
						strengthsHash: currentStrengthsHash,
						teammateCount: teammatesWithStrengths.length,
					}),
				},
			});

			return {
				success: true,
				reportId: pendingReport.id,
				fromCache: false,
			};
		} catch (aiError) {
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
		console.error("[generateTeamTips] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to generate report",
		};
	}
}

/**
 * Get an existing team tips report for a user
 */
export async function getTeamTips(userId: string, teamId: string) {
	await connection();

	const report = await prisma.report.findFirst({
		where: {
			userId,
			teamId,
			type: "TEAM_TIPS",
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
