"use server";

/**
 * Complete Quest Server Action
 *
 * Handles quest completion with XP award and level-up detection.
 * Uses Prisma transaction for atomicity.
 */

import { QuestStatus, QuestType } from "@/generated/prisma/enums";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
	type CompleteQuestInput,
	type CompleteQuestResult,
	completeQuestSchema,
} from "@/specs/012-strength-levels/contracts/complete-quest.schema";
import { addXpToMaturityLevel } from "../_services/maturity-level.service";

/**
 * Get cooldown hours for quest type
 */
export async function getCooldownHours(type: QuestType): Promise<number | null> {
	switch (type) {
		case QuestType.BOSS_BATTLE:
			return 168; // 7 days
		case QuestType.COMBO_BREAKER:
			return 72; // 3 days
		default:
			return null;
	}
}

/**
 * Complete a quest and award XP
 */
export async function completeQuest(
	input: CompleteQuestInput,
): Promise<CompleteQuestResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		return {
			success: false,
			xpAwarded: 0,
			leveledUp: false,
			newXpCurrent: 0,
			error: "Usuario no autenticado",
		};
	}

	// Validate input
	const parseResult = completeQuestSchema.safeParse(input);
	if (!parseResult.success) {
		return {
			success: false,
			xpAwarded: 0,
			leveledUp: false,
			newXpCurrent: 0,
			error: parseResult.error.issues[0]?.message || "Datos inválidos",
		};
	}

	const { questId, confirmedBy } = parseResult.data;
	const userId = session.user.id;

	try {
		// Find the quest completion
		const questCompletion = await prisma.questCompletion.findFirst({
			where: {
				id: questId,
				userId,
				status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
			},
			include: {
				quest: true,
			},
		});

		if (!questCompletion) {
			return {
				success: false,
				xpAwarded: 0,
				leveledUp: false,
				newXpCurrent: 0,
				error: "Misión no encontrada o ya completada",
			};
		}

		// Check if quest is expired
		const now = new Date();
		if (questCompletion.expiresAt && questCompletion.expiresAt < now) {
			return {
				success: false,
				xpAwarded: 0,
				leveledUp: false,
				newXpCurrent: 0,
				error: "Esta misión ha expirado",
			};
		}

		// Check if cooperative quest requires confirmation
		if (questCompletion.quest.requiresPartner && !confirmedBy) {
			return {
				success: false,
				xpAwarded: 0,
				leveledUp: false,
				newXpCurrent: 0,
				error:
					"Las misiones cooperativas requieren confirmación de un compañero",
			};
		}

		const xpToAward = questCompletion.quest.xpReward;
		const strengthId = questCompletion.quest.strengthId;

		// Award XP and update maturity level
		const xpResult = await addXpToMaturityLevel(userId, strengthId, xpToAward);

		// Update quest completion status
		await prisma.questCompletion.update({
			where: { id: questCompletion.id },
			data: {
				status: QuestStatus.COMPLETED,
				completedAt: now,
				xpAwarded: xpToAward,
				...(confirmedBy ? { confirmedBy, confirmedAt: now } : {}),
			},
		});

		return {
			success: true,
			xpAwarded: xpToAward,
			leveledUp: xpResult.leveledUp,
			newLevel: xpResult.newLevel ?? undefined,
			newXpCurrent: xpResult.maturityLevel.xpCurrent,
		};
	} catch (error) {
		console.error("[completeQuest] Error:", error);
		return {
			success: false,
			xpAwarded: 0,
			leveledUp: false,
			newXpCurrent: 0,
			error:
				error instanceof Error ? error.message : "Error al completar misión",
		};
	}
}

/**
 * Start a quest (mark as in progress)
 */
export async function startQuest(
	questId: string,
): Promise<{ success: boolean; error?: string }> {
	const session = await getSession();

	if (!session?.user?.id) {
		return { success: false, error: "Usuario no autenticado" };
	}

	try {
		await prisma.questCompletion.update({
			where: {
				id: questId,
				userId: session.user.id,
				status: QuestStatus.AVAILABLE,
			},
			data: {
				status: QuestStatus.IN_PROGRESS,
				startedAt: new Date(),
			},
		});

		return { success: true };
	} catch (error) {
		console.error("[startQuest] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error al iniciar misión",
		};
	}
}
