'use server';

/**
 * Server Action: Get Active Session
 * Retrieves in-progress assessment session for the current user
 */

import { prisma } from '@/lib/prisma.db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type {
  AssessmentQuestion,
  AssessmentSession,
  UserAssessmentAnswer,
} from '@/lib/types/assessment.types';

export interface GetActiveSessionResult {
  success: boolean;
  session?: AssessmentSession;
  questions?: AssessmentQuestion[];
  answers?: UserAssessmentAnswer[];
  error?: string;
  hasActiveSession: boolean;
}

/**
 * Get the active (in-progress) assessment session for the current user
 * Returns session data, current phase questions, and existing answers
 */
export async function getActiveSession(): Promise<GetActiveSessionResult> {
  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        hasActiveSession: false,
        error: 'User not authenticated',
      };
    }

    const userId = session.user.id;

    // Find active session
    const activeSession = await prisma.assessmentSession.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
      include: {
        answers: {
          orderBy: { answeredAt: 'asc' },
        },
      },
    });

    if (!activeSession) {
      return {
        success: true,
        hasActiveSession: false,
      };
    }

    // Load questions for current phase
    const phaseQuestions = await prisma.assessmentQuestion.findMany({
      where: { phase: activeSession.phase },
      orderBy: { order: 'asc' },
      include: {
        domain: {
          select: {
            id: true,
            name: true,
          },
        },
        strength: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Transform session to client format
    const sessionData: AssessmentSession = {
      id: activeSession.id,
      userId: activeSession.userId,
      status: activeSession.status as 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED',
      phase: activeSession.phase as 1 | 2 | 3,
      currentStep: activeSession.currentStep,
      totalSteps: activeSession.totalSteps,
      domainScores: activeSession.domainScores
        ? JSON.parse(activeSession.domainScores)
        : undefined,
      strengthScores: activeSession.strengthScores
        ? JSON.parse(activeSession.strengthScores)
        : undefined,
      results: activeSession.results
        ? JSON.parse(activeSession.results)
        : undefined,
      startedAt: activeSession.startedAt,
      lastActivityAt: activeSession.lastActivityAt,
      completedAt: activeSession.completedAt ?? undefined,
    };

    // Transform questions
    const questions: AssessmentQuestion[] = phaseQuestions.map((q) => ({
      id: q.id,
      phase: q.phase as 1 | 2 | 3,
      order: q.order,
      text: q.text,
      type: q.type as 'SCALE' | 'CHOICE' | 'RANKING',
      options: q.options ? JSON.parse(q.options) : undefined,
      scaleRange: q.scaleRange ? JSON.parse(q.scaleRange) : undefined,
      domainId: q.domainId,
      strengthId: q.strengthId ?? undefined,
      weight: q.weight,
    }));

    // Transform answers
    const answers: UserAssessmentAnswer[] = activeSession.answers.map((a) => ({
      id: a.id,
      userId: a.userId,
      sessionId: a.sessionId,
      questionId: a.questionId,
      answer: JSON.parse(a.answer),
      confidence: a.confidence ?? undefined,
      answeredAt: a.answeredAt,
    }));

    return {
      success: true,
      hasActiveSession: true,
      session: sessionData,
      questions,
      answers,
    };
  } catch (error) {
    console.error('[GetActiveSession] Error retrieving session:', error);
    return {
      success: false,
      hasActiveSession: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve session',
    };
  }
}

/**
 * Get session progress percentage
 */
export async function getSessionProgress(sessionId: string): Promise<{
  currentStep: number;
  totalSteps: number;
  percentage: number;
  phase: number;
} | null> {
  try {
    const session = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      select: {
        currentStep: true,
        totalSteps: true,
        phase: true,
      },
    });

    if (!session) return null;

    return {
      currentStep: session.currentStep,
      totalSteps: session.totalSteps,
      percentage: Math.round((session.currentStep / session.totalSteps) * 100),
      phase: session.phase,
    };
  } catch {
    return null;
  }
}
