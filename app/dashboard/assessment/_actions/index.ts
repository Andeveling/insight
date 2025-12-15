/**
 * Barrel Export: Assessment Server Actions
 * Only export modules that currently exist
 */

// Session Management
export { createAssessmentSession } from './create-session';
export type { CreateSessionResult } from './create-session';

export { getActiveSession, getSessionProgress } from './get-active-session';
export type { GetActiveSessionResult } from './get-active-session';

// Question Navigation
export { getNextQuestion, getQuestionById } from './get-next-question';
export type { GetNextQuestionResult } from './get-next-question';

// Answer Processing
export { saveAnswer } from './save-answer';
export type { SaveAnswerInput, SaveAnswerResult } from './save-answer';

export { completePhase } from './complete-phase';
export type { CompletePhaseResult } from './complete-phase';

// Results
export { calculateResults, getSessionResults } from './calculate-results';
export type { CalculateResultsResult } from './calculate-results';

export {
  saveResultsToProfile,
  hasExistingProfile,
} from './save-results-to-profile';
export type { SaveResultsToProfileResult } from './save-results-to-profile';

// Auto-save & Session Management (US2)
export { autoSaveAnswerAction } from './auto-save-answer';

export { resumeSessionAction } from './resume-session';

export { abandonSessionAction, checkStaleSessions } from './abandon-session';

// Retake (US5)
export { createNewFromRetake } from './create-new-from-retake';

// Gamification (Feature 005)
export { awardAssessmentXp, getAssessmentXpStatus } from './award-assessment-xp';
export type { AwardAssessmentXpResult } from './award-assessment-xp';
