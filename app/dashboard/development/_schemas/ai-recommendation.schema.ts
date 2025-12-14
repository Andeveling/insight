/**
 * AI Recommendation Schemas
 *
 * Zod validation schemas for AI Coach recommendation operations.
 */

import { z } from "zod";

/**
 * Recommendation type enum schema
 */
export const RecommendationTypeSchema = z.enum([
  "next-module",
  "peer-match",
  "badge-focus",
  "skill-gap",
]);

/**
 * Schema for module recommendation
 */
export const ModuleRecommendationSchema = z.object({
  moduleId: z.string(),
  moduleKey: z.string(),
  titleEs: z.string(),
  descriptionEs: z.string(),
  reason: z.string(),
  relevanceScore: z.number().min(0).max(100),
  estimatedMinutes: z.number(),
  xpReward: z.number(),
  level: z.enum([ "beginner", "intermediate", "advanced" ]),
});

/**
 * Schema for peer match recommendation
 */
export const PeerMatchRecommendationSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userImage: z.string().nullable(),
  matchReason: z.string(),
  complementaryStrengths: z.array(z.string()),
  suggestedChallenges: z.array(z.string()),
  matchScore: z.number().min(0).max(100),
});

/**
 * Schema for badge focus recommendation
 */
export const BadgeFocusRecommendationSchema = z.object({
  badgeId: z.string(),
  badgeKey: z.string(),
  nameEs: z.string(),
  iconUrl: z.string(),
  currentProgress: z.number(),
  requiredProgress: z.number(),
  nextSteps: z.array(z.string()),
  estimatedTimeToUnlock: z.string(),
});

/**
 * Schema for AI recommendations response
 */
export const AiRecommendationsResponseSchema = z.object({
  modules: z.array(ModuleRecommendationSchema),
  peers: z.array(PeerMatchRecommendationSchema),
  badges: z.array(BadgeFocusRecommendationSchema),
  coachMessage: z.string(),
  generatedAt: z.date(),
  expiresAt: z.date(),
  isCached: z.boolean(),
});

/**
 * Schema for requesting AI recommendations
 */
export const GetAiRecommendationsInputSchema = z.object({
  forceRefresh: z.boolean().optional().default(false),
  types: z
    .array(RecommendationTypeSchema)
    .optional()
    .default([ "next-module", "badge-focus" ]),
});

/**
 * Schema for recommendation feedback
 */
export const RecommendationFeedbackSchema = z.object({
  recommendationType: RecommendationTypeSchema,
  recommendationId: z.string(),
  feedback: z.enum([ "helpful", "not_helpful", "dismissed" ]),
  reason: z.string().max(500).optional(),
});

/**
 * Schema for AI coach prompt context
 */
export const AiCoachContextSchema = z.object({
  userStrengths: z.array(
    z.object({
      strengthKey: z.string(),
      strengthName: z.string(),
      domainKey: z.string(),
      rank: z.number(),
    })
  ),
  completedModules: z.array(z.string()),
  inProgressModules: z.array(z.string()),
  currentLevel: z.number(),
  xpTotal: z.number(),
  currentStreak: z.number(),
  unlockedBadges: z.array(z.string()),
  recentActivity: z.array(
    z.object({
      type: z.string(),
      timestamp: z.date(),
    })
  ),
});

export type RecommendationType = z.infer<typeof RecommendationTypeSchema>;
export type ModuleRecommendation = z.infer<typeof ModuleRecommendationSchema>;
export type PeerMatchRecommendation = z.infer<
  typeof PeerMatchRecommendationSchema
>;
export type BadgeFocusRecommendation = z.infer<
  typeof BadgeFocusRecommendationSchema
>;
export type AiRecommendationsResponse = z.infer<
  typeof AiRecommendationsResponseSchema
>;
export type GetAiRecommendationsInput = z.infer<
  typeof GetAiRecommendationsInputSchema
>;
export type RecommendationFeedback = z.infer<
  typeof RecommendationFeedbackSchema
>;
export type AiCoachContext = z.infer<typeof AiCoachContextSchema>;
