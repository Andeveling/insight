/**
 * AI Coach Service
 *
 * Provides AI-powered recommendations for modules, challenges, and peer matching.
 * Uses OpenAI GPT-4o-mini for generating personalized recommendations.
 */

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma.db";
import {
	DEFAULT_RECOMMENDATION_CACHE_CONFIG,
	type AiRecommendationResponse,
	type AvailableModule,
	type ModuleRecommendation,
	type PeerMatchRecommendation,
	type RecommendationType,
	type UserStrength,
} from "@/lib/types/ai-coach.types";
import { createHash } from "crypto";

// Initialize OpenAI client
const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a hash of user strengths for cache invalidation
 */
function generateStrengthsHash(strengths: UserStrength[]): string {
	const strengthString = strengths
		.sort((a, b) => a.rank - b.rank)
		.map((s) => `${s.strengthKey}:${s.rank}`)
		.join(",");

	return createHash("md5").update(strengthString).digest("hex");
}

/**
 * Check if cached recommendation is still valid
 */
async function getCachedRecommendation(
	userId: string,
	type: RecommendationType,
	currentStrengthsHash: string,
): Promise<AiRecommendationResponse<unknown> | null> {
	const cached = await prisma.userRecommendation.findUnique({
		where: {
			userId_recommendationType: {
				userId,
				recommendationType: type,
			},
		},
	});

	if (!cached) return null;

	// Check if expired
	if (new Date() > cached.expiresAt) return null;

	// Check if strengths changed
	if (cached.strengthsHash !== currentStrengthsHash) return null;

	return {
		recommendations: JSON.parse(cached.recommendations),
		generatedAt: cached.createdAt,
		expiresAt: cached.expiresAt,
		modelUsed: cached.modelUsed,
		strengthsHash: cached.strengthsHash,
	};
}

/**
 * Save recommendation to cache
 */
async function cacheRecommendation(
	userId: string,
	type: RecommendationType,
	recommendations: unknown[],
	strengthsHash: string,
	modelUsed: string,
): Promise<void> {
	const ttlDays = DEFAULT_RECOMMENDATION_CACHE_CONFIG.ttlDays;
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + ttlDays);

	await prisma.userRecommendation.upsert({
		where: {
			userId_recommendationType: {
				userId,
				recommendationType: type,
			},
		},
		update: {
			recommendations: JSON.stringify(recommendations),
			strengthsHash,
			modelUsed,
			expiresAt,
		},
		create: {
			userId,
			recommendationType: type,
			recommendations: JSON.stringify(recommendations),
			strengthsHash,
			modelUsed,
			expiresAt,
		},
	});
}

/**
 * Get user's strengths with domain info
 */
async function getUserStrengths(userId: string): Promise<UserStrength[]> {
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId },
		include: {
			strength: {
				include: {
					domain: true,
				},
			},
		},
		orderBy: { rank: "asc" },
	});

	return userStrengths.map((us) => ({
		strengthKey: us.strength.name.toLowerCase().replace(/\s+/g, "-"),
		strengthName: us.strength.nameEs,
		domainKey: us.strength.domain.name.toLowerCase(),
		rank: us.rank,
	}));
}

/**
 * Get available modules for recommendations
 */
async function getAvailableModules(userId: string): Promise<AvailableModule[]> {
	// Get completed modules
	const completedModules = await prisma.userModuleProgress.findMany({
		where: {
			userId,
			status: "completed",
		},
		select: { moduleId: true },
	});

	const completedIds = completedModules.map((m) => m.moduleId);

	// Get available modules
	const modules = await prisma.developmentModule.findMany({
		where: {
			isActive: true,
			id: { notIn: completedIds },
		},
	});

	return modules.map((m) => ({
		key: m.key,
		titleEs: m.titleEs,
		descriptionEs: m.descriptionEs,
		level: m.level,
		strengthKey: m.strengthKey,
		domainKey: m.domainKey,
		xpReward: m.xpReward,
		estimatedMinutes: m.estimatedMinutes,
	}));
}

/**
 * Generate module recommendations using AI
 */
export async function getModuleRecommendations(
	userId: string,
	forceRefresh: boolean = false,
): Promise<AiRecommendationResponse<ModuleRecommendation>> {
	const userStrengths = await getUserStrengths(userId);
	const strengthsHash = generateStrengthsHash(userStrengths);

	// Check cache unless force refresh
	if (!forceRefresh) {
		const cached = await getCachedRecommendation(
			userId,
			"next-module",
			strengthsHash,
		);
		if (cached) {
			return cached as AiRecommendationResponse<ModuleRecommendation>;
		}
	}

	const availableModules = await getAvailableModules(userId);

	if (availableModules.length === 0) {
		return {
			recommendations: [],
			generatedAt: new Date(),
			expiresAt: new Date(),
			modelUsed: "none",
			strengthsHash,
		};
	}

	// Generate recommendations using AI
	const { object: result } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: z.object({
			recommendations: z.array(
				z.object({
					moduleKey: z.string(),
					reason: z.string(),
					relevanceScore: z.number().min(0).max(100),
				}),
			),
		}),
		prompt: `Eres un coach de desarrollo personal especializado en fortalezas.

El usuario tiene las siguientes fortalezas (ordenadas por importancia):
${userStrengths.map((s, i) => `${i + 1}. ${s.strengthName} (dominio: ${s.domainKey})`).join("\n")}

Módulos disponibles para recomendar:
${availableModules.map((m) => `- ${m.key}: "${m.titleEs}" - ${m.descriptionEs} (nivel: ${m.level}, ${m.estimatedMinutes} min, ${m.xpReward} XP)`).join("\n")}

Selecciona los 5 módulos más relevantes para este usuario basándote en:
1. Alineación con sus fortalezas principales
2. Potencial de desarrollo complementario
3. Variedad en niveles de dificultad
4. Balance entre dominios

Para cada módulo, explica brevemente por qué es relevante para este usuario.
Responde en español.`,
	});

	// Enrich recommendations with module data
	const enrichedRecommendations: ModuleRecommendation[] = result.recommendations
		.map((rec) => {
			const moduleData = availableModules.find((m) => m.key === rec.moduleKey);
			if (!moduleData) return null;

			return {
				moduleId: "", // Will be resolved when querying
				moduleKey: rec.moduleKey,
				titleEs: moduleData.titleEs,
				descriptionEs: moduleData.descriptionEs,
				reason: rec.reason,
				relevanceScore: rec.relevanceScore,
				estimatedMinutes: moduleData.estimatedMinutes,
				xpReward: moduleData.xpReward,
				level: moduleData.level,
			};
		})
		.filter((r): r is ModuleRecommendation => r !== null);

	// Cache the recommendations
	await cacheRecommendation(
		userId,
		"next-module",
		enrichedRecommendations,
		strengthsHash,
		"gpt-4o-mini",
	);

	const expiresAt = new Date();
	expiresAt.setDate(
		expiresAt.getDate() + DEFAULT_RECOMMENDATION_CACHE_CONFIG.ttlDays,
	);

	return {
		recommendations: enrichedRecommendations,
		generatedAt: new Date(),
		expiresAt,
		modelUsed: "gpt-4o-mini",
		strengthsHash,
	};
}

/**
 * Generate peer match recommendations for collaborative challenges
 */
export async function getPeerMatchRecommendations(
	userId: string,
	teamId: string,
	forceRefresh: boolean = false,
): Promise<AiRecommendationResponse<PeerMatchRecommendation>> {
	const userStrengths = await getUserStrengths(userId);
	const strengthsHash = generateStrengthsHash(userStrengths);

	// Check cache unless force refresh
	if (!forceRefresh) {
		const cached = await getCachedRecommendation(
			userId,
			"peer-match",
			strengthsHash,
		);
		if (cached) {
			return cached as AiRecommendationResponse<PeerMatchRecommendation>;
		}
	}

	// Get team members with their strengths
	const teamMembers = await prisma.teamMember.findMany({
		where: {
			teamId,
			userId: { not: userId },
		},
		include: {
			user: {
				include: {
					userStrengths: {
						include: {
							strength: {
								include: { domain: true },
							},
						},
						orderBy: { rank: "asc" },
					},
				},
			},
		},
	});

	if (teamMembers.length === 0) {
		return {
			recommendations: [],
			generatedAt: new Date(),
			expiresAt: new Date(),
			modelUsed: "none",
			strengthsHash,
		};
	}

	// Build team context
	const teamContext = teamMembers.map((tm) => ({
		userId: tm.userId,
		userName: tm.user.name,
		strengths: tm.user.userStrengths.map((us) => ({
			strengthKey: us.strength.name.toLowerCase().replace(/\s+/g, "-"),
			strengthName: us.strength.nameEs,
			domainKey: us.strength.domain.name.toLowerCase(),
			rank: us.rank,
		})),
	}));

	// Generate recommendations using AI
	const { object: result } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: z.object({
			recommendations: z.array(
				z.object({
					userId: z.string(),
					matchReason: z.string(),
					complementaryStrengths: z.array(z.string()),
					matchScore: z.number().min(0).max(100),
				}),
			),
		}),
		prompt: `Eres un experto en dinámicas de equipo y fortalezas complementarias.

El usuario tiene las siguientes fortalezas:
${userStrengths.map((s, i) => `${i + 1}. ${s.strengthName} (dominio: ${s.domainKey})`).join("\n")}

Miembros del equipo disponibles para colaborar:
${teamContext
	.map(
		(tm) =>
			`- ${tm.userName} (ID: ${tm.userId}): ${tm.strengths
				.slice(0, 3)
				.map((s) => s.strengthName)
				.join(", ")}`,
	)
	.join("\n")}

Recomienda los 3 mejores compañeros para desafíos colaborativos basándote en:
1. Fortalezas complementarias (diferentes dominios o fortalezas que se potencian)
2. Potencial de aprendizaje mutuo
3. Balance de estilos de trabajo

Para cada recomendación, explica por qué esta persona sería un buen compañero de desafío.
Responde en español.`,
	});

	// Enrich recommendations with user data
	const enrichedRecommendations: PeerMatchRecommendation[] = [];

	for (const rec of result.recommendations) {
		const memberData = teamContext.find((m) => m.userId === rec.userId);
		if (!memberData) continue;

		enrichedRecommendations.push({
			userId: rec.userId,
			userName: memberData.userName,
			userImage: undefined,
			matchReason: rec.matchReason,
			complementaryStrengths: rec.complementaryStrengths,
			suggestedChallenges: [],
			matchScore: rec.matchScore,
		});
	}

	// Cache the recommendations
	await cacheRecommendation(
		userId,
		"peer-match",
		enrichedRecommendations,
		strengthsHash,
		"gpt-4o-mini",
	);

	const expiresAt = new Date();
	expiresAt.setDate(
		expiresAt.getDate() + DEFAULT_RECOMMENDATION_CACHE_CONFIG.ttlDays,
	);

	return {
		recommendations: enrichedRecommendations,
		generatedAt: new Date(),
		expiresAt,
		modelUsed: "gpt-4o-mini",
		strengthsHash,
	};
}

/**
 * Invalidate cached recommendations for a user
 */
export async function invalidateRecommendationCache(
	userId: string,
	type?: RecommendationType,
): Promise<void> {
	if (type) {
		await prisma.userRecommendation.deleteMany({
			where: {
				userId,
				recommendationType: type,
			},
		});
	} else {
		await prisma.userRecommendation.deleteMany({
			where: { userId },
		});
	}
}
