"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { getModuleRecommendations } from "@/lib/services/ai-coach.service";
import type {
	ModuleRecommendation,
	AiRecommendationResponse,
} from "@/lib/types/ai-coach.types";

/**
 * Cooldown period for manual refresh (5 minutes)
 */
const REFRESH_COOLDOWN_MS = 5 * 60 * 1000;

/**
 * Result type for AI recommendations
 */
interface AIRecommendationsResult {
	recommendations: ModuleRecommendation[];
	cachedAt: Date | null;
	expiresAt: Date | null;
	isCached: boolean;
}

/**
 * Get AI-powered module recommendations for the user
 *
 * Uses cached recommendations if available and not expired (7-day TTL).
 * Falls back to generating new recommendations via OpenAI.
 */
export async function getAIRecommendations(): Promise<AIRecommendationsResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const userId = session.user.id;

	// Check for cached recommendations
	const cached = await prisma.userRecommendation.findUnique({
		where: {
			userId_recommendationType: {
				userId,
				recommendationType: "next-module",
			},
		},
	});

	if (cached && cached.expiresAt > new Date()) {
		try {
			const recommendations = JSON.parse(
				cached.recommendations,
			) as ModuleRecommendation[];
			return {
				recommendations,
				cachedAt: cached.createdAt,
				expiresAt: cached.expiresAt,
				isCached: true,
			};
		} catch {
			// Invalid cache, continue to generate new
		}
	}

	// Generate recommendations using the service
	const result: AiRecommendationResponse<ModuleRecommendation> =
		await getModuleRecommendations(userId);

	return {
		recommendations: result.recommendations,
		cachedAt: result.generatedAt,
		expiresAt: result.expiresAt,
		isCached: false,
	};
}

/**
 * Force refresh AI recommendations (invalidate cache)
 *
 * Rate limited: 5-minute cooldown between refreshes to prevent API abuse.
 * Returns cached data with error if cooldown not met.
 */
export async function refreshAIRecommendations(): Promise<
	AIRecommendationsResult & {
		rateLimited?: boolean;
		cooldownRemaining?: number;
	}
> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const userId = session.user.id;

	// Check last refresh time to enforce cooldown
	const cached = await prisma.userRecommendation.findUnique({
		where: {
			userId_recommendationType: {
				userId,
				recommendationType: "next-module",
			},
		},
		select: {
			updatedAt: true,
			recommendations: true,
			createdAt: true,
			expiresAt: true,
		},
	});

	// Check if cooldown period has passed
	if (cached?.updatedAt) {
		const timeSinceLastRefresh = Date.now() - cached.updatedAt.getTime();
		const cooldownRemaining = REFRESH_COOLDOWN_MS - timeSinceLastRefresh;

		if (cooldownRemaining > 0) {
			// Return cached data with rate limit info
			try {
				const recommendations = JSON.parse(
					cached.recommendations,
				) as ModuleRecommendation[];

				return {
					recommendations,
					cachedAt: cached.createdAt,
					expiresAt: cached.expiresAt,
					isCached: true,
					rateLimited: true,
					cooldownRemaining: Math.ceil(cooldownRemaining / 1000), // seconds
				};
			} catch {
				// Invalid cache, allow refresh anyway
			}
		}
	}

	// Generate new recommendations with force refresh
	const result: AiRecommendationResponse<ModuleRecommendation> =
		await getModuleRecommendations(userId, true);

	return {
		recommendations: result.recommendations,
		cachedAt: result.generatedAt,
		expiresAt: result.expiresAt,
		isCached: false,
		rateLimited: false,
	};
}

/**
 * Get next suggested action for user
 *
 * Returns a single actionable recommendation based on user's state.
 */
export async function getNextAction(): Promise<{
	type: "continue_module" | "start_module" | "complete_challenge" | "explore";
	title: string;
	description: string;
	actionUrl: string;
	actionLabel: string;
}> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const userId = session.user.id;

	// Check for in-progress modules with incomplete challenges
	const inProgressModule = await prisma.userModuleProgress.findFirst({
		where: { userId, status: "in_progress" },
		include: {
			module: {
				select: {
					id: true,
					titleEs: true,
					_count: {
						select: { challenges: true },
					},
				},
			},
		},
	});

	if (inProgressModule) {
		const completedChallenges = await prisma.userChallengeProgress.count({
			where: {
				userId,
				completed: true,
				challenge: { moduleId: inProgressModule.moduleId },
			},
		});

		const totalChallenges = inProgressModule.module._count.challenges;
		const remaining = totalChallenges - completedChallenges;

		if (remaining > 0) {
			return {
				type: "continue_module",
				title: `Continúa: ${inProgressModule.module.titleEs}`,
				description: `Te faltan ${remaining} desafío${remaining > 1 ? "s" : ""} para completar este módulo.`,
				actionUrl: `/dashboard/development/${inProgressModule.moduleId}`,
				actionLabel: "Continuar",
			};
		}
	}

	// Suggest starting a new module
	const completedModuleIds = (
		await prisma.userModuleProgress.findMany({
			where: { userId, status: "completed" },
			select: { moduleId: true },
		})
	).map((m) => m.moduleId);

	const suggestedModule = await prisma.developmentModule.findFirst({
		where: {
			isActive: true,
			id: { notIn: completedModuleIds },
		},
		orderBy: [{ level: "asc" }, { order: "asc" }],
		select: {
			id: true,
			titleEs: true,
			descriptionEs: true,
		},
	});

	if (suggestedModule) {
		return {
			type: "start_module",
			title: `Empieza: ${suggestedModule.titleEs}`,
			description: suggestedModule.descriptionEs,
			actionUrl: `/dashboard/development/${suggestedModule.id}`,
			actionLabel: "Comenzar",
		};
	}

	// Default: explore
	return {
		type: "explore",
		title: "¡Has completado todos los módulos!",
		description:
			"Explora las insignias que has desbloqueado o repasa tus módulos favoritos.",
		actionUrl: "/dashboard/development/badges",
		actionLabel: "Ver Insignias",
	};
}
