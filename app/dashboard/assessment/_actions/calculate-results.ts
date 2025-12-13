'use server';

/**
 * Server Action: Calculate Results
 * Generates final assessment results with top 5 strengths and confidence scores
 */

import { prisma } from '@/lib/prisma.db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { AssessmentResults } from '@/lib/types/assessment.types';
import {
  calculateFinalResults,
  type AnswerData,
  type QuestionData,
  type DomainInfo,
  type StrengthInfo,
} from '@/lib/utils/assessment/score-calculator';

export interface CalculateResultsResult {
  success: boolean;
  results?: AssessmentResults;
  error?: string;
}

/**
 * Calculate final assessment results for a completed session
 */
export async function calculateResults(
  sessionId: string
): Promise<CalculateResultsResult> {
  try {
    // Verify user authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user.id;

    // Get assessment session with answers (select only needed fields)
    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        phase: true,
        results: true,
        answers: {
          select: {
            id: true,
            questionId: true,
            answer: true,
            confidence: true,
          },
        },
      },
    });

    if (!assessmentSession) {
      return { success: false, error: 'Session not found' };
    }

    if (assessmentSession.userId !== userId) {
      return { success: false, error: 'Access denied' };
    }

    // Check if results already exist
    if (assessmentSession.results) {
      const existingResults = JSON.parse(
        assessmentSession.results
      ) as AssessmentResults;
      return { success: true, results: existingResults };
    }

    // Verify assessment is complete (Phase 3 finished)
    if (assessmentSession.phase < 3) {
      return {
        success: false,
        error: 'Assessment not yet complete',
      };
    }

    // Get all reference data (select only needed fields)
    const [ domains, strengths, allQuestions ] = await Promise.all([
      prisma.domain.findMany({ select: { id: true, name: true } }),
      prisma.strength.findMany({
        select: { id: true, name: true, domainId: true },
      }),
      prisma.assessmentQuestion.findMany({
        select: {
          id: true,
          phase: true,
          type: true,
          domainId: true,
          strengthId: true,
          weight: true,
          options: true,
        },
      }),
    ]);

    // Transform data for scoring functions
    const domainInfos: DomainInfo[] = domains.map((d) => ({
      id: d.id,
      name: d.name,
    }));

    const strengthInfos: StrengthInfo[] = strengths.map((s) => ({
      id: s.id,
      name: s.name,
      domainId: s.domainId,
    }));

    const questionData: QuestionData[] = allQuestions.map((q) => ({
      id: q.id,
      phase: q.phase,
      type: q.type as 'SCALE' | 'CHOICE' | 'RANKING',
      weight: q.weight,
      domainId: q.domainId,
      strengthId: q.strengthId,
      options: q.options ? JSON.parse(q.options) : undefined,
    }));

    const answerData: AnswerData[] = assessmentSession.answers.map((a) => ({
      questionId: a.questionId,
      answer: JSON.parse(a.answer),
    }));

    // Calculate final results
    const results = calculateFinalResults(
      answerData,
      questionData,
      domainInfos,
      strengthInfos
    );

    // Save results to session
    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        results: JSON.stringify(results),
        status: 'COMPLETED',
        completedAt: new Date(),
        lastActivityAt: new Date(),
      },
    });

    return { success: true, results };
  } catch (error) {
    console.error('[CalculateResults] Error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to calculate results',
    };
  }
}

/**
 * Get results for a completed session (without recalculating)
 */
export async function getSessionResults(
  sessionId: string
): Promise<CalculateResultsResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      select: {
        userId: true,
        results: true,
        status: true,
      },
    });

    if (!assessmentSession) {
      return { success: false, error: 'Session not found' };
    }

    if (assessmentSession.userId !== session.user.id) {
      return { success: false, error: 'Access denied' };
    }

    if (!assessmentSession.results) {
      if (assessmentSession.status !== 'COMPLETED') {
        return { success: false, error: 'Assessment not yet complete' };
      }
      // Results not calculated yet, calculate now
      return calculateResults(sessionId);
    }

    const results = JSON.parse(assessmentSession.results) as AssessmentResults;
    return { success: true, results };
  } catch (error) {
    console.error('[GetSessionResults] Error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get results',
    };
  }
}
