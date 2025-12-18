/**
 * Barrel Export: Assessment Components
 * Only export components that currently exist
 */

export type { DomainAffinityChartProps } from "./domain-affinity-chart";
export { default as DomainAffinityChart } from "./domain-affinity-chart";
export type { LowConfidenceWarningProps } from "./low-confidence-warning";
// Results Enhancements (US5)
export {
	default as LowConfidenceWarning,
	getLowConfidenceStrengths,
	LOW_CONFIDENCE_THRESHOLD,
} from "./low-confidence-warning";
export type { PhaseTransitionProps } from "./phase-transition";
export { default as PhaseTransition } from "./phase-transition";
export type { ProgressIndicatorProps } from "./progress-indicator";
// Progress & Visualization (US3)
export { default as ProgressIndicator } from "./progress-indicator";
export type { QuestionCardProps } from "./question-card";
export { default as QuestionCard } from "./question-card";
export type { ResultsSummaryProps } from "./results-summary";
// Results
export { default as ResultsSummary } from "./results-summary";
export type { StrengthConfidenceCardProps } from "./strength-confidence-card";
export { default as StrengthConfidenceCard } from "./strength-confidence-card";
export type { StrengthDescription } from "./strength-descriptions";
export {
	getStrengthDescription,
	getStrengthsByDomain,
	STRENGTH_DESCRIPTIONS,
} from "./strength-descriptions";
export type { WelcomeScreenProps } from "./welcome-screen";
// Welcome & Flow
export { default as WelcomeScreen } from "./welcome-screen";
export type { XpRewardPreviewProps } from "./xp-reward-preview";
// Gamification (Feature 005)
export { default as XpRewardPreview } from "./xp-reward-preview";
