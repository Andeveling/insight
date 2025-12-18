"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
	getLevelDetails,
	getLevelRoadmap,
} from "@/lib/services/level-calculator.service";
import { formatXp } from "@/lib/services/xp-calculator.service";

/**
 * Result type for user progress fetch
 */
interface UserProgressResult {
	// XP Info
	xpTotal: number;
	formattedXp: string;
	xpToday: number;

	// Level Info
	level: number;
	levelName: string;
	progressToNextLevel: number;
	xpForCurrentLevel: number;
	xpForNextLevel: number;
	isMaxLevel: boolean;

	// Statistics
	modulesCompleted: number;
	modulesInProgress: number;
	challengesCompleted: number;
	totalChallenges: number;
	badgesUnlocked: number;
	totalBadges: number;

	// Streak Info
	currentStreak: number;
	longestStreak: number;
	lastActivityAt: Date | null;

	// Level Roadmap (next 3 levels)
	levelRoadmap: Array<{
		level: number;
		name: string;
		minXp: number;
		maxXp: number;
		isAchieved: boolean;
		isCurrent: boolean;
	}>;
}

/**
 * Get comprehensive user progress and gamification stats
 *
 * Fetches all relevant data for the progress dashboard.
 */
export async function getUserProgress(): Promise<UserProgressResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const userId = session.user.id;

	// Fetch user gamification data
	const gamification = await prisma.userGamification.findUnique({
		where: { userId },
	});

	if (!gamification) {
		// Return default values for new user
		const levelDetails = getLevelDetails(0);
		const roadmap = getLevelRoadmap(1, 3);

		return {
			xpTotal: 0,
			formattedXp: "0",
			xpToday: 0,
			level: 1,
			levelName: levelDetails.name,
			progressToNextLevel: 0,
			xpForCurrentLevel: levelDetails.minXp,
			xpForNextLevel: levelDetails.maxXp,
			isMaxLevel: false,
			modulesCompleted: 0,
			modulesInProgress: 0,
			challengesCompleted: 0,
			totalChallenges: 0,
			badgesUnlocked: 0,
			totalBadges: 0,
			currentStreak: 0,
			longestStreak: 0,
			lastActivityAt: null,
			levelRoadmap: roadmap,
		};
	}

	// Calculate current level and progress
	const levelDetails = getLevelDetails(gamification.xpTotal);

	// Get level roadmap (next 3 levels)
	const levelRoadmap = getLevelRoadmap(levelDetails.level, 3);

	// Get user's gamification record for badges
	const gamificationWithBadges = await prisma.userGamification.findUnique({
		where: { userId },
		include: { badges: true },
	});

	// Fetch module progress counts
	const [moduleProgress, challengeProgress, totalBadges, totalChallenges] =
		await Promise.all([
			// Module progress counts
			prisma.userModuleProgress.groupBy({
				by: ["status"],
				where: { userId },
				_count: { id: true },
			}),

			// Challenge completion count
			prisma.userChallengeProgress.count({
				where: { userId, completed: true },
			}),

			// Total badges available
			prisma.badge.count({
				where: { isActive: true },
			}),

			// Total challenges in started modules
			prisma.challenge.count({
				where: {
					module: {
						userProgress: {
							some: { userId },
						},
					},
				},
			}),
		]);

	// Parse module progress
	type ModuleProgressEntry = { status: string; _count: { id: number } };
	const modulesCompleted =
		(moduleProgress as ModuleProgressEntry[]).find(
			(p) => p.status === "completed",
		)?._count.id ?? 0;
	const modulesInProgress =
		(moduleProgress as ModuleProgressEntry[]).find(
			(p) => p.status === "in_progress",
		)?._count.id ?? 0;

	// Calculate XP earned today
	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);

	const xpTodayResult = await prisma.userChallengeProgress.aggregate({
		where: {
			userId,
			completed: true,
			completedAt: { gte: todayStart },
		},
		_sum: {
			xpAwarded: true,
		},
	});

	const badgesUnlocked = gamificationWithBadges?.badges.length ?? 0;

	return {
		xpTotal: gamification.xpTotal,
		formattedXp: formatXp(gamification.xpTotal),
		xpToday: xpTodayResult._sum?.xpAwarded ?? 0,
		level: levelDetails.level,
		levelName: levelDetails.name,
		progressToNextLevel: levelDetails.progressPercentage,
		xpForCurrentLevel: levelDetails.minXp,
		xpForNextLevel: levelDetails.maxXp,
		isMaxLevel: levelDetails.isMaxLevel,
		modulesCompleted,
		modulesInProgress,
		challengesCompleted: challengeProgress,
		totalChallenges,
		badgesUnlocked,
		totalBadges,
		currentStreak: gamification.currentStreak,
		longestStreak: gamification.longestStreak,
		lastActivityAt: gamification.lastActivityDate,
		levelRoadmap,
	};
}

/**
 * Get recent activity for user
 *
 * Returns last N completed challenges and modules.
 */
export async function getRecentActivity(limit: number = 5) {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const userId = session.user.id;

	// Fetch recent challenge completions
	const recentChallenges = await prisma.userChallengeProgress.findMany({
		where: { userId, completed: true },
		orderBy: { completedAt: "desc" },
		take: limit,
		include: {
			challenge: {
				select: {
					titleEs: true,
					type: true,
					module: {
						select: {
							titleEs: true,
						},
					},
				},
			},
		},
	});

	// Fetch recent module completions
	const recentModules = await prisma.userModuleProgress.findMany({
		where: { userId, status: "completed" },
		orderBy: { completedAt: "desc" },
		take: limit,
		include: {
			module: {
				select: {
					titleEs: true,
					level: true,
					xpReward: true,
				},
			},
		},
	});

	return {
		challenges: recentChallenges.map((c) => ({
			id: c.id,
			title: c.challenge.titleEs,
			moduleTitle: c.challenge.module.titleEs,
			type: c.challenge.type,
			xpEarned: c.xpAwarded,
			completedAt: c.completedAt,
		})),
		modules: recentModules.map((m) => ({
			id: m.id,
			title: m.module.titleEs,
			level: m.module.level,
			xpReward: m.module.xpReward,
			completedAt: m.completedAt,
		})),
	};
}
