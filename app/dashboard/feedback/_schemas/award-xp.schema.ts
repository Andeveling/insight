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

export type AwardFeedbackGivenXpInput = z.infer<typeof AwardFeedbackGivenXpInputSchema>;

/**
 * Input schema for awardFeedbackReceivedXp action
 * Uses only requestId - triggered when feedback is completed for a request
 */
export const AwardFeedbackReceivedXpInputSchema = z.object({
  requestId: z.string().uuid("ID de solicitud inválido"),
});

export type AwardFeedbackReceivedXpInput = z.infer<typeof AwardFeedbackReceivedXpInputSchema>;
