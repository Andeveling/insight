/**
 * Barrel Export: Assessment Hooks
 * Only export modules that currently exist
 */

export { useAssessmentSession } from './use-assessment-session';
export type { UseAssessmentSessionResult } from './use-assessment-session';

export { useQuestionNavigation } from './use-question-navigation';
export type {
  UseQuestionNavigationOptions,
  UseQuestionNavigationResult,
} from './use-question-navigation';

// Auto-save (US2)
export { useAutoSave } from './use-auto-save';

// Gamification (Feature 005)
export { useAssessmentXp } from './use-assessment-xp';
export type {
  XpAwardState,
  XpStatusState,
  UseAssessmentXpResult,
} from './use-assessment-xp';
