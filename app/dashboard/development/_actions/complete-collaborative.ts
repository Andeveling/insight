"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";
import {
	type CollaborativeChallengeStatus,
	type ChallengeCompletionResult,
} from "../_schemas";
import { calculateXpUpdate } from "@/lib/services/xp-calculator.service";
import {
	getNewlyUnlockedBadges,
	type UserBadgeStats,
} from "@/lib/constants/badge-criteria";

const COLLABORATIVE_XP_BONUS = 1.5; // 50% bonus for collaborative challenges
const CHALLENGE_EXPIRY_DAYS = 7;

/**
 * Result of initiating a collaborative challenge
 */
export interface CollaborativeInitResult {
	success: boolean;
	collaborativeId: string;
	status: "pending" | "confirmed" | "expired";
	message: string;
}

/**
 * Initiate a collaborative challenge with a partner.
 *
 * Creates a pending collaborative challenge record and awaits partner confirmation.
 *
 * @param input - Challenge ID and partner ID
 * @returns Initiative result with collaborative challenge ID
 */
export async function initiateCollaborativeChallenge(input: {
	challengeId: string;
	partnerId: string;
}): Promise<CollaborativeInitResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;
	const { challengeId, partnerId } = input;

	// Validate partner exists
	const partner = await prisma.user.findUnique({
		where: { id: partnerId },
		select: { id: true, name: true, email: true },
	});

	if (!partner) {
		throw new Error("Compañero no encontrado");
	}

	// Validate challenge exists and is collaborative type
	const challenge = await prisma.challenge.findUnique({
		where: { id: challengeId },
		include: { module: true },
	});

	if (!challenge) {
		throw new Error("Desafío no encontrado");
	}

	if (challenge.type !== "collaboration") {
		throw new Error("Este desafío no es de tipo colaborativo");
	}

	// Check for existing collaborative challenge
	const existing = await prisma.collaborativeChallenge.findFirst({
		where: {
			challengeId,
			OR: [
				{ initiatorUserId: userId, partnerUserId: partnerId },
				{ initiatorUserId: partnerId, partnerUserId: userId },
			],
			status: { in: ["pending", "confirmed"] },
		},
	});

	if (existing) {
		return {
			success: true,
			collaborativeId: existing.id,
			status: existing.status as "pending" | "confirmed",
			message: "Ya existe una solicitud de colaboración para este desafío",
		};
	}

	// Create collaborative challenge record
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + CHALLENGE_EXPIRY_DAYS);

	const collaborative = await prisma.collaborativeChallenge.create({
		data: {
			challengeId,
			initiatorUserId: userId,
			partnerUserId: partnerId,
			initiatorCompleted: true,
			initiatorCompletedAt: new Date(),
			partnerCompleted: false,
			status: "pending",
			expiresAt,
		},
	});

	// TODO: Send notification to partner (email/in-app)
	// This would integrate with a notification service

	return {
		success: true,
		collaborativeId: collaborative.id,
		status: "pending",
		message: `Solicitud enviada a ${partner.name}. Esperando confirmación.`,
	};
}

/**
 * Confirm a collaborative challenge as the partner.
 *
 * When the partner confirms, both users receive XP bonus.
 *
 * @param collaborativeId - The collaborative challenge ID
 * @param reflection - Optional reflection text (reserved for future use)
 * @returns Completion result with XP for both users
 */
export async function confirmCollaborativeChallenge(
	collaborativeId: string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	reflection?: string,
): Promise<ChallengeCompletionResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// Fetch collaborative challenge
	const collaborative = await prisma.collaborativeChallenge.findUnique({
		where: { id: collaborativeId },
		include: {
			challenge: { include: { module: true } },
			initiatorUser: { select: { id: true, name: true } },
			partnerUser: { select: { id: true, name: true } },
		},
	});

	if (!collaborative) {
		throw new Error("Desafío colaborativo no encontrado");
	}

	// Verify user is the partner
	if (collaborative.partnerUserId !== userId) {
		throw new Error("No tienes permiso para confirmar este desafío");
	}

	// Check status
	if (collaborative.status === "confirmed") {
		return {
			success: true,
			xpGained: 0,
			totalXp: 0,
			leveledUp: false,
			moduleCompleted: false,
			badgesUnlocked: [],
			message: "Este desafío colaborativo ya fue completado",
		};
	}

	if (
		collaborative.status === "expired" ||
		new Date() > collaborative.expiresAt
	) {
		await prisma.collaborativeChallenge.update({
			where: { id: collaborativeId },
			data: { status: "expired" },
		});
		throw new Error("El desafío colaborativo ha expirado");
	}

	// Calculate XP with collaborative bonus
	const baseXp = collaborative.challenge.xpReward;
	const xpWithBonus = Math.round(baseXp * COLLABORATIVE_XP_BONUS);

	// Award XP to both users in a transaction
	const partnerResult = await prisma.$transaction(async (tx) => {
		// Update collaborative challenge status
		await tx.collaborativeChallenge.update({
			where: { id: collaborativeId },
			data: {
				partnerCompleted: true,
				partnerCompletedAt: new Date(),
				xpBonusAwarded: xpWithBonus,
				status: "confirmed",
			},
		});

		// Award XP to partner (current user)
		const partnerGamification = await tx.userGamification.upsert({
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

		const partnerXpResult = calculateXpUpdate(
			partnerGamification.xpTotal,
			xpWithBonus,
		);

		await tx.userGamification.update({
			where: { userId },
			data: {
				xpTotal: partnerXpResult.newXp,
				currentLevel: partnerXpResult.newLevel,
				collaborativeChallenges: { increment: 1 },
				lastActivityDate: new Date(),
			},
		});

		// Create challenge progress for partner
		await tx.userChallengeProgress.upsert({
			where: {
				userId_challengeId: {
					userId,
					challengeId: collaborative.challengeId,
				},
			},
			update: {
				completed: true,
				completedAt: new Date(),
			},
			create: {
				userId,
				challengeId: collaborative.challengeId,
				completed: true,
				completedAt: new Date(),
			},
		});

		// Award XP to initiator
		const initiatorGamification = await tx.userGamification.findUnique({
			where: { userId: collaborative.initiatorUserId },
		});

		if (initiatorGamification) {
			const initiatorXpResult = calculateXpUpdate(
				initiatorGamification.xpTotal,
				xpWithBonus,
			);

			await tx.userGamification.update({
				where: { userId: collaborative.initiatorUserId },
				data: {
					xpTotal: initiatorXpResult.newXp,
					currentLevel: initiatorXpResult.newLevel,
					collaborativeChallenges: { increment: 1 },
				},
			});
		}

		return partnerXpResult;
	});

	// Check for new badges for partner
	const userStats = await getUserBadgeStats(userId);
	const allBadges = await prisma.badge.findMany({
		where: { isActive: true },
		select: { key: true, unlockCriteria: true },
	});

	// Get user's gamification for badge lookup
	const gamification = await prisma.userGamification.findUnique({
		where: { userId },
		include: {
			badges: {
				include: {
					badge: { select: { key: true } },
				},
			},
		},
	});

	const unlockedKeys = gamification?.badges.map((ub) => ub.badge.key) ?? [];
	const newBadgeKeys = getNewlyUnlockedBadges(
		allBadges,
		unlockedKeys,
		userStats,
	);

	const badgesUnlocked: Array<{
		id: string;
		nameEs: string;
		iconUrl: string;
		xpReward: number;
	}> = [];

	if (newBadgeKeys.length > 0 && gamification) {
		const newBadges = await prisma.badge.findMany({
			where: { key: { in: newBadgeKeys } },
		});

		for (const badge of newBadges) {
			await prisma.userBadge.create({
				data: {
					gamificationId: gamification.id,
					badgeId: badge.id,
				},
			});

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

	// TODO: Send confirmation notification to initiator

	return {
		success: true,
		xpGained: xpWithBonus,
		totalXp: partnerResult.newXp,
		leveledUp: partnerResult.leveledUp,
		newLevel: partnerResult.leveledUp ? partnerResult.newLevel : undefined,
		moduleCompleted: false,
		badgesUnlocked,
		message: `¡Desafío colaborativo completado con ${collaborative.initiatorUser.name}! +${xpWithBonus} XP`,
	};
}

/**
 * Get status of a collaborative challenge.
 *
 * @param collaborativeId - The collaborative challenge ID
 * @returns Status object with confirmation states
 */
export async function getCollaborativeChallengeStatus(
	collaborativeId: string,
): Promise<CollaborativeChallengeStatus | null> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const collaborative = await prisma.collaborativeChallenge.findUnique({
		where: { id: collaborativeId },
	});

	if (!collaborative) {
		return null;
	}

	return {
		challengeId: collaborative.challengeId,
		initiatorId: collaborative.initiatorUserId,
		partnerId: collaborative.partnerUserId,
		initiatorConfirmed: collaborative.initiatorCompleted,
		partnerConfirmed: collaborative.partnerCompleted,
		isCompleted: collaborative.status === "confirmed",
		completedAt: collaborative.partnerCompletedAt,
		xpBonus: collaborative.xpBonusAwarded ?? 0,
	};
}

/**
 * Get pending collaborative challenges for the current user.
 *
 * @returns Array of pending challenges where user needs to confirm
 */
export async function getPendingCollaborativeChallenges(): Promise<
	Array<{
		id: string;
		challengeId: string;
		challengeTitle: string;
		moduleNameEs: string;
		initiatorName: string;
		initiatorImage: string | null;
		expiresAt: Date;
		xpReward: number;
	}>
> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	const pending = await prisma.collaborativeChallenge.findMany({
		where: {
			partnerUserId: userId,
			status: "pending",
			expiresAt: { gt: new Date() },
		},
		include: {
			challenge: {
				select: {
					titleEs: true,
					xpReward: true,
					module: { select: { titleEs: true } },
				},
			},
			initiatorUser: {
				select: { name: true, image: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return pending.map((p) => ({
		id: p.id,
		challengeId: p.challengeId,
		challengeTitle: p.challenge.titleEs,
		moduleNameEs: p.challenge.module.titleEs,
		initiatorName: p.initiatorUser.name,
		initiatorImage: p.initiatorUser.image,
		expiresAt: p.expiresAt,
		xpReward: Math.round(p.challenge.xpReward * COLLABORATIVE_XP_BONUS),
	}));
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
			prisma.collaborativeChallenge.count({
				where: {
					status: "confirmed",
					OR: [{ initiatorUserId: userId }, { partnerUserId: userId }],
				},
			}),
		]);

	return {
		xpTotal: gamification?.xpTotal ?? 0,
		currentLevel: gamification?.currentLevel ?? 1,
		modulesCompleted,
		challengesCompleted,
		longestStreak: gamification?.longestStreak ?? 0,
		currentStreak: gamification?.currentStreak ?? 0,
		collaborativeChallenges,
	};
}
