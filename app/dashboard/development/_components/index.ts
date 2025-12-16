/**
 * Development Feature Components - Barrel Export
 *
 * Exports all shared components for the development feature.
 */

// Progress & Gamification
export { XpBar } from "./xp-bar";
// LevelBadge moved to @/components/gamification for reusability
export { LevelUpNotification } from "./level-up-notification";
export { XpGainToast } from "./xp-gain-toast";
export { ProgressDashboard } from "./progress-dashboard";

// Modules
export { ModuleCard } from "./module-card";
export { ModuleList } from "./module-list";
export { ModuleTypeBadge } from "./module-type-badge";

// Strength Gate (access control)
export { StrengthGate } from "./strength-gate";
export { StrengthsRequiredMessage } from "./strengths-required-message";

// Module Generation
export { GenerateModuleButton } from "./generate-module-button";
export { GenerateModuleSection } from "./generate-module-section";
export { PendingModulesTooltip } from "./pending-modules-tooltip";
export { ProfessionalProfileForm } from "./professional-profile-form";
export { ProfessionalProfileCheck } from "./professional-profile-check";
export { ProfileOnboardingModal } from "./profile-onboarding-modal";

// Challenges
export { ChallengeList } from "./challenge-list";
export { ChallengeCard } from "./challenge-card";
export { InteractiveChallengeList } from "./interactive-challenge-list";

// Badges
export { BadgeShowcase } from "./badge-showcase";
export { BadgeUnlockModal } from "./badge-unlock-modal";

// AI Coach
export { AIRecommendations } from "./ai-recommendations";

// Peer Learning & Collaboration
export { PeerLearners, PeerLearnersSkeleton } from "./peer-learners";
export {
  CollaborativeChallengeList,
  CollaborativeChallengeStatus,
  CollaborativeChallengeSkeleton,
} from "./collaborative-challenge";

// Stats
export { StatsOverview } from "./stats-overview";
