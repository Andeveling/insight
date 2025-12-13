'use server';

/**
 * Feedback Insights Server Actions
 *
 * Acciones del servidor para cargar insights y gestionar ajustes de fortalezas
 */

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import {
  generateFullAnalysis,
  hasEnoughResponses,
  saveFeedbackSummary,
  getPendingAdjustments,
  acceptAdjustment,
  rejectAdjustment,
} from '../_services/feedback-analysis.service';

/**
 * Resultado de acción
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Datos de insights de feedback
 */
export interface InsightsData {
  hasEnoughResponses: boolean;
  responseCount: number;
  minRequired: number;
  insights: {
    summary: string;
    insights: Array<{
      type: 'agreement' | 'blind_spot_high' | 'blind_spot_low' | 'emerging';
      strengthKey: string;
      title: string;
      description: string;
      confidence: number;
    }>;
  } | null;
  adjustments: Array<{
    id: string;
    strengthId: string;
    suggestedDelta: number;
    supportingData: string;
    status: string;
    strength?: { id: string; name: string; nameEs: string } | null;
  }>;
}

const MIN_RESPONSES_FOR_INSIGHTS = 3;

/**
 * Carga los insights de feedback para el usuario actual
 */
export async function loadInsightsAction(): Promise<ActionResult<InsightsData>> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'No autenticado' };
    }

    const userId = session.user.id;

    // Verificar si hay suficientes respuestas
    const hasEnough = await hasEnoughResponses(userId);

    // Contar respuestas completadas
    const { prisma } = await import('@/lib/prisma.db');
    const responseCount = await prisma.feedbackRequest.count({
      where: {
        requesterId: userId,
        status: 'COMPLETED',
      },
    });

    if (!hasEnough) {
      return {
        success: true,
        data: {
          hasEnoughResponses: false,
          responseCount,
          minRequired: MIN_RESPONSES_FOR_INSIGHTS,
          insights: null,
          adjustments: [],
        },
      };
    }

    // Generar análisis completo
    const analysis = await generateFullAnalysis(userId);

    if (analysis) {
      // Guardar resumen actualizado
      await saveFeedbackSummary(userId, analysis);
    }

    // Obtener datos guardados
    const pendingAdjustments = await getPendingAdjustments(userId);

    return {
      success: true,
      data: {
        hasEnoughResponses: true,
        responseCount,
        minRequired: MIN_RESPONSES_FOR_INSIGHTS,
        insights: analysis ? {
          summary: analysis.insights.summary,
          insights: analysis.insights.insights,
        } : null,
        adjustments: pendingAdjustments.map(adj => ({
          id: adj.id,
          strengthId: adj.strengthId,
          suggestedDelta: adj.suggestedDelta,
          supportingData: adj.supportingData,
          status: adj.status,
          strength: adj.strength ? {
            id: adj.strength.id,
            name: adj.strength.name,
            nameEs: adj.strength.nameEs,
          } : null,
        })),
      },
    };
  } catch (error) {
    console.error('Error al cargar insights:', error);
    return { success: false, error: 'Error al cargar los insights' };
  }
}

/**
 * Acepta una sugerencia de ajuste de fortaleza
 */
export async function acceptAdjustmentAction(
  adjustmentId: string
): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'No autenticado' };
    }

    const result = await acceptAdjustment(adjustmentId, session.user.id);

    if (result) {
      revalidatePath('/dashboard/feedback/insights');
      revalidatePath('/dashboard/profile');
      return { success: true };
    }

    return { success: false, error: 'No se pudo aceptar el ajuste' };
  } catch (error) {
    console.error('Error al aceptar ajuste:', error);
    return { success: false, error: 'Error al procesar el ajuste' };
  }
}

/**
 * Rechaza una sugerencia de ajuste de fortaleza
 */
export async function rejectAdjustmentAction(
  adjustmentId: string
): Promise<ActionResult> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'No autenticado' };
    }

    const result = await rejectAdjustment(adjustmentId, session.user.id);

    if (result) {
      revalidatePath('/dashboard/feedback/insights');
      return { success: true };
    }

    return { success: false, error: 'No se pudo rechazar el ajuste' };
  } catch (error) {
    console.error('Error al rechazar ajuste:', error);
    return { success: false, error: 'Error al procesar el ajuste' };
  }
}
