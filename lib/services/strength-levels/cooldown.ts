/**
 * Cooldown Service
 *
 * Manages cooldown calculations for quest types that have restrictions.
 * Boss Battles: 7 days, Combo Breakers: 3 days, Cooperative: 2 days confirmation window
 */

import {
	DAILY_QUEST_EXPIRATION_HOURS,
	QUEST_COOLDOWNS,
} from "@/lib/constants/strength-levels.constants";
import type { QuestType } from "@/lib/types/strength-levels.types";

/**
 * Cooldown status result
 */
export interface CooldownStatus {
	isInCooldown: boolean;
	cooldownEndsAt: Date | null;
	remainingHours: number;
	remainingMinutes: number;
	remainingSeconds: number;
	formattedRemaining: string;
	percentageComplete: number;
}

/**
 * Check if a quest type is currently in cooldown
 */
export function isInCooldown(
	questType: QuestType,
	lastCompletedAt: Date | null,
): boolean {
	if (!lastCompletedAt) {
		return false;
	}

	const cooldownHours = QUEST_COOLDOWNS[questType];

	if (!cooldownHours) {
		return false; // DAILY quests don't have cooldown
	}

	const cooldownEndsAt = new Date(
		lastCompletedAt.getTime() + cooldownHours * 60 * 60 * 1000,
	);
	return new Date() < cooldownEndsAt;
}

/**
 * Calculate remaining cooldown time
 */
export function calculateCooldownRemaining(
	questType: QuestType,
	lastCompletedAt: Date | null,
): CooldownStatus {
	if (!lastCompletedAt) {
		return {
			isInCooldown: false,
			cooldownEndsAt: null,
			remainingHours: 0,
			remainingMinutes: 0,
			remainingSeconds: 0,
			formattedRemaining: "",
			percentageComplete: 100,
		};
	}

	const cooldownHours = QUEST_COOLDOWNS[questType];

	if (!cooldownHours) {
		return {
			isInCooldown: false,
			cooldownEndsAt: null,
			remainingHours: 0,
			remainingMinutes: 0,
			remainingSeconds: 0,
			formattedRemaining: "",
			percentageComplete: 100,
		};
	}

	const cooldownMs = cooldownHours * 60 * 60 * 1000;
	const cooldownEndsAt = new Date(lastCompletedAt.getTime() + cooldownMs);
	const now = new Date();

	if (now >= cooldownEndsAt) {
		return {
			isInCooldown: false,
			cooldownEndsAt,
			remainingHours: 0,
			remainingMinutes: 0,
			remainingSeconds: 0,
			formattedRemaining: "",
			percentageComplete: 100,
		};
	}

	const remainingMs = cooldownEndsAt.getTime() - now.getTime();
	const totalSeconds = Math.floor(remainingMs / 1000);
	const remainingHours = Math.floor(totalSeconds / 3600);
	const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
	const remainingSeconds = totalSeconds % 60;

	// Calculate percentage of cooldown elapsed
	const elapsedMs = now.getTime() - lastCompletedAt.getTime();
	const percentageComplete = Math.round((elapsedMs / cooldownMs) * 100);

	return {
		isInCooldown: true,
		cooldownEndsAt,
		remainingHours,
		remainingMinutes,
		remainingSeconds,
		formattedRemaining: formatCooldownDisplay(
			remainingHours,
			remainingMinutes,
			remainingSeconds,
		),
		percentageComplete,
	};
}

/**
 * Format cooldown time for display (CyberPunk style)
 */
export function formatCooldownDisplay(
	hours: number,
	minutes: number,
	seconds: number,
): string {
	if (hours >= 24) {
		const days = Math.floor(hours / 24);
		const remainingHours = hours % 24;
		return `${days}D ${String(remainingHours).padStart(2, "0")}H`;
	}

	if (hours > 0) {
		return `${String(hours).padStart(2, "0")}H ${String(minutes).padStart(2, "0")}M`;
	}

	if (minutes > 0) {
		return `${String(minutes).padStart(2, "0")}M ${String(seconds).padStart(2, "0")}S`;
	}

	return `${String(seconds).padStart(2, "0")}S`;
}

/**
 * Get cooldown duration for a quest type
 */
export function getCooldownDuration(questType: QuestType): number | null {
	return QUEST_COOLDOWNS[questType] ?? null;
}

/**
 * Check if a daily quest has expired
 */
export function isDailyQuestExpired(startedAt: Date): boolean {
	const expirationMs = DAILY_QUEST_EXPIRATION_HOURS * 60 * 60 * 1000;
	const expiresAt = new Date(startedAt.getTime() + expirationMs);
	return new Date() > expiresAt;
}

/**
 * Calculate remaining time for daily quest completion
 */
export function getDailyQuestTimeRemaining(startedAt: Date): CooldownStatus {
	const expirationMs = DAILY_QUEST_EXPIRATION_HOURS * 60 * 60 * 1000;
	const expiresAt = new Date(startedAt.getTime() + expirationMs);
	const now = new Date();

	if (now >= expiresAt) {
		return {
			isInCooldown: false, // "Cooldown" here means "time remaining"
			cooldownEndsAt: expiresAt,
			remainingHours: 0,
			remainingMinutes: 0,
			remainingSeconds: 0,
			formattedRemaining: "[EXPIRED]",
			percentageComplete: 100,
		};
	}

	const remainingMs = expiresAt.getTime() - now.getTime();
	const totalSeconds = Math.floor(remainingMs / 1000);
	const remainingHours = Math.floor(totalSeconds / 3600);
	const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
	const remainingSeconds = totalSeconds % 60;

	const elapsedMs = now.getTime() - startedAt.getTime();
	const percentageComplete = Math.round((elapsedMs / expirationMs) * 100);

	return {
		isInCooldown: true,
		cooldownEndsAt: expiresAt,
		remainingHours,
		remainingMinutes,
		remainingSeconds,
		formattedRemaining: formatCooldownDisplay(
			remainingHours,
			remainingMinutes,
			remainingSeconds,
		),
		percentageComplete,
	};
}

/**
 * Get the cooperative quest confirmation deadline
 */
export function getCooperativeConfirmationDeadline(requestedAt: Date): Date {
	const confirmationWindowHours = QUEST_COOLDOWNS.COOPERATIVE ?? 48;
	return new Date(
		requestedAt.getTime() + confirmationWindowHours * 60 * 60 * 1000,
	);
}

/**
 * Check if cooperative quest confirmation has expired
 */
export function isCooperativeConfirmationExpired(requestedAt: Date): boolean {
	const deadline = getCooperativeConfirmationDeadline(requestedAt);
	return new Date() > deadline;
}

/**
 * Format relative time for CyberPunk display
 * Example: "2H AGO", "3D AGO"
 */
export function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);

	if (diffSeconds < 60) {
		return `${diffSeconds}S AGO`;
	}

	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) {
		return `${diffMinutes}M AGO`;
	}

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}H AGO`;
	}

	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 30) {
		return `${diffDays}D AGO`;
	}

	const diffMonths = Math.floor(diffDays / 30);
	return `${diffMonths}MO AGO`;
}
