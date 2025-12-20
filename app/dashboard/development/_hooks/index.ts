/**
 * Development Feature - Hooks Barrel Export
 *
 * Custom hooks for gamification state management.
 */

export { useBadgeNotifications } from "./use-badge-notifications";
export {
	type GenerationStatus,
	useModuleGeneration,
} from "./use-module-generation";
export { useModuleProgress } from "./use-module-progress";
export {
	type UseNodeInteractionsReturn,
	useNodeInteractions,
} from "./use-node-interactions";
export { useProfileOnboarding } from "./use-profile-onboarding";
export {
	type UseRoadmapLayoutOptions,
	type UseRoadmapLayoutResult,
	useRoadmapLayout,
} from "./use-roadmap-layout";
export {
	type UseViewPreferenceReturn,
	type ViewPreference,
	useViewPreference,
} from "./use-view-preference";
export { useXpTracker } from "./use-xp-tracker";

