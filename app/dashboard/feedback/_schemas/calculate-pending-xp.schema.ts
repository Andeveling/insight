import { z } from "zod";

/**
 * Zod schemas for calculating pending feedback XP
 * Part of Feature 008: Feedback Gamification Integration
 */

/**
 * Input schema for calculatePendingFeedbackXp utility
 * Used by dashboard to show total pending XP
 */
export const CalculatePendingXpInputSchema = z.object({
  userId: z.string().uuid("ID de usuario inválido"),
});

export type CalculatePendingXpInput = z.infer<typeof CalculatePendingXpInputSchema>;
