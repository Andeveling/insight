/**
 * Challenge Schemas
 *
 * Zod validation schemas for challenge operations.
 */

import { z } from "zod";

/**
 * Challenge type enum schema
 */
export const ChallengeTypeSchema = z.enum([
  "reflection",
  "action",
  "collaboration",
]);

/**
 * Schema for challenge data from database
 */
export const ChallengeDataSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  titleEs: z.string(),
  descriptionEs: z.string(),
  type: ChallengeTypeSchema,
  xpReward: z.number(),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema for completing a challenge
 */
export const CompleteChallengeInputSchema = z.object({
  challengeId: z.string().min(1, "El ID del desafío es requerido"),
  reflection: z
    .string()
    .max(2000, "La reflexión no puede exceder 2000 caracteres")
    .optional(),
});

/**
 * Schema for challenge completion result
 */
export const ChallengeCompletionResultSchema = z.object({
  success: z.boolean(),
  xpGained: z.number(),
  totalXp: z.number(),
  leveledUp: z.boolean(),
  newLevel: z.number().optional(),
  moduleCompleted: z.boolean(),
  badgesUnlocked: z.array(
    z.object({
      id: z.string(),
      nameEs: z.string(),
      iconUrl: z.string(),
      xpReward: z.number(),
    })
  ),
  message: z.string(),
});

/**
 * Schema for challenge card display
 */
export const ChallengeCardSchema = z.object({
  id: z.string(),
  titleEs: z.string(),
  descriptionEs: z.string(),
  type: ChallengeTypeSchema,
  xpReward: z.number(),
  isCompleted: z.boolean(),
  completedAt: z.date().nullable(),
  order: z.number().optional(),
});

/**
 * Schema for collaborative challenge completion
 */
export const CollaborativeChallengeInputSchema = z.object({
  challengeId: z.string().min(1, "El ID del desafío es requerido"),
  partnerId: z.string().min(1, "El ID del compañero es requerido"),
  reflection: z
    .string()
    .max(2000, "La reflexión no puede exceder 2000 caracteres")
    .optional(),
});

/**
 * Schema for collaborative challenge status
 */
export const CollaborativeChallengeStatusSchema = z.object({
  challengeId: z.string(),
  initiatorId: z.string(),
  partnerId: z.string(),
  initiatorConfirmed: z.boolean(),
  partnerConfirmed: z.boolean(),
  isCompleted: z.boolean(),
  completedAt: z.date().nullable(),
  xpBonus: z.number(),
});

export type ChallengeType = z.infer<typeof ChallengeTypeSchema>;
export type ChallengeData = z.infer<typeof ChallengeDataSchema>;
export type CompleteChallengeInput = z.infer<
  typeof CompleteChallengeInputSchema
>;
export type ChallengeCompletionResult = z.infer<
  typeof ChallengeCompletionResultSchema
>;
export type ChallengeCard = z.infer<typeof ChallengeCardSchema>;
export type CollaborativeChallengeInput = z.infer<
  typeof CollaborativeChallengeInputSchema
>;
export type CollaborativeChallengeStatus = z.infer<
  typeof CollaborativeChallengeStatusSchema
>;
