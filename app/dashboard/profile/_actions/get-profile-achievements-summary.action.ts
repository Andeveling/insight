"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type { ProfileAchievement } from "@/lib/types/profile-achievement.types";
import type { ProfileAchievementsSummary } from "@/lib/types/profile-achievements-summary.types";

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 10;

function normalizeLimit(limit: number | undefined): number {
	const value = limit ?? DEFAULT_LIMIT;
	if (Number.isNaN(value) || value <= 0) {
		return DEFAULT_LIMIT;
	}
	return Math.min(Math.max(Math.trunc(value), 1), MAX_LIMIT);
}

function normalizeTier(tier: string): ProfileAchievement["tier"] {
	switch (tier) {
		case "bronze":
		case "silver":
		case "gold":
		case "platinum":
			return tier;
		default:
			return "bronze";
	}
}

export async function getProfileAchievementsSummary(params?: {
	limit?: number;
}): Promise<ProfileAchievementsSummary | null> {
	const session = await getSession();

	if (!session?.user?.id) {
		return null;
	}

	const limit = normalizeLimit(params?.limit);

	const [totalCount, unlockedCount, recentBadges] = await Promise.all([
		prisma.badge.count({ where: { isActive: true } }),
		prisma.userBadge.count({
			where: {
				gamification: { userId: session.user.id },
				badge: { isActive: true },
			},
		}),
		prisma.userBadge.findMany({
			where: {
				gamification: { userId: session.user.id },
				badge: { isActive: true },
			},
			orderBy: { unlockedAt: "desc" },
			take: limit,
			select: {
				unlockedAt: true,
				badge: {
					select: {
						id: true,
						key: true,
						nameEs: true,
						descriptionEs: true,
						tier: true,
						iconUrl: true,
					},
				},
			},
		}),
	]);

	const recent: ProfileAchievement[] = recentBadges.map((row) => ({
		badgeId: row.badge.id,
		badgeKey: row.badge.key,
		nameEs: row.badge.nameEs,
		descriptionEs: row.badge.descriptionEs,
		tier: normalizeTier(row.badge.tier),
		icon: row.badge.iconUrl,
		unlockedAt: row.unlockedAt.toISOString(),
	}));

	return {
		unlockedCount,
		totalCount,
		recent,
	};
}
