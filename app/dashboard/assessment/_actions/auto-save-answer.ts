'use server';

import { prisma } from '@/lib/prisma.db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';
import { AnswerValueSchema } from '../_schemas/answer.schema';

const AutoSaveInputSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  value: AnswerValueSchema,
});

type AutoSaveInput = z.infer<typeof AutoSaveInputSchema>;

interface AutoSaveResult {
  success: boolean;
  error?: string;
  savedAt?: Date;
}

/**
 * Non-blocking server action for auto-saving answers
 * Updates lastActivityAt timestamp for session recovery
 * Optimized for frequent calls with minimal latency
 */
export async function autoSaveAnswerAction(input: AutoSaveInput): Promise<AutoSaveResult> {
  try {
    // Validate input
    const validatedInput = AutoSaveInputSchema.parse(input);

    // Get current user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const userId = session.user.id;

    // Verify session belongs to user and is in progress
    const assessmentSession = await prisma.assessmentSession.findFirst({
      where: {
        id: validatedInput.sessionId,
        userId,
        status: 'IN_PROGRESS',
      },
      select: { id: true },
    });

    if (!assessmentSession) {
      return { success: false, error: 'Session not found or not in progress' };
    }

    // Verify question exists
    const question = await prisma.assessmentQuestion.findUnique({
      where: { id: validatedInput.questionId },
      select: { id: true },
    });

    if (!question) {
      return { success: false, error: 'Question not found' };
    }

    const now = new Date();

    // Upsert answer and update session timestamp in parallel
    await Promise.all([
      // Upsert the answer
      prisma.userAssessmentAnswer.upsert({
        where: {
          sessionId_questionId: {
            sessionId: validatedInput.sessionId,
            questionId: validatedInput.questionId,
          },
        },
        update: {
          answer: JSON.stringify(validatedInput.value),
          updatedAt: now,
        },
        create: {
          userId,
          sessionId: validatedInput.sessionId,
          questionId: validatedInput.questionId,
          answer: JSON.stringify(validatedInput.value),
          answeredAt: now,
        },
      }),
      // Update session lastActivityAt
      prisma.assessmentSession.update({
        where: { id: validatedInput.sessionId },
        data: { lastActivityAt: now },
      }),
    ]);

    return { success: true, savedAt: now };
  } catch (error) {
    console.error('[AutoSave] Error:', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data' };
    }

    return { success: false, error: 'Failed to auto-save answer' };
  }
}
