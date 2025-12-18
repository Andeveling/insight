"use server";

import { getSession } from "@/lib/auth";
import {
	getNewlyUnlockedBadges,
	type UserBadgeStats,
} from "@/lib/constants/badge-criteria";
import { prisma } from "@/lib/prisma.db";
import {
	calculateChallengeXp,
	calculateXpUpdate,
} from "@/lib/services/xp-calculator.service";
import {
	type ChallengeCompletionResult,
	CompleteChallengeInputSchema,
} from "../_schemas";

/**
 * Complete a challenge and award XP.
 *
 * @param input - Challenge ID and optional reflection text
 * @returns Completion result with XP gained, level up info, and badges
 */
export async function completeChallenge(input: {
	challengeId: string;
	reflection?: string;
}): Promise<ChallengeCompletionResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// Validate input
	const validatedInput = CompleteChallengeInputSchema.parse(input);
	const { challengeId } = validatedInput;

	// Fetch challenge with module
	const challenge = await prisma.challenge.findUnique({
		where: { id: challengeId },
		include: { module: true },
	});

	if (!challenge) {
		throw new Error("Desafío no encontrado");
	}

	// Check if already completed
	const existingProgress = await prisma.userChallengeProgress.findUnique({
		where: {
			userId_challengeId: {
				userId,
				challengeId,
			},
		},
	});

	if (existingProgress?.completed) {
		return {
			success: true,
			xpGained: 0,
			totalXp: 0,
			leveledUp: false,
			moduleCompleted: false,
			badgesUnlocked: [],
			message: "Este desafío ya fue completado",
		};
	}

	// Get or create user gamification record
	const gamification = await prisma.userGamification.upsert({
		where: { userId },
		update: {},
		create: {
			userId,
			xpTotal: 0,
			currentLevel: 1,
			currentStreak: 0,
			longestStreak: 0,
		},
	});

	// Calculate XP to award
	const xpGained = calculateChallengeXp(challenge.xpReward, {
		isCollaborative: challenge.type === "collaboration",
		currentStreak: gamification.currentStreak,
	});

	// Calculate new totals
	const xpResult = calculateXpUpdate(gamification.xpTotal, xpGained);

	// Update streak
	const lastActivity = gamification.lastActivityDate;
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	let newStreak = gamification.currentStreak;
	let longestStreak = gamification.longestStreak;

	if (lastActivity) {
		const lastActivityDate = new Date(lastActivity);
		const isSameDay = lastActivityDate.toDateString() === today.toDateString();
		const isYesterday =
			lastActivityDate.toDateString() === yesterday.toDateString();

		if (!isSameDay) {
			if (isYesterday) {
				newStreak += 1;
			} else {
				newStreak = 1; // Reset streak
			}
		}
	} else {
		newStreak = 1; // First activity
	}

	longestStreak = Math.max(longestStreak, newStreak);

	// Update gamification in transaction
	const [updatedGamification] = await prisma.$transaction([
		prisma.userGamification.update({
			where: { userId },
			data: {
				xpTotal: xpResult.newXp,
				currentLevel: xpResult.newLevel,
				currentStreak: newStreak,
				longestStreak,
				lastActivityDate: new Date(),
			},
		}),
		prisma.userChallengeProgress.upsert({
			where: {
				userId_challengeId: {
					userId,
					challengeId,
				},
			},
			update: {
				completed: true,
				completedAt: new Date(),
				xpAwarded: xpGained,
			},
			create: {
				userId,
				challengeId,
				completed: true,
				completedAt: new Date(),
				xpAwarded: xpGained,
			},
		}),
	]);

	// Check if module is completed
	const moduleCompleted = await checkModuleCompletion(
		userId,
		challenge.moduleId,
	);

	// Check for new badges
	const userStats = await getUserBadgeStats(userId);
	const allBadges = await prisma.badge.findMany({
		where: { isActive: true },
		select: { key: true, unlockCriteria: true },
	});

	// Get user's gamification record with badges
	const gamificationWithBadges = await prisma.userGamification.findUnique({
		where: { userId },
		include: {
			badges: {
				include: {
					badge: { select: { key: true } },
				},
			},
		},
	});

	const unlockedKeys =
		gamificationWithBadges?.badges.map((ub) => ub.badge.key) ?? [];
	const newBadgeKeys = getNewlyUnlockedBadges(
		allBadges,
		unlockedKeys,
		userStats,
	);

	// Award new badges
	const badgesUnlocked: Array<{
		id: string;
		nameEs: string;
		iconUrl: string;
		xpReward: number;
	}> = [];

	if (newBadgeKeys.length > 0 && gamificationWithBadges) {
		const newBadges = await prisma.badge.findMany({
			where: { key: { in: newBadgeKeys } },
		});

		for (const badge of newBadges) {
			await prisma.userBadge.create({
				data: {
					gamificationId: gamificationWithBadges.id,
					badgeId: badge.id,
				},
			});

			// Award badge XP
			await prisma.userGamification.update({
				where: { userId },
				data: {
					xpTotal: { increment: badge.xpReward },
				},
			});

			badgesUnlocked.push({
				id: badge.id,
				nameEs: badge.nameEs,
				iconUrl: badge.iconUrl,
				xpReward: badge.xpReward,
			});
		}
	}

	return {
		success: true,
		xpGained,
		totalXp: updatedGamification.xpTotal,
		leveledUp: xpResult.leveledUp,
		newLevel: xpResult.leveledUp ? xpResult.newLevel : undefined,
		moduleCompleted,
		badgesUnlocked,
		message: `¡Desafío completado! +${xpGained} XP`,
	};
}

/**
 * Check and update module completion status
 */
async function checkModuleCompletion(
	userId: string,
	moduleId: string,
): Promise<boolean> {
	// Get total challenges in module
	const totalChallenges = await prisma.challenge.count({
		where: { moduleId },
	});

	// Get completed challenges by user
	const completedChallenges = await prisma.userChallengeProgress.count({
		where: {
			userId,
			completed: true,
			challenge: { moduleId },
		},
	});

	if (completedChallenges >= totalChallenges) {
		// Update module progress to completed
		await prisma.userModuleProgress.update({
			where: {
				userId_moduleId: { userId, moduleId },
			},
			data: {
				status: "completed",
				completedAt: new Date(),
			},
		});

		// Award module completion XP
		const devModule = await prisma.developmentModule.findUnique({
			where: { id: moduleId },
		});

		if (devModule) {
			await prisma.userGamification.update({
				where: { userId },
				data: {
					xpTotal: { increment: devModule.xpReward },
				},
			});
		}

		return true;
	}

	return false;
}

/**
 * Get user's badge stats for badge unlock checking
 */
async function getUserBadgeStats(userId: string): Promise<UserBadgeStats> {
	const gamification = await prisma.userGamification.findUnique({
		where: { userId },
	});

	const [modulesCompleted, challengesCompleted, collaborativeChallenges] =
		await Promise.all([
			prisma.userModuleProgress.count({
				where: { userId, status: "completed" },
			}),
			prisma.userChallengeProgress.count({
				where: { userId, completed: true },
			}),
			prisma.userChallengeProgress.count({
				where: {
					userId,
					completed: true,
					challenge: { type: "collaboration" },
				},
			}),
		]);

	return {
		xpTotal: gamification?.xpTotal ?? 0,
		currentLevel: gamification?.currentLevel ?? 1,
		currentStreak: gamification?.currentStreak ?? 0,
		modulesCompleted,
		challengesCompleted,
		longestStreak: gamification?.longestStreak ?? 0,
		collaborativeChallenges,
	};
}
