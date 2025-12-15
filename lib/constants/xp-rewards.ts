/**
 * XP Rewards Constants
 *
 * Defines XP values for assessment and feedback gamification.
 * Used by gamification.service.ts to award XP consistently.
 */

/**
 * XP rewards for assessment milestones
 */
export const ASSESSMENT_XP_REWARDS = {
  /** XP awarded after completing Phase 1 (20 questions) */
  PHASE_1_COMPLETE: 100,
  /** XP awarded after completing Phase 2 (30 additional questions) */
  PHASE_2_COMPLETE: 150,
  /** Bonus XP awarded for completing the entire assessment */
  ASSESSMENT_COMPLETE: 250,
  /** Reduced total XP for assessment retakes */
  ASSESSMENT_RETAKE: 200,
} as const;

/**
 * XP rewards for feedback activities
 */
export const FEEDBACK_XP_REWARDS = {
  /** XP awarded when user submits peer feedback */
  FEEDBACK_GIVEN: 75,
  /** XP awarded to requester when receiving feedback */
  FEEDBACK_RECEIVED: 25,
  /** Bonus XP when reaching 3+ feedback responses (insights threshold) */
  INSIGHTS_UNLOCKED: 50,
  /** XP awarded when user applies feedback suggestions to profile */
  FEEDBACK_APPLIED: 30,
} as const;

/**
 * XP rewards for badge unlocks by tier
 */
export const BADGE_XP_BY_TIER = {
  bronze: 25,
  silver: 75,
  gold: 150,
  platinum: 250,
} as const;

/**
 * Total potential XP from assessment (first completion)
 */
export const ASSESSMENT_TOTAL_XP =
  ASSESSMENT_XP_REWARDS.PHASE_1_COMPLETE +
  ASSESSMENT_XP_REWARDS.PHASE_2_COMPLETE +
  ASSESSMENT_XP_REWARDS.ASSESSMENT_COMPLETE;

/**
 * Insights threshold - minimum responses needed for insights feature
 */
export const INSIGHTS_THRESHOLD = 3;

export type AssessmentXpReward =
  (typeof ASSESSMENT_XP_REWARDS)[ keyof typeof ASSESSMENT_XP_REWARDS ];
export type FeedbackXpReward =
  (typeof FEEDBACK_XP_REWARDS)[ keyof typeof FEEDBACK_XP_REWARDS ];
export type BadgeTierXpReward =
  (typeof BADGE_XP_BY_TIER)[ keyof typeof BADGE_XP_BY_TIER ];
