"use server";

/**
 * Get Daily Quests Server Action
 *
 * Fetches active daily and boss quests for the current user.
 * Auto-generates daily quests if none exist for today.
 */

import { addHours, differenceInHours, startOfTomorrow } from "date-fns";
import { QuestStatus, QuestType } from "@/generated/prisma/enums";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type {
	GetDailyQuestsResult,
	QuestWithStrength,
} from "@/specs/012-strength-levels/contracts/get-daily-quests.schema";
import {
	generateBossBattlesForUser,
	generateDailyQuestsForUser,
} from "../_services/quest-generator.service";

/**
 * Transform database quest to UI-friendly format
 */
function transformQuestToUI(questCompletion: {
	id: string;
	status: QuestStatus;
	expiresAt: Date | null;
	quest: {
		id: string;
		type: QuestType;
		title: string;
		description: string;
		xpReward: number;
		cooldownHours: number | null;
		strength: {
			id: string;
			name: string;
			nameEs: string | null;
		};
	};
}): QuestWithStrength {
	return {
		id: questCompletion.id,
		type: questCompletion.quest.type,
		title: questCompletion.quest.title,
		description: questCompletion.quest.description,
		xpReward: questCompletion.quest.xpReward,
		status: questCompletion.status,
		expiresAt: questCompletion.expiresAt,
		cooldownUntil: null, // Daily quests don't have cooldowns
		strengthId: questCompletion.quest.strength.id,
		strengthName: questCompletion.quest.strength.name,
		strengthNameEs:
			questCompletion.quest.strength.nameEs ||
			questCompletion.quest.strength.name,
	};
}

/**
 * Get daily quests for current user
 */
export async function getDailyQuests(
	options: { includeExpired?: boolean; forceRegenerate?: boolean } = {},
): Promise<GetDailyQuestsResult> {
	const { includeExpired = false, forceRegenerate = false } = options;

	const session = await getSession();

	if (!session?.user?.id) {
		return {
			success: false,
			quests: [],
			hasCompletedAll: false,
			nextRegenerationTime: null,
			error: "Usuario no autenticado",
		};
	}

	const userId = session.user.id;
	const now = new Date();

	// Validate prisma is available
	if (!prisma) {
		console.error("[getDailyQuests] Prisma client is undefined");
		return {
			success: false,
			quests: [],
			hasCompletedAll: false,
			nextRegenerationTime: null,
			error: "Error de configuración de base de datos",
		};
	}

	try {
		// Check if we need to generate daily quests
		if (forceRegenerate) {
			await generateDailyQuestsForUser(userId);
		} else {
			// Check if user has any active daily quests
			const activeDailyCount = await prisma.questCompletion.count({
				where: {
					userId,
					quest: { type: QuestType.DAILY },
					status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
					OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
				},
			});

			// Generate if no active daily quests
			if (activeDailyCount === 0) {
				await generateDailyQuestsForUser(userId);
			}

			// Also check for boss battles
			const activeBossCount = await prisma.questCompletion.count({
				where: {
					userId,
					quest: { type: QuestType.BOSS_BATTLE },
					status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
				},
			});

			// Generate boss battles if none active
			if (activeBossCount === 0) {
				await generateBossBattlesForUser(userId);
			}
		}

		// Build query conditions
		const whereCondition = {
			userId,
			quest: {
				type: { in: [QuestType.DAILY, QuestType.BOSS_BATTLE] },
			},
			...(!includeExpired
				? {
						status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
						OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
					}
				: {}),
		};

		// Fetch quests with relations
		const questCompletions = await prisma.questCompletion.findMany({
			where: whereCondition,
			include: {
				quest: {
					include: {
						strength: true,
					},
				},
			},
			orderBy: [
				{ quest: { type: "asc" } }, // DAILY first, then BOSS_BATTLE
				{ expiresAt: "asc" }, // Expiring soonest first
			],
		});

		// Transform to UI format
		const quests = questCompletions.map((qc) => transformQuestToUI(qc));

		// Calculate completion status
		const dailyQuests = quests.filter((q) => q.type === QuestType.DAILY);
		const completedDaily = dailyQuests.filter(
			(q) => q.status === QuestStatus.COMPLETED,
		);
		const hasCompletedAll =
			dailyQuests.length > 0 && completedDaily.length >= dailyQuests.length;

		// Next regeneration is start of tomorrow
		const nextRegenerationTime = startOfTomorrow();

		return {
			success: true,
			quests,
			hasCompletedAll,
			nextRegenerationTime,
		};
	} catch (error) {
		console.error("[getDailyQuests] Error:", error);
		return {
			success: false,
			quests: [],
			hasCompletedAll: false,
			nextRegenerationTime: null,
			error:
				error instanceof Error ? error.message : "Error al obtener misiones",
		};
	}
}
