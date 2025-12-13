'use server';

import { prisma } from '@/lib/prisma.db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface ResumeSessionResult {
  success: boolean;
  error?: string;
  session?: {
    id: string;
    currentPhase: number;
    currentQuestionIndex: number;
    startedAt: Date;
    lastActivityAt: Date;
    totalQuestions: number;
    answeredQuestions: number;
  };
  currentQuestion?: {
    id: string;
    text: string;
    type: string;
    phase: number;
    order: number;
    strengthId: string;
    options: unknown;
  };
}

/**
 * Server action to resume an in-progress assessment session
 * Loads session state and returns the current question to resume from
 */
export async function resumeSessionAction(sessionId: string): Promise<ResumeSessionResult> {
  try {
    // Get current user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user.id;

    // Load session with answers
    const assessmentSession = await prisma.assessmentSession.findFirst({
      where: {
        id: sessionId,
        userId,
        status: 'IN_PROGRESS',
      },
      include: {
        answers: {
          select: {
            questionId: true,
          },
        },
      },
    });

    if (!assessmentSession) {
      return { success: false, error: 'Session not found or not in progress' };
    }

    // Get questions for current phase
    const phaseQuestions = await prisma.assessmentQuestion.findMany({
      where: {
        phase: assessmentSession.phase,
      },
      orderBy: { order: 'asc' },
    });

    // Find answered question IDs in current phase
    const answeredIds = new Set(assessmentSession.answers.map((a) => a.questionId));

    // Find first unanswered question in current phase
    const currentQuestion = phaseQuestions.find((q) => !answeredIds.has(q.id));

    if (!currentQuestion) {
      // All questions in current phase are answered
      // This means phase should be completed - return last question
      const lastQuestion = phaseQuestions[ phaseQuestions.length - 1 ];

      return {
        success: true,
        session: {
          id: assessmentSession.id,
          currentPhase: assessmentSession.phase,
          currentQuestionIndex: phaseQuestions.length - 1,
          startedAt: assessmentSession.startedAt,
          lastActivityAt: assessmentSession.lastActivityAt,
          totalQuestions: phaseQuestions.length,
          answeredQuestions: phaseQuestions.length,
        },
        currentQuestion: lastQuestion
          ? {
            id: lastQuestion.id,
            text: lastQuestion.text,
            type: lastQuestion.type as string,
            phase: lastQuestion.phase,
            order: lastQuestion.order,
            strengthId: lastQuestion.strengthId ?? '',
            options: lastQuestion.options ? JSON.parse(lastQuestion.options) : null,
          }
          : undefined,
      };
    }

    // Calculate current question index
    const currentQuestionIndex = phaseQuestions.findIndex((q) => q.id === currentQuestion.id);
    const answeredInPhase = phaseQuestions.filter((q) => answeredIds.has(q.id)).length;

    // Update lastActivityAt
    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });

    return {
      success: true,
      session: {
        id: assessmentSession.id,
        currentPhase: assessmentSession.phase,
        currentQuestionIndex,
        startedAt: assessmentSession.startedAt,
        lastActivityAt: assessmentSession.lastActivityAt,
        totalQuestions: phaseQuestions.length,
        answeredQuestions: answeredInPhase,
      },
      currentQuestion: {
        id: currentQuestion.id,
        text: currentQuestion.text,
        type: currentQuestion.type as string,
        phase: currentQuestion.phase,
        order: currentQuestion.order,
        strengthId: currentQuestion.strengthId ?? '',
        options: currentQuestion.options ? JSON.parse(currentQuestion.options) : null,
      },
    };
  } catch (error) {
    console.error('[ResumeSession] Error:', error);
    return { success: false, error: 'Failed to resume session' };
  }
}
