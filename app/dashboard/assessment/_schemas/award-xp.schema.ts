import { z } from "zod";

/**
 * Zod schemas for assessment XP award actions
 * Part of Feature 005: Gamification Integration
 */

/**
 * Valid assessment milestones that award XP
 */
export const AssessmentMilestoneSchema = z.enum([
	"phase_1",
	"phase_2",
	"completion",
]);

export type AssessmentMilestone = z.infer<typeof AssessmentMilestoneSchema>;

/**
 * Input schema for awardAssessmentXp action
 */
export const AwardAssessmentXpInputSchema = z.object({
	sessionId: z.string().uuid("ID de sesión inválido"),
	milestone: AssessmentMilestoneSchema,
});

export type AwardAssessmentXpInput = z.infer<
	typeof AwardAssessmentXpInputSchema
>;

/**
 * XP tracking structure stored in AssessmentSession.results JSON
 */
export const XpAwardedTrackingSchema = z.object({
	phase1: z.boolean().optional(),
	phase2: z.boolean().optional(),
	completion: z.boolean().optional(),
	retakeBonus: z.boolean().optional(),
});

export type XpAwardedTracking = z.infer<typeof XpAwardedTrackingSchema>;
