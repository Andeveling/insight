/**
 * Development Feature Actions - Barrel Export
 *
 * Exports all server actions for the development feature.
 */

// Module actions
export { getModules, getModulesByStrength } from "./get-modules";
export { startModule } from "./start-module";
export { getModuleDetail, getNextModule } from "./get-module-detail";

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
