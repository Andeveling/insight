/**
 * Readiness Schemas - Zod validation schemas for Report Readiness System
 *
 * These schemas define the contract for readiness calculation and validation.
 *
 * @feature 009-contextual-reports
 */

import { z } from "zod";

// ============================================================
// Requirement Schema
// ============================================================

/**
 * Schema for a single readiness requirement
 */
export const RequirementSchema = z.object({
	/** Unique identifier for the requirement */
	id: z.string(),

	/** Human-readable label (Spanish) */
	label: z.string(),

	/** Current value achieved */
	current: z.number().min(0),

	/** Target value needed */
	target: z.number().min(0),

	/** Whether this requirement is met */
	met: z.boolean(),

	/** Whether this is required or bonus */
	priority: z.enum(["required", "bonus"]),

	/** Icon identifier for UI */
	icon: z.enum(["modules", "xp", "challenges", "strengths", "streak"]),

	/** Link to complete this requirement (optional) */
	actionUrl: z.string().optional(),
});

export type Requirement = z.infer<typeof RequirementSchema>;

// ============================================================
// Team Member Readiness Schema
// ============================================================

/**
 * Schema for team member readiness breakdown
 */
export const TeamMemberReadinessSchema = z.object({
	userId: z.string(),
	userName: z.string(),
	userAvatar: z.string().optional(),
	individualScore: z.number().min(0).max(100),
	isReady: z.boolean(),
});

export type TeamMemberReadiness = z.infer<typeof TeamMemberReadinessSchema>;

// ============================================================
// Report Readiness Schema
// ============================================================

/**
 * Schema for individual report readiness
 */
export const IndividualReadinessSchema = z.object({
	type: z.literal("individual").optional().default("individual"),
	score: z.number().min(0).max(100),
	isReady: z.boolean(),
	requirements: z.array(RequirementSchema),
	calculatedAt: z.date().optional(),
	/** Human-readable status label */
	statusLabel: z.string().optional(),
	/** Next recommended action for improvement */
	nextRecommendedAction: RequirementSchema.optional(),
	/** Development context data */
	developmentContext: z
		.object({
			modulesCompleted: z.number(),
			challengesCompleted: z.number(),
			xpTotal: z.number(),
			currentLevel: z.number(),
			badgesUnlocked: z.number(),
			streakDays: z.number(),
			hasStrengths: z.boolean(),
		})
		.optional(),
});

export type IndividualReadiness = z.infer<typeof IndividualReadinessSchema>;

/**
 * Schema for team report readiness
 */
export const TeamReadinessSchema = z.object({
	type: z.literal("team"),
	score: z.number().min(0).max(100),
	isReady: z.boolean(),
	requirements: z.array(RequirementSchema),
	calculatedAt: z.date(),
	memberBreakdown: z.array(TeamMemberReadinessSchema),
	teamId: z.string(),
	teamName: z.string(),
});

export type TeamReadiness = z.infer<typeof TeamReadinessSchema>;

/**
 * Union schema for any readiness type
 */
export const ReportReadinessSchema = z.discriminatedUnion("type", [
	IndividualReadinessSchema,
	TeamReadinessSchema,
]);

export type ReportReadiness = z.infer<typeof ReportReadinessSchema>;

// ============================================================
// Development Context Schema (for AI prompts)
// ============================================================

/**
 * Schema for module summary in development context
 */
export const ModuleSummarySchema = z.object({
	name: z.string(),
	strengthName: z.string(),
	completedAt: z.date(),
	challengesCompleted: z.number().min(0),
});

export type ModuleSummary = z.infer<typeof ModuleSummarySchema>;

/**
 * Schema for development context included in AI prompts
 */
export const DevelopmentContextSchema = z.object({
	/** User's current level */
	level: z.number().min(1).max(20),

	/** User's level name */
	levelName: z.string(),

	/** Total XP accumulated */
	xpTotal: z.number().min(0),

	/** Current streak in days */
	currentStreak: z.number().min(0),

	/** Longest streak achieved */
	longestStreak: z.number().min(0),

	/** Summary of completed modules (max 10 for token efficiency) */
	modulesCompleted: z.array(ModuleSummarySchema).max(10),

	/** Total challenges completed count */
	challengesCompletedCount: z.number().min(0),

	/** Badges unlocked (names only for prompt) */
	badgesUnlocked: z.array(z.string()).max(20),
});

export type DevelopmentContext = z.infer<typeof DevelopmentContextSchema>;

// ============================================================
// Report Metadata Schema (extended)
// ============================================================

/**
 * Schema for context snapshot stored in report metadata
 */
export const ContextSnapshotSchema = z.object({
	level: z.number(),
	xpTotal: z.number(),
	modulesCount: z.number(),
	challengesCount: z.number(),
	badgesCount: z.number(),
});

export type ContextSnapshot = z.infer<typeof ContextSnapshotSchema>;

/**
 * Schema for extended report metadata (v2)
 */
export const ReportMetadataV2Schema = z.object({
	/** Existing: hash of strengths at generation time */
	strengthsHash: z.string().optional(),

	/** Existing: when generated */
	generatedAt: z.string().optional(),

	/** NEW: Version of report schema */
	schemaVersion: z.union([z.literal(1), z.literal(2)]),

	/** NEW: Whether development context was included */
	hasContext: z.boolean(),

	/** NEW: Snapshot of context at generation time */
	contextSnapshot: ContextSnapshotSchema.optional(),
});

export type ReportMetadataV2 = z.infer<typeof ReportMetadataV2Schema>;

// ============================================================
// Action Response Schemas
// ============================================================

/**
 * Schema for get-individual-readiness action response
 */
export const GetIndividualReadinessResponseSchema = z.object({
	success: z.boolean(),
	readiness: IndividualReadinessSchema.optional(),
	error: z.string().optional(),
});

export type GetIndividualReadinessResponse = z.infer<
	typeof GetIndividualReadinessResponseSchema
>;

/**
 * Schema for get-team-readiness action response
 */
export const GetTeamReadinessResponseSchema = z.object({
	success: z.boolean(),
	readiness: TeamReadinessSchema.optional(),
	error: z.string().optional(),
});

export type GetTeamReadinessResponse = z.infer<
	typeof GetTeamReadinessResponseSchema
>;
