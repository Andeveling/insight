/**
 * AI Coach Types
 *
 * Types for the AI-powered coaching and recommendation system.
 */

/**
 * Recommendation types
 */
export type RecommendationType = "next-module" | "challenge" | "peer-match";

/**
 * Module recommendation from AI
 */
export interface ModuleRecommendation {
  moduleId: string;
  moduleKey: string;
  titleEs: string;
  descriptionEs: string;
  reason: string;
  relevanceScore: number; // 0-100
  estimatedMinutes: number;
  xpReward: number;
  level: string;
}

/**
 * Challenge recommendation from AI
 */
export interface ChallengeRecommendation {
  challengeId: string;
  titleEs: string;
  descriptionEs: string;
  type: string;
  reason: string;
  xpReward: number;
  moduleKey: string;
  moduleTitleEs: string;
}

/**
 * Peer match recommendation for collaborative challenges
 */
export interface PeerMatchRecommendation {
  userId: string;
  userName: string;
  userImage?: string | null;
  matchReason: string;
  complementaryStrengths: string[];
  suggestedChallenges: string[];
  matchScore: number; // 0-100
}

/**
 * AI recommendation response
 */
export interface AiRecommendationResponse<T> {
  recommendations: T[];
  generatedAt: Date;
  expiresAt: Date;
  modelUsed: string;
  strengthsHash: string;
}

/**
 * Cached recommendation in database
 */
export interface CachedRecommendation {
  id: string;
  userId: string;
  recommendationType: RecommendationType;
  recommendations: string; // JSON string
  strengthsHash: string;
  modelUsed: string;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * User context for AI recommendations
 */
export interface UserRecommendationContext {
  userId: string;
  userStrengths: UserStrength[];
  completedModules: string[];
  completedChallenges: string[];
  currentLevel: number;
  preferredChallengeTypes?: string[];
  recentActivity: RecentActivity[];
}

/**
 * User strength for context
 */
export interface UserStrength {
  strengthKey: string;
  strengthName: string;
  domainKey: string;
  rank: number;
}

/**
 * Recent activity for context
 */
export interface RecentActivity {
  type: "module" | "challenge" | "collaboration";
  itemId: string;
  completedAt: Date;
}

/**
 * AI prompt for module recommendations
 */
export interface ModuleRecommendationPrompt {
  userStrengths: UserStrength[];
  completedModules: string[];
  availableModules: AvailableModule[];
  currentLevel: number;
  maxRecommendations: number;
}

/**
 * Available module for AI context
 */
export interface AvailableModule {
  key: string;
  titleEs: string;
  descriptionEs: string;
  level: string;
  strengthKey?: string | null;
  domainKey?: string | null;
  xpReward: number;
  estimatedMinutes: number;
}

/**
 * AI prompt for peer matching
 */
export interface PeerMatchPrompt {
  userId: string;
  userStrengths: UserStrength[];
  teamMembers: TeamMemberContext[];
  collaborativeChallenges: CollaborativeChallengeContext[];
  maxRecommendations: number;
}

/**
 * Team member context for AI
 */
export interface TeamMemberContext {
  userId: string;
  userName: string;
  strengths: UserStrength[];
  recentCollaborations: number;
}

/**
 * Collaborative challenge context for AI
 */
export interface CollaborativeChallengeContext {
  challengeId: string;
  titleEs: string;
  descriptionEs: string;
  complementaryStrengths: string[];
}

/**
 * AI response schema for module recommendations
 */
export interface AiModuleRecommendationSchema {
  recommendations: Array<{
    moduleKey: string;
    reason: string;
    relevanceScore: number;
  }>;
}

/**
 * AI response schema for peer matching
 */
export interface AiPeerMatchSchema {
  recommendations: Array<{
    userId: string;
    matchReason: string;
    complementaryStrengths: string[];
    suggestedChallengeIds: string[];
    matchScore: number;
  }>;
}

/**
 * Recommendation cache configuration
 */
export interface RecommendationCacheConfig {
  ttlDays: number;
  maxRecommendations: number;
  modelName: string;
}

/**
 * Default cache configuration
 */
export const DEFAULT_RECOMMENDATION_CACHE_CONFIG: RecommendationCacheConfig = {
  ttlDays: 7,
  maxRecommendations: 5,
  modelName: "gpt-4o-mini",
};
