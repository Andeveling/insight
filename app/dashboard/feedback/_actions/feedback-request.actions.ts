'use server';

/**
 * Feedback Request Server Actions
 *
 * Server-side actions for creating and managing peer feedback requests
 * Used by client components for form submissions
 */

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import {
  createFeedbackRequests,
  getAvailableTeammates,
  getFeedbackRequests,
  getFeedbackRequestById,
  type CreateFeedbackRequestResult,
} from '../_services/feedback-request.service';
import { sendFeedbackRequestNotifications } from '../_utils/feedback-notification';
import { checkRateLimit, recordRequest } from '../_utils/rate-limiter';

/**
 * Action result type for consistent error handling
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

/**
 * Creates feedback requests for selected teammates
 *
 * @param formData - Form data containing respondentIds[] and isAnonymous
 * @returns Action result with created request IDs
 */
export async function createFeedbackRequestAction(
  formData: FormData
): Promise<ActionResult<CreateFeedbackRequestResult>> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated', errorCode: 'UNAUTHORIZED' };
    }

    // Check rate limit before processing
    const rateLimit = checkRateLimit(session.user.id);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Has alcanzado el límite de solicitudes diarias. Podrás enviar más solicitudes en ${Math.ceil((rateLimit.retryAfterSeconds || 0) / 3600)} horas.`,
        errorCode: 'RATE_LIMITED',
      };
    }

    const respondentIds = formData.getAll('respondentIds') as string[];
    const isAnonymous = formData.get('isAnonymous') === 'true';

    if (!respondentIds || respondentIds.length === 0) {
      return { success: false, error: 'No respondents selected', errorCode: 'INVALID_ANSWERS' };
    }

    const result = await createFeedbackRequests({
      requesterId: session.user.id,
      respondentIds,
      isAnonymous,
    });

    if (result.success && result.createdRequests.length > 0) {
      // Record rate limit for this request
      recordRequest(session.user.id);

      // Send notifications to respondents (non-blocking)
      sendFeedbackRequestNotifications(session.user.id, result.createdRequests)
        .catch((error) => {
          console.error('Failed to send feedback request notifications:', error);
        });

      revalidatePath('/dashboard/feedback');
    }

    return {
      success: result.success,
      data: result,
      error: result.errors.length > 0
        ? result.errors.map((e) => e.reason).join(', ')
        : undefined,
    };
  } catch (error) {
    console.error('Create feedback request action error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Gets available teammates for feedback request
 *
 * @returns Action result with available teammates
 */
export async function getAvailableTeammatesAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof getAvailableTeammates>>>
> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const teammates = await getAvailableTeammates(session.user.id);

    return {
      success: true,
      data: teammates,
    };
  } catch (error) {
    console.error('Get available teammates action error:', error);
    return {
      success: false,
      error: 'Failed to load teammates',
    };
  }
}

/**
 * Gets sent feedback requests for current user
 *
 * @returns Action result with sent feedback requests
 */
export async function getSentFeedbackRequestsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof getFeedbackRequests>>>
> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const requests = await getFeedbackRequests(session.user.id, 'sent');

    return {
      success: true,
      data: requests,
    };
  } catch (error) {
    console.error('Get sent feedback requests action error:', error);
    return {
      success: false,
      error: 'Failed to load requests',
    };
  }
}

/**
 * Gets received feedback requests for current user (pending responses)
 *
 * @returns Action result with received feedback requests
 */
export async function getReceivedFeedbackRequestsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof getFeedbackRequests>>>
> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const requests = await getFeedbackRequests(session.user.id, 'received');

    return {
      success: true,
      data: requests,
    };
  } catch (error) {
    console.error('Get received feedback requests action error:', error);
    return {
      success: false,
      error: 'Failed to load requests',
    };
  }
}

/**
 * Gets a single feedback request by ID
 *
 * @param requestId - The request ID
 * @returns Action result with feedback request details
 */
export async function getFeedbackRequestByIdAction(
  requestId: string
): Promise<ActionResult<Awaited<ReturnType<typeof getFeedbackRequestById>>>> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    const request = await getFeedbackRequestById(requestId);

    if (!request) {
      return { success: false, error: 'Request not found' };
    }

    // Verify user has access to this request
    if (request.requesterId !== session.user.id && request.respondentId !== session.user.id) {
      return { success: false, error: 'Not authorized to view this request' };
    }

    return {
      success: true,
      data: request,
    };
  } catch (error) {
    console.error('Get feedback request by ID action error:', error);
    return {
      success: false,
      error: 'Failed to load request',
    };
  }
}
