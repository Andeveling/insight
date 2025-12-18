// Strength types

// AI Coach types
export type {
	AiModuleRecommendationSchema,
	AiPeerMatchSchema,
	AiRecommendationResponse,
	AvailableModule,
	CachedRecommendation,
	ChallengeRecommendation,
	CollaborativeChallengeContext,
	ModuleRecommendation,
	ModuleRecommendationPrompt,
	PeerMatchPrompt,
	PeerMatchRecommendation,
	RecentActivity,
	RecommendationCacheConfig,
	RecommendationType,
	TeamMemberContext,
	UserRecommendationContext,
	UserStrength as AiUserStrength,
} from "./ai-coach.types";
export { DEFAULT_RECOMMENDATION_CACHE_CONFIG } from "./ai-coach.types";
// Assessment types
export type {
	AnswerValue,
	AssessmentProgress,
	AssessmentQuestion,
	AssessmentResults,
	AssessmentSession,
	CompletePhaseInput,
	DomainAffinity,
	PhaseTransitionResult,
	QuestionType,
	RankedStrength,
	SaveAnswerInput,
	ScaleRange,
	SessionStatus,
	UserAssessmentAnswer,
} from "./assessment.types";
// Development module types
export type {
	ChallengeCompletionResult,
	ChallengeData,
	ChallengeType,
	ChallengeWithProgress,
	CollaborativeChallengeData,
	CollaborativeChallengeStatus,
	DevelopmentModuleData,
	DevelopmentModuleWithStats,
	ModuleDetail,
	ModuleFilters,
	ModuleLevel,
	ModuleProgressStatus,
	ModuleSortOption,
	ModulesByDomain,
	ModulesByStrength,
	UserChallengeProgressData,
	UserModuleProgressData,
} from "./development.types";
// Gamification types
export type {
	ActivitySummary,
	BadgeCriteriaType,
	BadgeData,
	BadgeProgress,
	BadgeTier,
	BadgeUnlockCriteria,
	GamificationNotification,
	GamificationStats,
	LeaderboardEntry,
	LevelInfo,
	LevelUpEvent,
	StreakInfo,
	UserBadgeData,
	UserGamificationData,
	XpGainEvent,
	XpUpdateResult,
} from "./gamification.types";
export type {
	CachedMatchScore,
	CultureFitResult,
	DomainBalanceResult,
	DuplicateStrength,
	MatchScoreFactorResults,
	MatchScoreInput,
	MatchScoreMetadata,
	MatchScoreResult,
	MatchScoreWeights,
	Recommendation,
	RecommendedAction,
	RedundancyPenaltyResult,
	ScoreRange,
	ScoreRangeConfig,
	StrengthCoverageResult,
	SuggestedMember,
	TeamContext,
	TeamSizeResult,
} from "./match-score.types";

// Match Score types
export {
	DEFAULT_MATCH_SCORE_WEIGHTS,
	getScoreRange,
	SCORE_RANGES,
} from "./match-score.types";
export type {
	DomainWeights,
	ProjectType,
	ProjectTypeOption,
	ProjectTypeProfile,
} from "./project-type.types";

// Project Type types
export {
	getProjectTypeName,
	getProjectTypeProfile,
	isValidProjectType,
	PROJECT_TYPE_ICONS,
	PROJECT_TYPE_SEED_DATA,
	PROJECT_TYPES,
} from "./project-type.types";
export type {
	DomainDistribution,
	DomainType,
	StrengthWithDomain,
	TeamAnalytics,
	TeamMemberWithStrengths,
	UserStrengthRanked,
} from "./strength.types";
export type {
	ActionError,
	ActionResponse,
	ActionSuccess,
	ArchiveSubTeamInput,
	CalculateMatchScoreInput,
	CreateSubTeamInput,
	GenerateReportInput,
	GenerateReportResult,
	MatchScoreAnalysis,
	MatchScoreFactor,
	MemberChange,
	PaginatedResponse,
	PaginationParams,
	StrengthGap,
	SubTeam,
	SubTeamDetail,
	SubTeamFilters,
	SubTeamListItem,
	SubTeamMember,
	SubTeamSortOption,
	UpdateSubTeamInput,
	WhatIfSimulation,
} from "./subteam.types";
// SubTeam types
export {
	archiveSubTeamSchema,
	calculateMatchScoreSchema,
	createSubTeamSchema,
	updateSubTeamSchema,
} from "./subteam.types";
export type { UserDnaData } from "./user-dna.types";
// User DNA types
export {
	UserDnaDimensionSchema,
	UserDnaSchema,
	UserDnaSynergySchema,
} from "./user-dna.types";
