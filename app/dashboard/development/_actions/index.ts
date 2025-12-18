/**
 * Development Feature Actions - Barrel Export
 *
 * Exports all server actions for the development feature.
 */

// Module actions
export {
	getModules,
	getModulesByStrength,
	type GetModulesResult,
} from "./get-modules";
export { startModule } from "./start-module";
export { getModuleDetail, getNextModule } from "./get-module-detail";

// User Strengths
export {
	getUserStrengthsForDevelopment,
	type DevelopmentStrength,
	type UserStrengthsResult,
} from "./get-user-strengths";

// Challenge actions
export { completeChallenge } from "./complete-challenge";
export {
	checkModuleCompletion,
	getModulesCompletionStats,
} from "./check-module-completion";

// Progress actions
export { getUserProgress, getRecentActivity } from "./get-user-progress";
export { checkLevelUpAction, getCurrentLevel } from "./check-level-up";

// Badge actions
export { getBadges, getRecentBadges } from "./get-badges";
export { checkBadgeUnlock, getNextBadgesToUnlock } from "./check-badge-unlock";

// Professional Profile actions
export { getProfessionalProfile } from "./get-professional-profile";
export { saveProfessionalProfile } from "./save-professional-profile";

// Module Generation actions
export { generatePersonalizedModule } from "./generate-personalized";
export { checkCanGenerateModule } from "./check-can-generate";

// AI Recommendations
export {
	getAIRecommendations,
	refreshAIRecommendations,
	getNextAction,
} from "./get-ai-recommendations";

// Peer learning & Collaborative challenges
export {
	getPeerLearners,
	getPeerMatchesForModule,
	getPeerLearnerCount,
	type PeerLearner,
} from "./get-peer-learners";
export {
	initiateCollaborativeChallenge,
	confirmCollaborativeChallenge,
	getCollaborativeChallengeStatus,
	getPendingCollaborativeChallenges,
	type CollaborativeInitResult,
} from "./complete-collaborative";
