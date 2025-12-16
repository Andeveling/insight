/**
 * Development Feature Schemas - Barrel Export
 *
 * Exports all Zod validation schemas for the development feature.
 */

// Module schemas
export {
  ModuleLevelSchema,
  ModuleTypeSchema,
  ModuleDataSchema,
  StartModuleInputSchema,
  GetModuleDetailInputSchema,
  ModuleFiltersSchema,
  ModuleCardSchema,
  ModuleDetailSchema,
  GenerateModuleInputSchema,
  type ModuleLevel,
  type ModuleType,
  type ModuleData,
  type StartModuleInput,
  type GetModuleDetailInput,
  type ModuleFilters,
  type ModuleCard,
  type ModuleDetail,
  type GenerateModuleInput,
} from "./module.schema";

// Professional profile schemas
export {
  RoleStatusSchema,
  CareerGoalSchema,
  ProfessionalProfileSchema,
  SaveProfileInputSchema,
  ProfileOutputSchema,
  ProfileFormSchema,
  type RoleStatus,
  type CareerGoal,
  type ProfessionalProfile,
  type SaveProfileInput,
  type ProfileOutput,
  type ProfileFormData,
} from "./professional-profile.schema";

// Challenge schemas
export {
  ChallengeTypeSchema,
  ChallengeDataSchema,
  CompleteChallengeInputSchema,
  ChallengeCompletionResultSchema,
  ChallengeCardSchema,
  CollaborativeChallengeInputSchema,
  CollaborativeChallengeStatusSchema,
  type ChallengeType,
  type ChallengeData,
  type CompleteChallengeInput,
  type ChallengeCompletionResult,
  type ChallengeCard,
  type CollaborativeChallengeInput,
  type CollaborativeChallengeStatus,
} from "./challenge.schema";

// Progress schemas
export {
  ModuleProgressStatusSchema,
  UserModuleProgressSchema,
  UserGamificationStatsSchema,
  XpUpdateResultSchema,
  StreakInfoSchema,
  ProgressDashboardDataSchema,
  LevelInfoSchema,
  LevelUpEventSchema,
  type ModuleProgressStatus,
  type UserModuleProgress,
  type UserGamificationStats,
  type XpUpdateResult,
  type StreakInfo,
  type ProgressDashboardData,
  type LevelInfo,
  type LevelUpEvent,
} from "./progress.schema";

// AI Recommendation schemas
export {
  RecommendationTypeSchema,
  ModuleRecommendationSchema,
  PeerMatchRecommendationSchema,
  BadgeFocusRecommendationSchema,
  AiRecommendationsResponseSchema,
  GetAiRecommendationsInputSchema,
  RecommendationFeedbackSchema,
  AiCoachContextSchema,
  type RecommendationType,
  type ModuleRecommendation,
  type PeerMatchRecommendation,
  type BadgeFocusRecommendation,
  type AiRecommendationsResponse,
  type GetAiRecommendationsInput,
  type RecommendationFeedback,
  type AiCoachContext,
} from "./ai-recommendation.schema";
