/**
 * Progress Schemas
 *
 * Zod validation schemas for progress tracking and gamification.
 */

import { z } from "zod";

/**
 * Module progress status enum schema
 */
export const ModuleProgressStatusSchema = z.enum([
	"not_started",
	"in_progress",
	"completed",
]);

/**
 * Schema for user's module progress
 */
export const UserModuleProgressSchema = z.object({
	id: z.string(),
	userId: z.string(),
	moduleId: z.string(),
	status: ModuleProgressStatusSchema,
	completedChallenges: z.number(),
	totalChallenges: z.number(),
	percentComplete: z.number(),
	startedAt: z.date().nullable(),
	completedAt: z.date().nullable(),
});

/**
 * Schema for user's gamification stats
 */
export const UserGamificationStatsSchema = z.object({
	xpTotal: z.number(),
	currentLevel: z.number(),
	currentLevelName: z.string(),
	xpToNextLevel: z.number(),
	levelProgress: z.number(), // Percentage 0-100
	currentStreak: z.number(),
	longestStreak: z.number(),
	modulesCompleted: z.number(),
	challengesCompleted: z.number(),
	badgesUnlocked: z.number(),
	collaborativeChallengesCompleted: z.number(),
	lastActivityAt: z.date().nullable(),
});

/**
 * Schema for XP update result
 */
export const XpUpdateResultSchema = z.object({
	previousXp: z.number(),
	newXp: z.number(),
	xpGained: z.number(),
	previousLevel: z.number(),
	newLevel: z.number(),
	leveledUp: z.boolean(),
});

/**
 * Schema for streak info
 */
export const StreakInfoSchema = z.object({
	currentStreak: z.number(),
	longestStreak: z.number(),
	lastActivityDate: z.date().nullable(),
	streakActive: z.boolean(),
	bonusMultiplier: z.number(),
});

/**
 * Schema for progress dashboard data
 */
export const ProgressDashboardDataSchema = z.object({
	gamification: UserGamificationStatsSchema,
	streak: StreakInfoSchema,
	recentActivity: z.array(
		z.object({
			type: z.enum([
				"module_started",
				"challenge_completed",
				"badge_unlocked",
				"level_up",
			]),
			title: z.string(),
			xpGained: z.number().optional(),
			timestamp: z.date(),
		}),
	),
	moduleProgress: z.array(
		z.object({
			moduleId: z.string(),
			moduleTitle: z.string(),
			status: ModuleProgressStatusSchema,
			percentComplete: z.number(),
		}),
	),
});

/**
 * Schema for level info
 */
export const LevelInfoSchema = z.object({
	level: z.number(),
	name: z.string(),
	minXp: z.number(),
	maxXp: z.number(),
	color: z.string(),
});

/**
 * Schema for level up event
 */
export const LevelUpEventSchema = z.object({
	previousLevel: z.number(),
	newLevel: z.number(),
	previousLevelName: z.string(),
	newLevelName: z.string(),
	xpTotal: z.number(),
});

export type ModuleProgressStatus = z.infer<typeof ModuleProgressStatusSchema>;
export type UserModuleProgress = z.infer<typeof UserModuleProgressSchema>;
export type UserGamificationStats = z.infer<typeof UserGamificationStatsSchema>;
export type XpUpdateResult = z.infer<typeof XpUpdateResultSchema>;
export type StreakInfo = z.infer<typeof StreakInfoSchema>;
export type ProgressDashboardData = z.infer<typeof ProgressDashboardDataSchema>;
export type LevelInfo = z.infer<typeof LevelInfoSchema>;
export type LevelUpEvent = z.infer<typeof LevelUpEventSchema>;
