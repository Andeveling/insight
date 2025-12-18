"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { GetModuleDetailInputSchema, type ModuleDetail } from "../_schemas";

/**
 * Get detailed information about a development module.
 *
 * Includes module content, all challenges, and user's progress.
 *
 * @param input - The module ID to fetch
 * @returns Module detail with challenges and progress
 */
export async function getModuleDetail(input: {
	moduleId: string;
}): Promise<ModuleDetail> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// Validate input
	const validatedInput = GetModuleDetailInputSchema.parse(input);
	const { moduleId } = validatedInput;

	// Fetch module with challenges
	const developmentModule = await prisma.developmentModule.findUnique({
		where: { id: moduleId, isActive: true },
		include: {
			challenges: {
				orderBy: { order: "asc" },
			},
		},
	});

	if (!developmentModule) {
		throw new Error("Módulo no encontrado");
	}

	// Fetch user's module progress
	const userModuleProgress = await prisma.userModuleProgress.findUnique({
		where: {
			userId_moduleId: {
				userId,
				moduleId,
			},
		},
	});

	// Fetch user's challenge progress for this module
	const challengeIds = developmentModule.challenges.map((c) => c.id);
	const userChallengeProgress = await prisma.userChallengeProgress.findMany({
		where: {
			userId,
			challengeId: { in: challengeIds },
		},
	});

	// Build challenge completion map
	const challengeProgressMap = new Map(
		userChallengeProgress.map((cp) => [
			cp.challengeId,
			{
				isCompleted: cp.completed,
				completedAt: cp.completedAt,
			},
		]),
	);

	// Calculate progress
	const totalChallenges = developmentModule.challenges.length;
	const completedChallenges = userChallengeProgress.filter(
		(cp) => cp.completed,
	).length;
	const percentComplete =
		totalChallenges > 0
			? Math.round((completedChallenges / totalChallenges) * 100)
			: 0;

	// Determine status
	let status: "not_started" | "in_progress" | "completed" = "not_started";
	if (userModuleProgress) {
		status = userModuleProgress.status as typeof status;
	}

	// Build response
	const result: ModuleDetail = {
		module: {
			id: developmentModule.id,
			key: developmentModule.key,
			titleEs: developmentModule.titleEs,
			descriptionEs: developmentModule.descriptionEs,
			content: developmentModule.content,
			strengthKey: developmentModule.strengthKey,
			domainKey: developmentModule.domainKey,
			estimatedMinutes: developmentModule.estimatedMinutes,
			xpReward: developmentModule.xpReward,
			level: developmentModule.level as
				| "beginner"
				| "intermediate"
				| "advanced",
			order: developmentModule.order,
			isActive: developmentModule.isActive,
			moduleType: (developmentModule.moduleType ?? "general") as
				| "general"
				| "personalized",
			userId: developmentModule.userId,
			isArchived: developmentModule.isArchived ?? false,
			generatedBy: developmentModule.generatedBy,
			createdAt: developmentModule.createdAt,
			updatedAt: developmentModule.updatedAt,
		},
		challenges: developmentModule.challenges.map((challenge) => {
			const progress = challengeProgressMap.get(challenge.id);
			return {
				id: challenge.id,
				titleEs: challenge.titleEs,
				descriptionEs: challenge.descriptionEs,
				type: challenge.type as "reflection" | "action" | "collaboration",
				xpReward: challenge.xpReward,
				isCompleted: progress?.isCompleted ?? false,
				completedAt: progress?.completedAt ?? null,
			};
		}),
		progress: {
			status,
			percentComplete,
			startedAt: userModuleProgress?.startedAt ?? null,
			completedAt: userModuleProgress?.completedAt ?? null,
		},
	};

	return result;
}

/**
 * Get next module to work on based on current progress.
 *
 * Prioritizes in-progress modules, then recommended modules.
 */
export async function getNextModule(): Promise<{
	moduleId: string;
	titleEs: string;
	reason: string;
} | null> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// First, check for in-progress modules
	const inProgressModule = await prisma.userModuleProgress.findFirst({
		where: {
			userId,
			status: "in_progress",
		},
		include: {
			module: true,
		},
		orderBy: {
			startedAt: "desc",
		},
	});

	if (inProgressModule) {
		return {
			moduleId: inProgressModule.moduleId,
			titleEs: inProgressModule.module.titleEs,
			reason: "Continúa donde lo dejaste",
		};
	}

	// Get user's top strengths
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId },
		include: {
			strength: {
				include: { domain: true },
			},
		},
		orderBy: { rank: "asc" },
		take: 3,
	});

	// Get completed module IDs
	const completedModules = await prisma.userModuleProgress.findMany({
		where: {
			userId,
			status: "completed",
		},
		select: { moduleId: true },
	});
	const completedModuleIds = completedModules.map((m) => m.moduleId);

	// Find recommended module based on strengths
	const strengthKeys = userStrengths.map((us) =>
		us.strength.name.toLowerCase().replace(/\s+/g, "-"),
	);
	const domainKeys = userStrengths.map((us) =>
		us.strength.domain.name.toLowerCase(),
	);

	const recommendedModule = await prisma.developmentModule.findFirst({
		where: {
			isActive: true,
			id: { notIn: completedModuleIds },
			OR: [
				{ strengthKey: { in: strengthKeys } },
				{ domainKey: { in: domainKeys } },
			],
		},
		orderBy: [{ level: "asc" }, { order: "asc" }],
	});

	if (recommendedModule) {
		return {
			moduleId: recommendedModule.id,
			titleEs: recommendedModule.titleEs,
			reason: "Recomendado basado en tus fortalezas",
		};
	}

	// Fallback: any uncompleted beginner module
	const beginnerModule = await prisma.developmentModule.findFirst({
		where: {
			isActive: true,
			id: { notIn: completedModuleIds },
			level: "beginner",
		},
		orderBy: { order: "asc" },
	});

	if (beginnerModule) {
		return {
			moduleId: beginnerModule.id,
			titleEs: beginnerModule.titleEs,
			reason: "Empieza con los fundamentos",
		};
	}

	return null;
}
