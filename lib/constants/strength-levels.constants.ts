/**
 * Strength Levels Constants
 *
 * Centralized configuration for the strength maturity system.
 * XP thresholds, level progression, and quest rewards.
 */

import type {
	MaturityLevel,
	QuestType,
} from "@/lib/types/strength-levels.types";

/**
 * XP thresholds for each maturity level
 * - SPONGE: 0-499 XP (entry level, absorbing knowledge)
 * - CONNECTOR: 500-1499 XP (connecting strengths to life)
 * - GUIDE: 1500-4999 XP (able to guide others)
 * - ALCHEMIST: 5000+ XP (mastery, transforming situations)
 */
export const XP_THRESHOLDS: Record<
	MaturityLevel,
	{ min: number; max: number | null }
> = {
	SPONGE: { min: 0, max: 499 },
	CONNECTOR: { min: 500, max: 1499 },
	GUIDE: { min: 1500, max: 4999 },
	ALCHEMIST: { min: 5000, max: null },
} as const;

/**
 * Ordered progression of maturity levels (lowest to highest)
 */
export const LEVEL_ORDER: MaturityLevel[] = [
	"SPONGE",
	"CONNECTOR",
	"GUIDE",
	"ALCHEMIST",
] as const;

/**
 * XP rewards by quest type
 */
export const QUEST_XP_REWARDS: Record<QuestType, number> = {
	DAILY: 50,
	BOSS_BATTLE: 150,
	COMBO_BREAKER: 100,
	COOPERATIVE: 75,
} as const;

/**
 * Cooperative quest bonus for the partner who confirms
 */
export const COOPERATIVE_PARTNER_BONUS = 25;

/**
 * Cooldown periods in hours by quest type
 */
export const QUEST_COOLDOWNS: Partial<Record<QuestType, number>> = {
	BOSS_BATTLE: 168, // 7 days
	COMBO_BREAKER: 72, // 3 days
	COOPERATIVE: 48, // 2 days for confirmation window
} as const;

/**
 * Level metadata for UI display (CyberPunk theme)
 */
export const LEVEL_METADATA: Record<
	MaturityLevel,
	{
		name: string;
		nameEs: string;
		color: string;
		bgGradient: string;
		icon: string;
		tagPrefix: string;
	}
> = {
	SPONGE: {
		name: "Sponge",
		nameEs: "Esponja",
		color: "#22D3EE", // Cyan
		bgGradient: "from-cyan-500/20 to-cyan-600/10",
		icon: "sponge",
		tagPrefix: "[NODE_INIT]",
	},
	CONNECTOR: {
		name: "Connector",
		nameEs: "Conector",
		color: "#A78BFA", // Violet
		bgGradient: "from-violet-500/20 to-violet-600/10",
		icon: "connector",
		tagPrefix: "[LINK_ACTIVE]",
	},
	GUIDE: {
		name: "Guide",
		nameEs: "Guía",
		color: "#FB923C", // Orange
		bgGradient: "from-orange-500/20 to-orange-600/10",
		icon: "guide",
		tagPrefix: "[MENTOR_MODE]",
	},
	ALCHEMIST: {
		name: "Alchemist",
		nameEs: "Alquimista",
		color: "#FBBF24", // Amber/Gold
		bgGradient: "from-amber-500/20 to-amber-600/10",
		icon: "alchemist",
		tagPrefix: "[MASTER_CORE]",
	},
} as const;

/**
 * Daily quest expiration time (hours from generation)
 */
export const DAILY_QUEST_EXPIRATION_HOURS = 24;

/**
 * Maximum number of daily quests available per strength
 */
export const MAX_DAILY_QUESTS_PER_STRENGTH = 3;

/**
 * Animation durations for UI (in milliseconds)
 * Following CyberPunk HUD design patterns
 */
export const ANIMATION_DURATIONS = {
	xpGain: 800, // XP bar fill animation
	levelUp: 1500, // Level up celebration
	questComplete: 600, // Quest completion feedback
	progressPulse: 2000, // Status pulse interval
} as const;

/**
 * Clip-path styles for CyberPunk UI
 */
export const CLIP_PATHS = {
	card16:
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
	button8:
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
	hexagon: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
	badge4:
		"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
} as const;
