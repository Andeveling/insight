"use server";

import { generateObject } from "ai";
import { connection } from "next/server";
import { getUserProgress } from "@/app/dashboard/development/_actions";
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
	buildIndividualReportPrompt,
	INDIVIDUAL_REPORT_SYSTEM_PROMPT,
	type IndividualPromptContext,
} from "../_lib/ai-prompts";
import {
	buildRequirements,
	calculateIndividualScore,
	type IndividualProgressData,
	isIndividualReady,
} from "../_lib/readiness-calculator";
import { IndividualReportSchema } from "../_schemas/individual-report.schema";

export interface GenerateIndividualReportResult {
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

export interface GenerateIndividualReportOptions {
	userId: string;
	forceRegenerate?: boolean;
	/** Skip readiness check (for backward compatibility, not recommended) */
	bypassReadinessCheck?: boolean;
}

/**
 * Generate an individual strength report for a user
 *
 * @description
 * - Checks if report already exists (returns cached if not regenerating)
 * - Enforces regeneration policy: 30 days minimum OR strength changes
 * - Gathers full user context (profile, strengths, team)
 * - Generates report using AI SDK with structured output
 * - Saves report to database with version tracking
 */
export async function generateIndividualReport(
	options: GenerateIndividualReportOptions,
): Promise<GenerateIndividualReportResult> {
	await connection();

	const {
		userId,
		forceRegenerate = false,
		bypassReadinessCheck = false,
	} = options;

	try {
		// Fetch full user context first (needed for both cache check and generation)
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
					include: {
						team: true,
					},
					take: 1, // Get primary team
				},
			},
		});

		if (!user) {
			return { success: false, error: "Usuario no encontrado" };
		}

		if (user.userStrengths.length === 0) {
			return { success: false, error: "No tienes fortalezas asignadas" };
		}

		// Get user progress for readiness check and context
		const progress = await getUserProgress();
		const hasStrengths = user.userStrengths.length > 0;

		const progressData: IndividualProgressData = {
			modulesCompleted: progress.modulesCompleted,
			xpTotal: progress.xpTotal,
			challengesCompleted: progress.challengesCompleted,
			hasStrengths,
		};

		// Calculate readiness
		const requirements = buildRequirements(progressData);
		const isReady = isIndividualReady(requirements);
		const readinessScore = calculateIndividualScore(progressData);

		// Check readiness (unless bypassed)
		if (!isReady && !bypassReadinessCheck) {
			return {
				success: false,
				error: `Tu perfil aún no está listo para generar un reporte contextualizado. Progreso: ${readinessScore}%`,
			};
		}

		// Calculate current strengths hash for change detection
		const currentStrengthsHash = generateStrengthsHash(
			user.userStrengths.map((us) => ({
				strengthId: us.strengthId,
				rank: us.rank,
			})),
		);

		// Check for existing report
		const existingReport = await prisma.report.findFirst({
			where: {
				userId,
				type: "INDIVIDUAL_FULL",
				status: "COMPLETED",
			},
			orderBy: { version: "desc" },
		});

		// Parse existing metadata to get last strengths hash
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
			// Calculate if regeneration would be allowed
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
						type: "INDIVIDUAL_FULL",
						status: "GENERATING",
						version: nextVersion,
						userId: user.id,
						modelUsed: getModelId(),
					},
				});

		try {
			// Build prompt context with development data
			const promptContext: IndividualPromptContext = {
				user: {
					name: user.name,
					email: user.email,
					profile: user.profile
						? {
								career: user.profile.career ?? undefined,
								age: user.profile.age ?? undefined,
								gender: user.profile.gender ?? undefined,
								description: user.profile.description ?? undefined,
								hobbies: user.profile.hobbies
									? JSON.parse(user.profile.hobbies)
									: undefined,
							}
						: undefined,
					strengths: user.userStrengths.map((us) => ({
						rank: us.rank,
						name: us.strength.name,
						nameEs: us.strength.nameEs,
						domain: us.strength.domain.name,
						briefDefinition: us.strength.briefDefinition,
					})),
				},
				team: user.teamMembers[0]
					? {
							name: user.teamMembers[0].team.name,
							role: user.teamMembers[0].role ?? undefined,
						}
					: undefined,
				// Include development context for enriched reports
				developmentContext: isReady
					? {
							modulesCompleted: progress.modulesCompleted,
							challengesCompleted: progress.challengesCompleted,
							xpTotal: progress.xpTotal,
							currentLevel: progress.level,
							badgesUnlocked: progress.badgesUnlocked,
							streakDays: progress.currentStreak,
							hasStrengths,
						}
					: undefined,
			};

			const startTime = Date.now();

			// Generate report using AI SDK
			const result = await generateObject({
				model: getModel("individual"),
				schema: IndividualReportSchema,
				system: INDIVIDUAL_REPORT_SYSTEM_PROMPT,
				prompt: buildIndividualReportPrompt(promptContext),
				maxOutputTokens: 16000, // Ensure enough tokens for complex schema
			});

			const duration = Date.now() - startTime;

			// Build v2 metadata with development context
			const reportMetadata = {
				version: isReady ? 2 : 1, // v2 for contextual reports
				generatedAt: new Date().toISOString(),
				durationMs: duration,
				usage: result.usage,
				strengthsHash: currentStrengthsHash,
				isContextual: isReady,
				readinessScore,
				developmentSnapshot: isReady
					? {
							modulesCompleted: progress.modulesCompleted,
							challengesCompleted: progress.challengesCompleted,
							xpTotal: progress.xpTotal,
							currentLevel: progress.level,
							badgesUnlocked: progress.badgesUnlocked,
						}
					: undefined,
			};

			// Update report with generated content
			await prisma.report.update({
				where: { id: pendingReport.id },
				data: {
					status: "COMPLETED",
					content: JSON.stringify(result.object),
					metadata: JSON.stringify(reportMetadata),
				},
			});

			// Award XP for first contextual report (v2)
			let xpAwarded = 0;
			if (isReady && nextVersion === 1) {
				try {
					const xpResult = await awardXp({
						userId,
						amount: REPORT_XP_REWARDS.FIRST_INDIVIDUAL_REPORT,
						source: "report_individual",
					});
					xpAwarded = xpResult.xpAwarded;

					// Check for badge unlocks (INSIGHT_INDIVIDUAL badge)
					await checkBadgeUnlocks(userId, { reportIndividualGenerated: true });
				} catch (xpError) {
					console.error("[generateIndividualReport] XP award error:", xpError);
					// Don't fail the report generation if XP award fails
				}
			}

			// Delete old report if regenerating
			if (existingReport && forceRegenerate) {
				await prisma.report.delete({ where: { id: existingReport.id } });
			}

			return {
				success: true,
				reportId: pendingReport.id,
				fromCache: false,
				xpAwarded,
				isContextual: isReady,
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
		console.error("[generateIndividualReport] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to generate report",
		};
	}
}

/**
 * Get an existing individual report
 */
export async function getIndividualReport(userId: string) {
	await connection();

	const report = await prisma.report.findFirst({
		where: {
			userId,
			type: "INDIVIDUAL_FULL",
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
