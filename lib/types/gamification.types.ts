/**
 * Gamification Types
 *
 * Types for the gamification system including XP, levels, badges, and streaks.
 */

/**
 * Badge tiers
 */
export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";

/**
 * Badge unlock criteria types (original development-focused)
 */
export type BadgeCriteriaType =
	| "xp"
	| "modules"
	| "challenges"
	| "streak"
	| "collaborative"
	| "level"
	// Assessment & Feedback criteria types (Feature 005)
	| "assessment_completed"
	| "feedbacks_given"
	| "feedbacks_received"
	| "retake_after_feedback"
	// Report criteria types (Feature 009)
	| "report_individual_generated"
	| "report_team_generated";

/**
 * XP source types for tracking where XP came from
 */
export type XpSource =
	// Development sources (Feature 004)
	| "challenge_completed"
	| "module_completed"
	| "collaborative_bonus"
	| "badge_reward"
	| "streak_bonus"
	// Assessment sources (Feature 005)
	| "assessment_phase_1"
	| "assessment_phase_2"
	| "assessment_complete"
	| "assessment_retake"
	// Feedback sources (Feature 005)
	| "feedback_given"
	| "feedback_received"
	| "feedback_insights"
	| "feedback_applied"
	// Report sources (Feature 009)
	| "report_individual"
	| "report_team_generator"
	| "report_team_contributor";

/**
 * Badge unlock criteria (base interface)
 */
export interface BadgeUnlockCriteria {
	type: BadgeCriteriaType;
	threshold: number;
	/** Optional: Period in days for time-bound criteria */
	periodDays?: number;
	/** Optional: Minimum feedbacks required for retake_after_feedback */
	minFeedbacks?: number;
}

/**
 * Badge data
 */
export interface BadgeData {
	id: string;
	key: string;
	nameEs: string;
	descriptionEs: string;
	iconUrl: string;
	tier: BadgeTier;
	unlockCriteria: BadgeUnlockCriteria;
	xpReward: number;
	isActive: boolean;
}

/**
 * User's unlocked badge
 */
export interface UserBadgeData {
	id: string;
	gamificationId: string;
	badgeId: string;
	unlockedAt: Date;
	badge: BadgeData;
}

/**
 * User gamification profile
 */
export interface UserGamificationData {
	id: string;
	userId: string;
	xpTotal: number;
	currentLevel: number;
	currentLevelXp: number;
	nextLevelXpRequired: number;
	longestStreak: number;
	currentStreak: number;
	lastActivityDate?: Date | null;
	modulesCompleted: number;
	challengesCompleted: number;
	collaborativeChallenges: number;
	badges?: UserBadgeData[];
}

/**
 * Level information
 */
export interface LevelInfo {
	level: number;
	name: string;
	minXp: number;
	maxXp: number;
	color: string;
}

/**
 * XP gain event
 */
export interface XpGainEvent {
	type: "challenge" | "module" | "badge" | "streak" | "collaboration";
	amount: number;
	description: string;
	timestamp: Date;
}

/**
 * Level up event
 */
export interface LevelUpEvent {
	previousLevel: number;
	newLevel: number;
	xpTotal: number;
	timestamp: Date;
}

/**
 * Streak information
 */
export interface StreakInfo {
	currentStreak: number;
	longestStreak: number;
	lastActivityDate?: Date | null;
	streakActive: boolean;
	daysUntilStreakLost: number;
}

/**
 * Gamification stats for dashboard
 */
export interface GamificationStats {
	xpTotal: number;
	currentLevel: number;
	currentLevelXp: number;
	nextLevelXpRequired: number;
	levelProgress: number; // 0-100 percentage
	modulesCompleted: number;
	challengesCompleted: number;
	collaborativeChallenges: number;
	badgesUnlocked: number;
	totalBadges: number;
	currentStreak: number;
	longestStreak: number;
}

/**
 * XP update result
 */
export interface XpUpdateResult {
	previousXp: number;
	newXp: number;
	xpGained: number;
	previousLevel: number;
	newLevel: number;
	leveledUp: boolean;
	newBadges: BadgeData[];
	streakUpdated: boolean;
	newStreakValue: number;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
	userId: string;
	userName: string;
	userImage?: string | null;
	xpTotal: number;
	level: number;
	rank: number;
}

/**
 * Badge progress (for badges not yet unlocked)
 */
export interface BadgeProgress {
	badge: BadgeData;
	currentValue: number;
	targetValue: number;
	progress: number; // 0-100 percentage
	isUnlocked: boolean;
	unlockedAt?: Date | null;
}

/**
 * Activity summary for a time period
 */
export interface ActivitySummary {
	periodStart: Date;
	periodEnd: Date;
	xpEarned: number;
	challengesCompleted: number;
	modulesCompleted: number;
	badgesUnlocked: number;
	streakMaintained: boolean;
}

/**
 * Gamification notification
 */
export interface GamificationNotification {
	type: "xp" | "level_up" | "badge" | "streak" | "module_complete";
	title: string;
	description: string;
	icon?: string;
	xpAmount?: number;
	timestamp: Date;
}

// =============================================================================
// FEATURE 005: Gamification Integration Types
// =============================================================================

/**
 * Parameters for awarding XP
 */
export interface AwardXpParams {
	userId: string;
	amount: number;
	source: XpSource;
	applyStreakBonus?: boolean;
}

/**
 * Result of awarding XP
 */
export interface AwardXpResult {
	xpAwarded: number;
	baseXp: number;
	streakMultiplier: number;
	totalXp: number;
	previousLevel: number;
	newLevel: number;
	leveledUp: boolean;
}

/**
 * Context for checking badge unlocks
 */
export interface BadgeCheckContext {
	assessmentCompleted?: boolean;
	feedbackGiven?: boolean;
	feedbackReceived?: boolean;
	isRetake?: boolean;
	// Feature 009 additions
	reportIndividualGenerated?: boolean;
	reportTeamGenerated?: boolean;
}

/**
 * Result of a badge unlock
 */
export interface UnlockedBadge {
	badge: {
		id: string;
		slug: string;
		name: string;
		description: string;
		tier: BadgeTier;
		xpReward: number;
		iconUrl: string | null;
	};
	earnedAt: Date;
}

/**
 * Extended user stats for Feature 005 badge criteria
 */
export interface ExtendedUserBadgeStats {
	xpTotal: number;
	currentLevel: number;
	modulesCompleted: number;
	challengesCompleted: number;
	longestStreak: number;
	currentStreak: number;
	collaborativeChallenges: number;
	// Feature 005 additions
	assessmentsCompleted: number;
	feedbacksGiven: number;
	feedbacksGivenLast30Days: number;
	feedbacksReceived: number;
	hasRetakeAfterFeedback: boolean;
	// Feature 009 additions
	individualReportsGenerated: number;
	teamReportsGenerated: number;
}
