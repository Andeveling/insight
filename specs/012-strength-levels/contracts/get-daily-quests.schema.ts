import { z } from "zod";

/**
 * Schema for getting daily quests for a user
 */
export const getDailyQuestsSchema = z.object({
	userId: z.string().uuid("ID de usuario inválido"),
	includeExpired: z.boolean().default(false), // Si true, incluye misiones expiradas
	forceRegenerate: z.boolean().default(false), // Si true, genera nuevas misiones aunque ya existan
});

export type GetDailyQuestsInput = z.infer<typeof getDailyQuestsSchema>;

/**
 * Result type for quest with related data
 */
export interface QuestWithStrength {
	id: string;
	type: string; // QuestType enum as string
	title: string;
	description: string;
	xpReward: number;
	status: string; // QuestStatus enum as string
	expiresAt: Date | null;
	cooldownUntil: Date | null;
	strengthId: string;
	strengthName: string;
	strengthNameEs: string;
	comboBreaker?: {
		id: string;
		name: string;
		nameEs: string;
		requiredStrengths: string[]; // Array of strength names
	};
}

export interface GetDailyQuestsResult {
	success: boolean;
	quests: QuestWithStrength[];
	hasCompletedAll: boolean;
	nextRegenerationTime: Date | null;
	error?: string;
}
