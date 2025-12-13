/**
 * Adaptive Logic Utility
 * Implements Phase 2 question selection based on Phase 1 domain scores
 * per research.md algorithm
 */

import type { DomainScore } from '@/lib/types/assessment.types';

export interface QuestionData {
  id: string;
  phase: number;
  type: 'SCALE' | 'CHOICE' | 'RANKING';
  weight: number;
  domainId: string;
  strengthId: string | null;
  order: number;
}

export interface DomainInfo {
  id: string;
  name: string;
}

export interface StrengthInfo {
  id: string;
  name: string;
  domainId: string;
}

/**
 * Threshold for domain selection (percentage)
 */
const DOMAIN_SELECTION_THRESHOLD = 60;

/**
 * Maximum domains to consider for Phase 2
 */
const MAX_DOMAINS = 3;

/**
 * Target number of Phase 2 questions
 */
const PHASE_2_QUESTION_COUNT = 30;

/**
 * Get top domains based on Phase 1 scores
 * @param domainScores - Map of domain scores from Phase 1
 * @param threshold - Minimum score to be considered (default 60)
 * @param maxDomains - Maximum number of domains to return (default 3)
 */
export function getTopDomains(
  domainScores: Record<string, DomainScore>,
  threshold = DOMAIN_SELECTION_THRESHOLD,
  maxDomains = MAX_DOMAINS
): DomainScore[] {
  const scores = Object.values(domainScores);

  // Sort by score descending
  const sorted = [ ...scores ].sort((a, b) => b.score - a.score);

  // Handle edge case: all domains equal
  const allEqual = sorted.every((s) => s.score === sorted[ 0 ].score);
  if (allEqual) {
    // Return all domains for broader coverage
    return sorted.slice(0, maxDomains);
  }

  // Filter by threshold, but ensure at least 2 domains
  const aboveThreshold = sorted.filter((s) => s.score >= threshold);

  if (aboveThreshold.length >= 2) {
    return aboveThreshold.slice(0, maxDomains);
  }

  // If fewer than 2 above threshold, take top 2-3
  return sorted.slice(0, Math.max(2, Math.min(maxDomains, sorted.length)));
}

/**
 * Get strengths belonging to specified domains
 */
export function getStrengthsByDomains(
  domains: DomainScore[],
  allStrengths: StrengthInfo[]
): StrengthInfo[] {
  const domainIds = new Set(domains.map((d) => d.domainId));
  return allStrengths.filter((s) => domainIds.has(s.domainId));
}

/**
 * Select top N questions by weight for a specific domain
 */
function selectTopQuestions(
  questions: QuestionData[],
  count: number
): QuestionData[] {
  // Sort by weight descending, then by order for consistency
  const sorted = [ ...questions ].sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.order - b.order;
  });

  return sorted.slice(0, count);
}

/**
 * Select Phase 2 questions based on Phase 1 domain scores
 * Uses stratified sampling to ensure balanced coverage across top domains
 */
export function selectPhase2Questions(
  domainScores: Record<string, DomainScore>,
  questionBank: QuestionData[],
  allStrengths: StrengthInfo[],
  targetCount = PHASE_2_QUESTION_COUNT
): QuestionData[] {
  console.log('[AdaptiveLogic] Starting Phase 2 question selection');
  console.log('[AdaptiveLogic] Domain scores:', JSON.stringify(domainScores, null, 2));

  // Get top domains
  const topDomains = getTopDomains(domainScores);
  console.log('[AdaptiveLogic] Top domains selected:', topDomains.map(d => `${d.domainName}: ${d.score.toFixed(1)}%`).join(', '));

  // Handle edge cases
  const edgeCaseResult = handleEdgeCases(domainScores, topDomains, questionBank);
  if (edgeCaseResult) {
    console.log('[AdaptiveLogic] Edge case detected, returning specialized question set');
    return edgeCaseResult;
  }

  // Get relevant strengths
  const relevantStrengths = getStrengthsByDomains(topDomains, allStrengths);
  const relevantStrengthIds = new Set(relevantStrengths.map((s) => s.id));
  console.log('[AdaptiveLogic] Relevant strengths count:', relevantStrengths.length);

  // Filter Phase 2 questions for relevant strengths
  const candidateQuestions = questionBank.filter(
    (q) =>
      q.phase === 2 &&
      q.strengthId &&
      relevantStrengthIds.has(q.strengthId)
  );
  console.log('[AdaptiveLogic] Candidate questions for Phase 2:', candidateQuestions.length);

  // If not enough questions, use all Phase 2 questions
  if (candidateQuestions.length < targetCount) {
    console.log('[AdaptiveLogic] Not enough candidate questions, using all Phase 2 questions');
    const allPhase2 = questionBank.filter((q) => q.phase === 2);
    return selectTopQuestions(allPhase2, targetCount);
  }

  // Stratified sampling: distribute questions across top domains
  const questionsPerDomain = Math.floor(targetCount / topDomains.length);
  const remainder = targetCount % topDomains.length;
  console.log('[AdaptiveLogic] Stratified sampling:', questionsPerDomain, 'per domain, remainder:', remainder);

  const selectedQuestions: QuestionData[] = [];

  topDomains.forEach((domain, index) => {
    const domainQuestions = candidateQuestions.filter(
      (q) => q.domainId === domain.domainId
    );

    // Add extra question for first domains to use remainder
    const count = questionsPerDomain + (index < remainder ? 1 : 0);

    const selected = selectTopQuestions(domainQuestions, count);
    selectedQuestions.push(...selected);
    console.log(`[AdaptiveLogic] Domain ${domain.domainName}: selected ${selected.length}/${count} questions`);
  });

  // If we still don't have enough, fill from remaining candidates
  if (selectedQuestions.length < targetCount) {
    const selectedIds = new Set(selectedQuestions.map((q) => q.id));
    const remaining = candidateQuestions
      .filter((q) => !selectedIds.has(q.id))
      .sort((a, b) => b.weight - a.weight);

    const fillCount = targetCount - selectedQuestions.length;
    selectedQuestions.push(...remaining.slice(0, fillCount));
    console.log('[AdaptiveLogic] Filled', fillCount, 'additional questions from remaining candidates');
  }

  // Sort by order for consistent presentation
  const finalQuestions = selectedQuestions.sort((a, b) => a.order - b.order);
  console.log('[AdaptiveLogic] Final Phase 2 questions selected:', finalQuestions.length);

  return finalQuestions;
}

/**
 * Handle edge cases in domain scoring
 * Returns a question set if edge case is detected, null otherwise
 */
export function handleEdgeCases(
  domainScores: Record<string, DomainScore>,
  topDomains: DomainScore[],
  questionBank: QuestionData[]
): QuestionData[] | null {
  const scores = Object.values(domainScores);

  // Edge Case 1: All domains exactly equal
  const allEqual = scores.every((s) => s.score === scores[ 0 ]?.score);
  if (allEqual && scores.length > 0) {
    console.log('[AdaptiveLogic] All domains equal - presenting broader question set');
    // Return all Phase 2 questions sorted by weight
    const allPhase2 = questionBank
      .filter((q) => q.phase === 2)
      .sort((a, b) => b.weight - a.weight);
    return allPhase2.slice(0, PHASE_2_QUESTION_COUNT);
  }

  // Edge Case 2: One heavily dominant domain (>80% difference from second)
  if (topDomains.length >= 2) {
    const dominantScore = topDomains[ 0 ].score;
    const secondScore = topDomains[ 1 ].score;
    const gap = dominantScore - secondScore;

    if (gap > 30) {
      console.log(
        `[AdaptiveLogic] Dominant domain detected (${topDomains[ 0 ].domainName}: ${dominantScore}%) - mixing 70/30`
      );

      const dominantQuestions = questionBank.filter(
        (q) => q.phase === 2 && q.domainId === topDomains[ 0 ].domainId
      );
      const runnerUpQuestions = questionBank.filter(
        (q) =>
          q.phase === 2 &&
          topDomains.slice(1).some((d) => d.domainId === q.domainId)
      );

      // 70% from dominant, 30% from runners-up
      const dominantCount = Math.floor(PHASE_2_QUESTION_COUNT * 0.7);
      const runnerUpCount = PHASE_2_QUESTION_COUNT - dominantCount;

      const selected = [
        ...selectTopQuestions(dominantQuestions, dominantCount),
        ...selectTopQuestions(runnerUpQuestions, runnerUpCount),
      ];

      return selected.sort((a, b) => a.order - b.order);
    }
  }

  // Edge Case 3: Tie-breaking for close scores
  if (topDomains.length >= 2) {
    const closeScores = topDomains.filter(
      (d) => Math.abs(d.score - topDomains[ 0 ].score) <= 5
    );

    if (closeScores.length > MAX_DOMAINS) {
      console.log(
        `[AdaptiveLogic] Multiple close scores detected - using weight-based selection`
      );
      // Already handled by getTopDomains, just log for debugging
    }
  }

  return null;
}

/**
 * Detect neutral response bias pattern
 * Returns true if user is selecting middle option too frequently
 */
export function detectNeutralBias(
  answers: Array<{ answer: number | string | string[] }>,
  threshold = 0.7
): boolean {
  const scaleAnswers = answers.filter(
    (a) => typeof a.answer === 'number'
  ) as Array<{ answer: number }>;

  if (scaleAnswers.length < 10) return false;

  const neutralCount = scaleAnswers.filter((a) => a.answer === 3).length;
  const neutralRatio = neutralCount / scaleAnswers.length;

  return neutralRatio > threshold;
}

/**
 * Generate selection summary for logging/debugging
 */
export function generateSelectionSummary(
  domainScores: Record<string, DomainScore>,
  selectedQuestions: QuestionData[]
): {
  topDomains: DomainScore[];
  questionsByDomain: Record<string, number>;
  totalSelected: number;
} {
  const topDomains = getTopDomains(domainScores);

  const questionsByDomain: Record<string, number> = {};
  for (const domain of topDomains) {
    questionsByDomain[ domain.domainName ] = selectedQuestions.filter(
      (q) => q.domainId === domain.domainId
    ).length;
  }

  return {
    topDomains,
    questionsByDomain,
    totalSelected: selectedQuestions.length,
  };
}
