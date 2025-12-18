/**
 * Badge Criteria Configuration
 *
 * Defines the rules and thresholds for unlocking badges
 * in the gamification system.
 */

import type {
	BadgeCriteriaType,
	BadgeTier,
	BadgeUnlockCriteria,
} from "@/lib/types/gamification.types";

/**
 * Badge tier colors for UI
 */
export const BADGE_TIER_COLORS: Record<BadgeTier, string> = {
	bronze: "amber",
	silver: "slate",
	gold: "yellow",
	platinum: "violet",
};

/**
 * Badge tier order for sorting
 */
export const BADGE_TIER_ORDER: Record<BadgeTier, number> = {
	bronze: 1,
	silver: 2,
	gold: 3,
	platinum: 4,
};

/**
 * Badge type labels in Spanish
 */
export const BADGE_CRITERIA_LABELS: Record<BadgeCriteriaType, string> = {
	xp: "Puntos de Experiencia",
	modules: "Módulos Completados",
	challenges: "Desafíos Completados",
	streak: "Racha de Días",
	collaborative: "Desafíos Colaborativos",
	level: "Nivel Alcanzado",
	// Feature 005: Assessment & Feedback criteria
	assessment_completed: "Evaluaciones Completadas",
	feedbacks_given: "Feedbacks Enviados",
	feedbacks_received: "Feedbacks Recibidos",
	retake_after_feedback: "Evolución Continua",
	// Feature 009: Report criteria
	report_individual_generated: "Reporte Individual Generado",
	report_team_generated: "Reporte de Equipo Generado",
};

/**
 * Badge type icons
 */
export const BADGE_CRITERIA_ICONS: Record<BadgeCriteriaType, string> = {
	xp: "⚡",
	modules: "📚",
	challenges: "🎯",
	streak: "🔥",
	collaborative: "🤝",
	level: "⭐",
	// Feature 005: Assessment & Feedback criteria
	assessment_completed: "🔍",
	feedbacks_given: "🪞",
	feedbacks_received: "👂",
	retake_after_feedback: "🦋",
	// Feature 009: Report criteria
	report_individual_generated: "📊",
	report_team_generated: "👥",
};

/**
 * Standard badge thresholds by type
 */
export const BADGE_THRESHOLDS: Record<BadgeCriteriaType, number[]> = {
	xp: [500, 2000, 5000, 10000],
	modules: [1, 5, 10, 20],
	challenges: [1, 10, 25, 50, 100],
	streak: [3, 7, 14, 30],
	collaborative: [1, 5, 15, 30],
	level: [3, 5, 10, 15],
	// Feature 005: Assessment & Feedback thresholds
	assessment_completed: [1, 3, 5, 10],
	feedbacks_given: [1, 3, 10, 25],
	feedbacks_received: [1, 5, 10, 25],
	retake_after_feedback: [1],
	// Feature 009: Report thresholds
	report_individual_generated: [1],
	report_team_generated: [1],
};

/**
 * Check if a badge should be unlocked based on user stats
 */
export function shouldUnlockBadge(
	criteria: BadgeUnlockCriteria,
	userStats: UserBadgeStats,
): boolean {
	switch (criteria.type) {
		case "xp":
			return userStats.xpTotal >= criteria.threshold;
		case "modules":
			return userStats.modulesCompleted >= criteria.threshold;
		case "challenges":
			return userStats.challengesCompleted >= criteria.threshold;
		case "streak":
			return userStats.longestStreak >= criteria.threshold;
		case "collaborative":
			return userStats.collaborativeChallenges >= criteria.threshold;
		case "level":
			return userStats.currentLevel >= criteria.threshold;
		// Feature 005: Assessment & Feedback criteria
		case "assessment_completed":
			return (userStats.assessmentsCompleted ?? 0) >= criteria.threshold;
		case "feedbacks_given":
			return (userStats.feedbacksGiven ?? 0) >= criteria.threshold;
		case "feedbacks_received":
			return (userStats.feedbacksReceived ?? 0) >= criteria.threshold;
		case "retake_after_feedback":
			return userStats.hasRetakeAfterFeedback ?? false;
		default:
			return false;
	}
}

/**
 * User stats interface for badge checking
 */
export interface UserBadgeStats {
	xpTotal: number;
	currentLevel: number;
	modulesCompleted: number;
	challengesCompleted: number;
	longestStreak: number;
	currentStreak: number;
	collaborativeChallenges: number;
	// Feature 005: Assessment & Feedback stats
	assessmentsCompleted?: number;
	feedbacksGiven?: number;
	feedbacksReceived?: number;
	hasRetakeAfterFeedback?: boolean;
}

/**
 * Get the current value for a badge criteria type
 */
export function getCurrentValueForCriteria(
	criteriaType: BadgeCriteriaType,
	userStats: UserBadgeStats,
): number {
	switch (criteriaType) {
		case "xp":
			return userStats.xpTotal;
		case "modules":
			return userStats.modulesCompleted;
		case "challenges":
			return userStats.challengesCompleted;
		case "streak":
			return userStats.longestStreak;
		case "collaborative":
			return userStats.collaborativeChallenges;
		case "level":
			return userStats.currentLevel;
		// Feature 005: Assessment & Feedback criteria
		case "assessment_completed":
			return userStats.assessmentsCompleted ?? 0;
		case "feedbacks_given":
			return userStats.feedbacksGiven ?? 0;
		case "feedbacks_received":
			return userStats.feedbacksReceived ?? 0;
		case "retake_after_feedback":
			return userStats.hasRetakeAfterFeedback ? 1 : 0;
		default:
			return 0;
	}
}

/**
 * Calculate progress towards a badge
 */
export function calculateBadgeProgress(
	criteria: BadgeUnlockCriteria,
	userStats: UserBadgeStats,
): number {
	const currentValue = getCurrentValueForCriteria(criteria.type, userStats);
	const progress = (currentValue / criteria.threshold) * 100;
	return Math.min(Math.round(progress), 100);
}

/**
 * Get next badge threshold for a criteria type
 */
export function getNextBadgeThreshold(
	criteriaType: BadgeCriteriaType,
	currentValue: number,
): number | null {
	const thresholds = BADGE_THRESHOLDS[criteriaType];
	for (const threshold of thresholds) {
		if (currentValue < threshold) {
			return threshold;
		}
	}
	return null; // All badges of this type unlocked
}

/**
 * Parse badge criteria from JSON string
 */
export function parseBadgeCriteria(criteriaJson: string): BadgeUnlockCriteria {
	try {
		return JSON.parse(criteriaJson) as BadgeUnlockCriteria;
	} catch {
		return { type: "xp", threshold: 0 };
	}
}

/**
 * Stringify badge criteria for database storage
 */
export function stringifyBadgeCriteria(criteria: BadgeUnlockCriteria): string {
	return JSON.stringify(criteria);
}

/**
 * Get badges that should be newly unlocked
 */
export function getNewlyUnlockedBadges(
	allBadges: Array<{ key: string; unlockCriteria: string }>,
	unlockedBadgeKeys: string[],
	userStats: UserBadgeStats,
): string[] {
	const newBadges: string[] = [];

	for (const badge of allBadges) {
		// Skip already unlocked badges
		if (unlockedBadgeKeys.includes(badge.key)) {
			continue;
		}

		const criteria = parseBadgeCriteria(badge.unlockCriteria);
		if (shouldUnlockBadge(criteria, userStats)) {
			newBadges.push(badge.key);
		}
	}

	return newBadges;
}

/**
 * Sort badges by tier and then by threshold
 */
export function sortBadges<
	T extends { tier: BadgeTier; unlockCriteria: string | BadgeUnlockCriteria },
>(badges: T[]): T[] {
	return [...badges].sort((a, b) => {
		// First by tier
		const tierDiff = BADGE_TIER_ORDER[a.tier] - BADGE_TIER_ORDER[b.tier];
		if (tierDiff !== 0) return tierDiff;

		// Then by threshold
		const aCriteria =
			typeof a.unlockCriteria === "string"
				? parseBadgeCriteria(a.unlockCriteria)
				: a.unlockCriteria;
		const bCriteria =
			typeof b.unlockCriteria === "string"
				? parseBadgeCriteria(b.unlockCriteria)
				: b.unlockCriteria;
		return aCriteria.threshold - bCriteria.threshold;
	});
}
