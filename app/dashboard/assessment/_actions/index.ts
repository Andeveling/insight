/**
 * Barrel Export: Assessment Server Actions
 * Only export modules that currently exist
 */

export { abandonSessionAction, checkStaleSessions } from "./abandon-session";
// Auto-save & Session Management (US2)
export { autoSaveAnswerAction } from "./auto-save-answer";
export type { AwardAssessmentXpResult } from "./award-assessment-xp";
// Gamification (Feature 005)
export {
	awardAssessmentXp,
	getAssessmentXpStatus,
} from "./award-assessment-xp";
export type { CalculateResultsResult } from "./calculate-results";
// Results
export { calculateResults, getSessionResults } from "./calculate-results";
export type { CompletePhaseResult } from "./complete-phase";
export { completePhase } from "./complete-phase";
// Retake (US5)
export { createNewFromRetake } from "./create-new-from-retake";
export type { CreateSessionResult } from "./create-session";
// Session Management
export { createAssessmentSession } from "./create-session";
export type { GetActiveSessionResult } from "./get-active-session";
export { getActiveSession, getSessionProgress } from "./get-active-session";
export type { GetNextQuestionResult } from "./get-next-question";
// Question Navigation
export { getNextQuestion, getQuestionById } from "./get-next-question";

export { resumeSessionAction } from "./resume-session";
export type { SaveAnswerInput, SaveAnswerResult } from "./save-answer";
// Answer Processing
export { saveAnswer } from "./save-answer";
export type { SaveResultsToProfileResult } from "./save-results-to-profile";
export {
	hasExistingProfile,
	saveResultsToProfile,
} from "./save-results-to-profile";
