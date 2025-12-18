/**
 * Score Helpers
 *
 * Utility functions for working with match scores.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_utils/score-helpers
 */

import { SCORE_RANGES } from "@/lib/types/match-score.types";

/**
 * Score thresholds for quick access
 */
export const SCORE_THRESHOLDS = {
	EXCELLENT: 85,
	GOOD: 70,
	FAIR: 50,
	POOR: 0,
} as const;

/**
 * Get score color class based on score value
 */
export function getScoreColor(score: number | null): string {
	if (score === null) return "bg-muted text-muted-foreground";
	if (score >= SCORE_THRESHOLDS.EXCELLENT)
		return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
	if (score >= SCORE_THRESHOLDS.GOOD)
		return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
	if (score >= SCORE_THRESHOLDS.FAIR)
		return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
	return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
}

/**
 * Get score label based on score value
 */
export function getScoreLabel(score: number | null): string {
	if (score === null) return "N/A";
	if (score >= SCORE_THRESHOLDS.EXCELLENT) return "Excelente";
	if (score >= SCORE_THRESHOLDS.GOOD) return "Bueno";
	if (score >= SCORE_THRESHOLDS.FAIR) return "Regular";
	return "Bajo";
}

/**
 * Get full score info based on score value
 */
export function getScoreInfo(score: number | null): {
	color: string;
	label: string;
	description: string;
} {
	if (score === null) {
		return {
			color: "bg-muted text-muted-foreground",
			label: "N/A",
			description: "",
		};
	}

	const range = SCORE_RANGES.find((r) => score >= r.min && score <= r.max);

	if (!range) {
		return {
			color: "bg-muted text-muted-foreground",
			label: "N/A",
			description: "",
		};
	}

	return {
		color: getScoreColor(score),
		label: range.labelEs,
		description: range.descriptionEs,
	};
}

/**
 * Get domain color class
 */
export function getDomainColor(domainName: string): string {
	const colors: Record<string, string> = {
		Thinking:
			"bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
		Relating:
			"bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
		Executing:
			"bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
		Influencing:
			"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
		"Strategic Thinking":
			"bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
		"Relationship Building":
			"bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
	};

	return colors[domainName] || "bg-muted text-muted-foreground";
}
