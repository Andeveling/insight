"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";

/**
 * Strength data for development module
 */
export interface DevelopmentStrength {
	rank: number;
	key: string;
	nameEs: string;
	domainKey: string;
	domainNameEs: string;
	moduleCount: {
		general: number;
		personalized: number;
		completed: number;
	};
}

/**
 * Result of getUserStrengthsForDevelopment action
 */
export interface UserStrengthsResult {
	hasTop5: boolean;
	strengths: DevelopmentStrength[];
}

/**
 * Get user's Top 5 strengths with module metadata for development feature.
 *
 * @returns User's strengths with module counts and progress
 */
export async function getUserStrengthsForDevelopment(): Promise<UserStrengthsResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// Get user's top 5 strengths with domain info
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId },
		include: {
			strength: {
				include: { domain: true },
			},
		},
		orderBy: { rank: "asc" },
		take: 5,
	});

	// Check if user has exactly 5 strengths
	if (userStrengths.length < 5) {
		return {
			hasTop5: false,
			strengths: [],
		};
	}

	// Get strength keys for module counting
	const strengthKeys = userStrengths.map((us) => us.strength.name);

	// Count modules by strength and type
	const moduleCounts = await prisma.developmentModule.groupBy({
		by: ["strengthKey", "moduleType"],
		where: {
			strengthKey: { in: strengthKeys },
			isArchived: false,
			isActive: true,
		},
		_count: true,
	});

	// Get completed module counts per strength
	const completedModules = await prisma.userModuleProgress.findMany({
		where: {
			userId,
			status: "completed",
			module: {
				strengthKey: { in: strengthKeys },
				isArchived: false,
			},
		},
		include: {
			module: {
				select: { strengthKey: true },
			},
		},
	});

	// Build count maps
	const generalCountMap = new Map<string, number>();
	const personalizedCountMap = new Map<string, number>();
	const completedCountMap = new Map<string, number>();

	for (const count of moduleCounts) {
		if (count.strengthKey) {
			if (count.moduleType === "general") {
				generalCountMap.set(count.strengthKey, count._count);
			} else if (count.moduleType === "personalized") {
				personalizedCountMap.set(count.strengthKey, count._count);
			}
		}
	}

	for (const progress of completedModules) {
		const key = progress.module.strengthKey;
		if (key) {
			completedCountMap.set(key, (completedCountMap.get(key) || 0) + 1);
		}
	}

	// Map to result format
	const strengths: DevelopmentStrength[] = userStrengths.map((us) => ({
		rank: us.rank,
		key: us.strength.name,
		nameEs: us.strength.nameEs,
		domainKey: us.strength.domain.name,
		domainNameEs: us.strength.domain.nameEs,
		moduleCount: {
			general: generalCountMap.get(us.strength.name) || 0,
			personalized: personalizedCountMap.get(us.strength.name) || 0,
			completed: completedCountMap.get(us.strength.name) || 0,
		},
	}));

	return {
		hasTop5: true,
		strengths,
	};
}
