/**
 * Strength Levels Type Definitions
 * Re-exports Prisma enums and defines additional types for the strength maturity levels system
 */

// Re-export Prisma enums as the source of truth
export {
	MaturityLevel,
	QuestStatus,
	QuestType,
} from "@/generated/prisma/enums";

import type {
	MaturityLevel,
	QuestStatus,
	QuestType,
} from "@/generated/prisma/enums";

/**
 * Strength maturity progress with calculated fields
 */
export interface StrengthMaturityProgress {
	strengthId: string;
	strengthName: string;
	strengthNameEs: string;
	currentLevel: MaturityLevel;
	xpCurrent: number;
	xpTotal: number;
	xpForNextLevel: number | null; // null if max level
	progressPercent: number;
	isMaxLevel: boolean;
	levelReachedAt: Date | null;
}

/**
 * Quest with related strength and combo data
 */
export interface QuestWithStrength {
	id: string;
	type: QuestType;
	title: string;
	description: string;
	xpReward: number;
	status: QuestStatus;
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

/**
 * Result of completing a quest
 */
export interface CompletedQuestResult {
	success: boolean;
	xpAwarded: number;
	leveledUp: boolean;
	newLevel?: MaturityLevel;
	newXpCurrent: number;
	error?: string;
}

/**
 * XP calculation result
 */
export interface XpProgressCalculation {
	progressPercent: number;
	xpForNextLevel: number | null;
	isMaxLevel: boolean;
}

/**
 * Level up check result
 */
export interface LevelUpCheck {
	shouldLevelUp: boolean;
	newLevel?: MaturityLevel;
}
