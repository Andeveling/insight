/**
 * Assessment Types
 * Type definitions for the Progressive Strength Discovery Quiz
 */

// Question Types
export type QuestionType = 'SCALE' | 'CHOICE' | 'RANKING';

export type AnswerValue = number | string | string[];

export interface ScaleRange {
  min: number;
  max: number;
  labels: string[];
}

export interface AssessmentQuestion {
  id: string;
  phase: 1 | 2 | 3;
  order: number;
  text: string;
  type: QuestionType;
  options?: string[]; // For choice/ranking questions
  scaleRange?: ScaleRange; // For scale questions
  domainId: string;
  strengthId?: string;
  weight: number;
}

// Session Types
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface AssessmentSession {
  id: string;
  userId: string;
  status: SessionStatus;
  phase: 1 | 2 | 3;
  currentStep: number;
  totalSteps: number;
  domainScores?: Record<string, number>; // domainId -> score
  strengthScores?: Record<string, number>; // strengthId -> score
  results?: AssessmentResults;
  startedAt: Date;
  lastActivityAt: Date;
  completedAt?: Date;
}

// Answer Types
export interface UserAssessmentAnswer {
  id: string;
  userId: string;
  sessionId: string;
  questionId: string;
  answer: AnswerValue;
  confidence?: number; // 1-5 self-reported confidence
  answeredAt: Date;
}

// Results Types
export interface DomainScore {
  domainId: string;
  domainName: string;
  score: number; // 0-100
  questionCount: number;
}

export interface StrengthScore {
  strengthId: string;
  strengthName: string;
  domainId: string;
  score: number; // 0-100
  questionCount: number;
}

export interface AssessmentResults {
  rankedStrengths: RankedStrength[];
  domainScores: DomainScore[];
  overallConfidence: number;
  completedAt: string;
  recommendations?: string[];
}

export interface RankedStrength {
  rank: number; // 1-5
  strengthId: string;
  strengthName: string;
  domainId: string;
  domainName: string;
  confidenceScore: number; // 0-100
  description?: string; // AI-generated or static
  developmentTips?: string[]; // AI-generated or static
}

// Phase Transition Types
export interface PhaseTransitionResult {
  completedPhase: 1 | 2 | 3;
  domainScores?: Record<string, number>;
  topDomains?: Array<{ id: string; name: string; score: number }>;
  preliminaryStrengths?: Array<{ id: string; name: string; score: number }>;
  nextPhase?: 2 | 3;
  nextPhasePreview?: string;
}

// Server Action Input Types
export interface SaveAnswerInput {
  sessionId: string;
  questionId: string;
  answer: AnswerValue;
  confidence?: number;
}

export interface CompletePhaseInput {
  sessionId: string;
  phase: 1 | 2 | 3;
}

// Domain Affinity Types
export interface DomainAffinity {
  domainId: string;
  domainName: string;
  score: number;
  percentage: number;
  color: string;
}

// Progress Types
export interface AssessmentProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  phase: 1 | 2 | 3;
  phaseLabel: string;
}
