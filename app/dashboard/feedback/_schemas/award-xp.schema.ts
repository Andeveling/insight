import { z } from "zod";

/**
 * Zod schemas for feedback XP award actions
 * Part of Feature 005: Gamification Integration
 */

/**
 * Input schema for awardFeedbackGivenXp action
 * Uses requestId since giving feedback is per-request, not per-response
 */
export const AwardFeedbackGivenXpInputSchema = z.object({
	requestId: z.string().uuid("ID de solicitud inválido"),
});

export type AwardFeedbackGivenXpInput = z.infer<
	typeof AwardFeedbackGivenXpInputSchema
>;

/**
 * Input schema for awardFeedbackReceivedXp action
 * Uses only requestId - triggered when feedback is completed for a request
 */
export const AwardFeedbackReceivedXpInputSchema = z.object({
	requestId: z.string().uuid("ID de solicitud inválido"),
});

export type AwardFeedbackReceivedXpInput = z.infer<
	typeof AwardFeedbackReceivedXpInputSchema
>;

/**
 * Input schema for awardInsightsXp action
 * Awards XP when feedback insights are generated (3+ responses threshold reached)
 */
export const AwardInsightsXpInputSchema = z.object({
	userId: z.string().uuid("ID de usuario inválido"),
	summaryId: z.string().uuid("ID de resumen inválido"),
});

export type AwardInsightsXpInput = z.infer<typeof AwardInsightsXpInputSchema>;
