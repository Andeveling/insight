/**
 * Development Feature Actions - Barrel Export
 *
 * Exports all server actions for the development feature.
 */

export { checkBadgeUnlock, getNextBadgesToUnlock } from "./check-badge-unlock";
export { checkCanGenerateModule } from "./check-can-generate";
export { checkLevelUpAction, getCurrentLevel } from "./check-level-up";
export {
	checkModuleCompletion,
	getModulesCompletionStats,
} from "./check-module-completion";

// Challenge actions
export { completeChallenge } from "./complete-challenge";
export {
	type CollaborativeInitResult,
	confirmCollaborativeChallenge,
	getCollaborativeChallengeStatus,
	getPendingCollaborativeChallenges,
	initiateCollaborativeChallenge,
} from "./complete-collaborative";
// Module Generation actions
export { generatePersonalizedModule } from "./generate-personalized";
// AI Recommendations
export {
	getAIRecommendations,
	getNextAction,
	refreshAIRecommendations,
} from "./get-ai-recommendations";

// Badge actions
export { getBadges, getRecentBadges } from "./get-badges";
export { getModuleDetail, getNextModule } from "./get-module-detail";
// Module actions
export {
	type GetModulesResult,
	getModules,
	getModulesByStrength,
} from "./get-modules";
// Peer learning & Collaborative challenges
export {
	getPeerLearnerCount,
	getPeerLearners,
	getPeerMatchesForModule,
	type PeerLearner,
} from "./get-peer-learners";
// Professional Profile actions
export { getProfessionalProfile } from "./get-professional-profile";
// Progress actions
export { getRecentActivity, getUserProgress } from "./get-user-progress";
// User Strengths
export {
	type DevelopmentStrength,
	getUserStrengthsForDevelopment,
	type UserStrengthsResult,
} from "./get-user-strengths";
export { saveProfessionalProfile } from "./save-professional-profile";
export { startModule } from "./start-module";
