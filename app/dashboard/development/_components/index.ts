/**
 * Development Feature Components - Barrel Export
 *
 * Exports all shared components for the development feature.
 */

// AI Coach
export { AIRecommendations } from "./ai-recommendations";
// Badges
export { BadgeShowcase } from "./badge-showcase";
export { BadgeUnlockModal } from "./badge-unlock-modal";
export { ChallengeCard } from "./challenge-card";
// Challenges
export { ChallengeList } from "./challenge-list";
export {
	CollaborativeChallengeList,
	CollaborativeChallengeSkeleton,
	CollaborativeChallengeStatus,
} from "./collaborative-challenge";
// Module Generation
export { GenerateModuleButton } from "./generate-module-button";
export { GenerateModuleSection } from "./generate-module-section";
export { InteractiveChallengeList } from "./interactive-challenge-list";
// LevelBadge moved to @/components/gamification for reusability
export { LevelUpNotification } from "./level-up-notification";
// Modules
export { ModuleCard } from "./module-card";
export { ModuleList } from "./module-list";
export { ModuleTypeBadge } from "./module-type-badge";
// Peer Learning & Collaboration
export { PeerLearners, PeerLearnersSkeleton } from "./peer-learners";
export { PendingModulesTooltip } from "./pending-modules-tooltip";
export { ProfessionalProfileCheck } from "./professional-profile-check";
export { ProfessionalProfileForm } from "./professional-profile-form";
export { ProfileOnboardingModal } from "./profile-onboarding-modal";
export { ProgressDashboard } from "./progress-dashboard";
// Stats
export { StatsOverview } from "./stats-overview";
// Strength Gate (access control)
export { StrengthGate } from "./strength-gate";
export { StrengthsRequiredMessage } from "./strengths-required-message";
// Progress & Gamification
export { XpBar } from "./xp-bar";
export { XpGainToast } from "./xp-gain-toast";
