/**
 * Barrel Export: Assessment Hooks
 * Only export modules that currently exist
 */

export type { UseAssessmentSessionResult } from "./use-assessment-session";
export { useAssessmentSession } from "./use-assessment-session";
export type {
	UseAssessmentXpResult,
	XpAwardState,
	XpStatusState,
} from "./use-assessment-xp";
// Gamification (Feature 005)
export { useAssessmentXp } from "./use-assessment-xp";

// Auto-save (US2)
export { useAutoSave } from "./use-auto-save";
export type {
	UseQuestionNavigationOptions,
	UseQuestionNavigationResult,
} from "./use-question-navigation";
export { useQuestionNavigation } from "./use-question-navigation";
