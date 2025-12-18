/**
 * Development Feature Schemas - Barrel Export
 *
 * Exports all Zod validation schemas for the development feature.
 */

// AI Recommendation schemas
export {
	type AiCoachContext,
	AiCoachContextSchema,
	type AiRecommendationsResponse,
	AiRecommendationsResponseSchema,
	type BadgeFocusRecommendation,
	BadgeFocusRecommendationSchema,
	type GetAiRecommendationsInput,
	GetAiRecommendationsInputSchema,
	type ModuleRecommendation,
	ModuleRecommendationSchema,
	type PeerMatchRecommendation,
	PeerMatchRecommendationSchema,
	type RecommendationFeedback,
	RecommendationFeedbackSchema,
	type RecommendationType,
	RecommendationTypeSchema,
} from "./ai-recommendation.schema";
// Challenge schemas
export {
	type ChallengeCard,
	ChallengeCardSchema,
	type ChallengeCompletionResult,
	ChallengeCompletionResultSchema,
	type ChallengeData,
	ChallengeDataSchema,
	type ChallengeType,
	ChallengeTypeSchema,
	type CollaborativeChallengeInput,
	CollaborativeChallengeInputSchema,
	type CollaborativeChallengeStatus,
	CollaborativeChallengeStatusSchema,
	type CompleteChallengeInput,
	CompleteChallengeInputSchema,
} from "./challenge.schema";
// Module schemas
export {
	type GenerateModuleInput,
	GenerateModuleInputSchema,
	type GetModuleDetailInput,
	GetModuleDetailInputSchema,
	type ModuleCard,
	ModuleCardSchema,
	type ModuleData,
	ModuleDataSchema,
	type ModuleDetail,
	ModuleDetailSchema,
	type ModuleFilters,
	ModuleFiltersSchema,
	type ModuleLevel,
	ModuleLevelSchema,
	type ModuleType,
	ModuleTypeSchema,
	type StartModuleInput,
	StartModuleInputSchema,
} from "./module.schema";
// Professional profile schemas
export {
	type CareerGoal,
	CareerGoalSchema,
	type ProfessionalProfile,
	ProfessionalProfileSchema,
	type ProfileFormData,
	ProfileFormSchema,
	type ProfileOutput,
	ProfileOutputSchema,
	type RoleStatus,
	RoleStatusSchema,
	type SaveProfileInput,
	SaveProfileInputSchema,
} from "./professional-profile.schema";
// Progress schemas
export {
	type LevelInfo,
	LevelInfoSchema,
	type LevelUpEvent,
	LevelUpEventSchema,
	type ModuleProgressStatus,
	ModuleProgressStatusSchema,
	type ProgressDashboardData,
	ProgressDashboardDataSchema,
	type StreakInfo,
	StreakInfoSchema,
	type UserGamificationStats,
	UserGamificationStatsSchema,
	type UserModuleProgress,
	UserModuleProgressSchema,
	type XpUpdateResult,
	XpUpdateResultSchema,
} from "./progress.schema";
