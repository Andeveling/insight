"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type { ModuleCard, ModuleFilters, ModuleType } from "../_schemas";

/**
 * Result of getModules action - returns separate arrays
 */
export interface GetModulesResult {
	general: ModuleCard[];
	personalized: ModuleCard[];
}

/**
 * Get development modules filtered by user's Top 5 strengths.
 *
 * REFACTORED: Now filters by user's Top 5 strengths only,
 * excludes archived modules, and returns separate general/personalized arrays.
 *
 * @param filters - Optional filters for level, strength, search, etc.
 * @returns Object with general and personalized module arrays
 */
export async function getModules(
	filters?: ModuleFilters,
): Promise<GetModulesResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// Get user's Top 5 strength keys
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId },
		include: {
			strength: { select: { name: true } },
		},
		orderBy: { rank: "asc" },
		take: 5,
	});

	const strengthKeys = userStrengths.map((us) => us.strength.name);

	// If user doesn't have 5 strengths, return empty
	if (strengthKeys.length < 5) {
		return { general: [], personalized: [] };
	}

	// Build where clause for general modules (shared, not user-specific)
	// Include modules with strengthKey matching user's Top 5 OR modules without strengthKey (foundations/integration)

	// Base strength filter for general modules
	const generalStrengthFilter = filters?.strengthKey
		? { strengthKey: filters.strengthKey }
		: {
				OR: [{ strengthKey: { in: strengthKeys } }, { strengthKey: null }],
			};

	// Build general where with proper AND logic
	const generalWhere: Record<string, unknown> = {
		isActive: true,
		isArchived: false,
		moduleType: "general",
		AND: [
			generalStrengthFilter,
			...(filters?.level ? [{ level: filters.level }] : []),
			...(filters?.search
				? [
						{
							OR: [
								{ titleEs: { contains: filters.search } },
								{ descriptionEs: { contains: filters.search } },
							],
						},
					]
				: []),
		],
	};

	// Build where clause for personalized modules (user-specific)
	const personalizedWhere: Record<string, unknown> = {
		isActive: true,
		isArchived: false,
		moduleType: "personalized",
		userId,
		strengthKey: { in: strengthKeys },
	};

	// Apply common filters to personalized
	if (filters?.level) {
		personalizedWhere.level = filters.level;
	}

	if (filters?.strengthKey) {
		personalizedWhere.strengthKey = filters.strengthKey;
	}

	if (filters?.search) {
		personalizedWhere.OR = [
			{ titleEs: { contains: filters.search } },
			{ descriptionEs: { contains: filters.search } },
		];
	}

	// Fetch modules in parallel
	const [generalModules, personalizedModules] = await Promise.all([
		prisma.developmentModule.findMany({
			where: generalWhere,
			include: {
				challenges: { select: { id: true } },
				userProgress: { where: { userId }, take: 1 },
			},
			orderBy: [{ order: "asc" }, { level: "asc" }],
		}),
		prisma.developmentModule.findMany({
			where: personalizedWhere,
			include: {
				challenges: { select: { id: true } },
				userProgress: { where: { userId }, take: 1 },
			},
			orderBy: [{ createdAt: "desc" }],
		}),
	]);

	const allModules = [...generalModules, ...personalizedModules];
	const moduleIds = allModules.map((m) => m.id);

	// Fetch completed challenges per module
	const completedChallenges = await prisma.userChallengeProgress.findMany({
		where: {
			userId,
			challenge: { moduleId: { in: moduleIds } },
			completed: true,
		},
		select: {
			challenge: { select: { moduleId: true } },
		},
	});

	// Build completed count map
	const completedCountMap = new Map<string, number>();
	for (const cp of completedChallenges) {
		const moduleId = cp.challenge.moduleId;
		completedCountMap.set(moduleId, (completedCountMap.get(moduleId) || 0) + 1);
	}

	// Helper to map module to ModuleCard
	const mapToCard = (module: (typeof allModules)[0]): ModuleCard => {
		const totalChallenges = module.challenges.length;
		const completedCount = completedCountMap.get(module.id) || 0;
		const userProgress = module.userProgress[0];

		let status: "not_started" | "in_progress" | "completed" = "not_started";
		if (userProgress) {
			status = userProgress.status as typeof status;
		}

		const percentComplete =
			totalChallenges > 0
				? Math.round((completedCount / totalChallenges) * 100)
				: 0;

		return {
			id: module.id,
			key: module.key,
			titleEs: module.titleEs,
			descriptionEs: module.descriptionEs,
			level: module.level as "beginner" | "intermediate" | "advanced",
			estimatedMinutes: module.estimatedMinutes,
			xpReward: module.xpReward,
			strengthKey: module.strengthKey ?? "",
			moduleType: module.moduleType as ModuleType,
			progress: {
				status,
				percentComplete,
				completedChallenges: completedCount,
				totalChallenges,
			},
		};
	};

	// Map to ModuleCard format
	let general = generalModules.map(mapToCard);
	let personalized = personalizedModules.map(mapToCard);

	// Filter completed if needed
	if (!filters?.showCompleted) {
		general = general.filter((m) => m.progress.status !== "completed");
		personalized = personalized.filter(
			(m) => m.progress.status !== "completed",
		);
	}

	return { general, personalized };
}

/**
 * Get modules organized by user's strengths
 * @deprecated Use getModules() which now returns structured result
 */
export async function getModulesByStrength(): Promise<
	Map<string, ModuleCard[]>
> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	// Get user's strengths
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId: session.user.id },
		include: {
			strength: {
				include: { domain: true },
			},
		},
		orderBy: { rank: "asc" },
		take: 5,
	});

	// Get all modules
	const { general, personalized } = await getModules();
	const allModules = [...general, ...personalized];

	// Organize by strength
	const modulesByStrength = new Map<string, ModuleCard[]>();

	// Group by strength name
	for (const us of userStrengths) {
		const strengthName = us.strength.nameEs;
		const strengthModules = allModules.filter(
			(m) => m.strengthKey === us.strength.name,
		);
		if (strengthModules.length > 0) {
			modulesByStrength.set(strengthName, strengthModules);
		}
	}

	return modulesByStrength;
}
