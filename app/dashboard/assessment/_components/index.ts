/**
 * Barrel Export: Assessment Components
 * Only export components that currently exist
 */

// Welcome & Flow
export { default as WelcomeScreen } from './welcome-screen';
export type { WelcomeScreenProps } from './welcome-screen';

export { default as QuestionCard } from './question-card';
export type { QuestionCardProps } from './question-card';

export { default as PhaseTransition } from './phase-transition';
export type { PhaseTransitionProps } from './phase-transition';

// Results
export { default as ResultsSummary } from './results-summary';
export type { ResultsSummaryProps } from './results-summary';

export { default as StrengthConfidenceCard } from './strength-confidence-card';
export type { StrengthConfidenceCardProps } from './strength-confidence-card';

// Save & Exit (US2)
export { SaveExitButton } from './save-exit-button';

// Results Enhancements (US5)
export { default as LowConfidenceWarning } from './low-confidence-warning';
export { getLowConfidenceStrengths, LOW_CONFIDENCE_THRESHOLD } from './low-confidence-warning';
export type { LowConfidenceWarningProps } from './low-confidence-warning';

// Progress & Visualization (US3)
export { default as ProgressIndicator } from './progress-indicator';
export type { ProgressIndicatorProps } from './progress-indicator';

export { default as DomainAffinityChart } from './domain-affinity-chart';
export type { DomainAffinityChartProps } from './domain-affinity-chart';

export {
  STRENGTH_DESCRIPTIONS,
  getStrengthDescription,
  getStrengthsByDomain,
} from './strength-descriptions';
export type { StrengthDescription } from './strength-descriptions';
