/**
 * Feedback Analysis Service
 *
 * Agrega respuestas de feedback y genera insights
 * Gestiona FeedbackSummary y StrengthAdjustment
 */

import { prisma } from '@/lib/prisma.db';
import {
  analyzePeerFeedback,
  compareWithSelfAssessment,
  generateStrengthAdjustments,
  type FeedbackAnalysisResult,
} from './strength-mapping.service';
import {
  generateInsights,
  type InsightResult,
  type InsightGenerationInput,
} from '../_utils/insight-generator';

/**
 * Resultado completo del análisis de feedback
 */
export interface FeedbackAnalysis {
  feedbackResult: FeedbackAnalysisResult;
  comparison: {
    blindSpots: string[];
    hiddenStrengths: string[];
    validated: string[];
  };
  insights: InsightResult;
  adjustmentSuggestions: Array<{
    strengthKey: string;
    suggestedDelta: number;
    reason: string;
  }>;
}

/**
 * Respuesta mínima requerida para generar insights
 */
const MIN_RESPONSES_FOR_INSIGHTS = 3;

/**
 * Obtiene el estado de insights para el dashboard
 * Incluye si hay suficientes respuestas y si hay insights nuevos
 */
export async function getInsightsStatus(userId: string): Promise<{
  hasEnoughResponses: boolean;
  completedCount: number;
  minRequired: number;
  hasNewInsights: boolean;
}> {
  const completedRequests = await prisma.feedbackRequest.count({
    where: {
      requesterId: userId,
      status: 'COMPLETED',
    },
  });

  const hasEnough = completedRequests >= MIN_RESPONSES_FOR_INSIGHTS;

  // Verificar si hay insights nuevos que no se han visto
  // (cuando hay suficientes respuestas y no hay FeedbackSummary aún, o hay ajustes pendientes)
  let hasNewInsights = false;
  if (hasEnough) {
    const [ existingSummary, pendingAdjustments ] = await Promise.all([
      prisma.feedbackSummary.findUnique({ where: { userId } }),
      prisma.strengthAdjustment.count({ where: { userId, status: 'PENDING' } }),
    ]);

    // Hay insights nuevos si nunca se han generado o hay ajustes pendientes
    hasNewInsights = !existingSummary || pendingAdjustments > 0;
  }

  return {
    hasEnoughResponses: hasEnough,
    completedCount: completedRequests,
    minRequired: MIN_RESPONSES_FOR_INSIGHTS,
    hasNewInsights,
  };
}

/**
 * Verifica si un usuario tiene suficientes respuestas para ver insights
 */
export async function hasEnoughResponses(userId: string): Promise<boolean> {
  const completedRequests = await prisma.feedbackRequest.count({
    where: {
      requesterId: userId,
      status: 'COMPLETED',
    },
  });

  return completedRequests >= MIN_RESPONSES_FOR_INSIGHTS;
}

/**
 * Genera un análisis completo del feedback para un usuario
 */
export async function generateFullAnalysis(
  userId: string
): Promise<FeedbackAnalysis | null> {
  // Verificar si hay suficientes respuestas
  const hasEnough = await hasEnoughResponses(userId);
  if (!hasEnough) {
    return null;
  }

  // Analizar feedback de pares
  const feedbackResult = await analyzePeerFeedback(userId);
  if (!feedbackResult) {
    return null;
  }

  // Comparar con auto-evaluación
  const comparison = await compareWithSelfAssessment(userId, feedbackResult);

  // Obtener información del usuario para insights
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  // Obtener fortalezas auto-evaluadas
  const userStrengths = await prisma.userStrength.findMany({
    where: { userId },
    include: { strength: true },
    orderBy: { rank: 'asc' },
  });

  const selfStrengths = userStrengths
    .slice(0, 5)
    .map((us) => us.strength.name.toLowerCase());

  // Generar insights
  const insightInput: InsightGenerationInput = {
    userName: user?.name || 'Usuario',
    selfStrengths,
    peerStrengths: feedbackResult.strengthScores,
    responseCount: feedbackResult.totalResponses,
  };

  // Usar IA cuando disponible, con fallback a reglas
  const insights = await generateInsights(insightInput);

  // Generar sugerencias de ajuste
  const adjustmentSuggestions = await generateStrengthAdjustments(
    userId,
    feedbackResult
  );

  return {
    feedbackResult,
    comparison,
    insights,
    adjustmentSuggestions,
  };
}

/**
 * Guarda o actualiza el resumen de feedback para un usuario
 */
export async function saveFeedbackSummary(
  userId: string,
  analysis: FeedbackAnalysis
): Promise<void> {
  const { feedbackResult, insights, adjustmentSuggestions } = analysis;

  // Serializar datos para almacenamiento
  const strengthAdjustmentsJson = JSON.stringify(
    feedbackResult.strengthScores.map((s) => ({
      strengthKey: s.strengthKey,
      normalizedScore: s.normalizedScore,
      responseCount: s.responseCount,
    }))
  );

  await prisma.feedbackSummary.upsert({
    where: { userId },
    update: {
      totalResponses: feedbackResult.totalResponses,
      strengthAdjustments: strengthAdjustmentsJson,
      insights: insights.summary,
      lastResponseAt: new Date(),
    },
    create: {
      userId,
      totalResponses: feedbackResult.totalResponses,
      strengthAdjustments: strengthAdjustmentsJson,
      insights: insights.summary,
    },
  });

  // Guardar sugerencias de ajuste individuales
  for (const suggestion of adjustmentSuggestions) {
    // Buscar el strength por nombre (case insensitive para SQLite usando LOWER)
    const strength = await prisma.strength.findFirst({
      where: {
        name: suggestion.strengthKey,
      },
    });

    if (strength) {
      // Buscar si ya existe un ajuste pendiente para esta fortaleza
      const existingAdjustment = await prisma.strengthAdjustment.findFirst({
        where: {
          userId,
          strengthId: strength.id,
          status: 'PENDING',
        },
      });

      if (existingAdjustment) {
        // Actualizar el existente
        await prisma.strengthAdjustment.update({
          where: { id: existingAdjustment.id },
          data: {
            suggestedDelta: suggestion.suggestedDelta,
            supportingData: JSON.stringify({ reason: suggestion.reason }),
          },
        });
      } else {
        // Crear uno nuevo
        await prisma.strengthAdjustment.create({
          data: {
            userId,
            strengthId: strength.id,
            suggestedDelta: suggestion.suggestedDelta,
            supportingData: JSON.stringify({ reason: suggestion.reason }),
            status: 'PENDING',
          },
        });
      }
    }
  }
}

/**
 * Obtiene el resumen de feedback guardado para un usuario
 */
export async function getFeedbackSummary(userId: string) {
  return prisma.feedbackSummary.findUnique({
    where: { userId },
  });
}

/**
 * Obtiene las sugerencias de ajuste pendientes para un usuario
 */
export async function getPendingAdjustments(userId: string) {
  return prisma.strengthAdjustment.findMany({
    where: {
      userId,
      status: 'PENDING',
    },
    include: {
      strength: true,
    },
  });
}

/**
 * Acepta una sugerencia de ajuste de fortaleza
 */
export async function acceptAdjustment(
  adjustmentId: string,
  userId: string
): Promise<boolean> {
  const adjustment = await prisma.strengthAdjustment.findUnique({
    where: { id: adjustmentId },
    include: { strength: true },
  });

  if (!adjustment || adjustment.userId !== userId) {
    return false;
  }

  // Marcar como aceptada
  await prisma.strengthAdjustment.update({
    where: { id: adjustmentId },
    data: { status: 'ACCEPTED' },
  });

  // Aquí se podría implementar la lógica para actualizar UserStrength
  // Por ahora solo marcamos como aceptado

  return true;
}

/**
 * Rechaza una sugerencia de ajuste de fortaleza
 */
export async function rejectAdjustment(
  adjustmentId: string,
  userId: string
): Promise<boolean> {
  const adjustment = await prisma.strengthAdjustment.findUnique({
    where: { id: adjustmentId },
  });

  if (!adjustment || adjustment.userId !== userId) {
    return false;
  }

  await prisma.strengthAdjustment.update({
    where: { id: adjustmentId },
    data: { status: 'REJECTED' },
  });

  return true;
}

/**
 * Representa un ciclo de feedback en el historial
 */
export interface FeedbackCycle {
  id: string;
  createdAt: Date;
  lastResponseAt: Date | null;
  totalResponses: number;
  insights: string | null;
  strengthScores: Array<{
    strengthKey: string;
    normalizedScore: number;
    responseCount: number;
  }>;
}

/**
 * Representa la tendencia de una fortaleza a lo largo del tiempo
 */
export interface StrengthTrend {
  strengthKey: string;
  strengthName: string;
  dataPoints: Array<{
    cycleId: string;
    date: Date;
    score: number;
  }>;
  variance: number;
  trend: 'stable' | 'improving' | 'declining' | 'variable';
}

/**
 * Obtiene el historial de ciclos de feedback para un usuario
 * Ordenado por fecha de última respuesta descendente
 */
export async function getFeedbackHistory(userId: string): Promise<FeedbackCycle[]> {
  // Obtener todos los FeedbackSummary del usuario
  // Por ahora solo hay uno por usuario, pero en el futuro podrían ser múltiples
  const summaries = await prisma.feedbackSummary.findMany({
    where: { userId },
    orderBy: { lastResponseAt: 'desc' },
  });

  return summaries.map((summary) => {
    let strengthScores: FeedbackCycle[ 'strengthScores' ] = [];
    try {
      strengthScores = JSON.parse(summary.strengthAdjustments || '[]');
    } catch {
      strengthScores = [];
    }

    return {
      id: summary.id,
      createdAt: summary.createdAt,
      lastResponseAt: summary.lastResponseAt,
      totalResponses: summary.totalResponses,
      insights: summary.insights,
      strengthScores,
    };
  });
}

/**
 * Obtiene los detalles de un ciclo de feedback específico
 */
export async function getFeedbackCycleDetails(
  cycleId: string,
  userId: string
): Promise<FeedbackCycle | null> {
  const summary = await prisma.feedbackSummary.findFirst({
    where: { id: cycleId, userId },
  });

  if (!summary) {
    return null;
  }

  let strengthScores: FeedbackCycle[ 'strengthScores' ] = [];
  try {
    strengthScores = JSON.parse(summary.strengthAdjustments || '[]');
  } catch {
    strengthScores = [];
  }

  return {
    id: summary.id,
    createdAt: summary.createdAt,
    lastResponseAt: summary.lastResponseAt,
    totalResponses: summary.totalResponses,
    insights: summary.insights,
    strengthScores,
  };
}

/**
 * Compara dos ciclos de feedback y calcula las diferencias en las fortalezas
 */
export async function compareFeedbackCycles(
  cycleId1: string,
  cycleId2: string,
  userId: string
): Promise<{
  cycle1: FeedbackCycle;
  cycle2: FeedbackCycle;
  changes: Array<{
    strengthKey: string;
    score1: number;
    score2: number;
    delta: number;
    trend: 'up' | 'down' | 'stable';
  }>;
} | null> {
  const [ cycle1, cycle2 ] = await Promise.all([
    getFeedbackCycleDetails(cycleId1, userId),
    getFeedbackCycleDetails(cycleId2, userId),
  ]);

  if (!cycle1 || !cycle2) {
    return null;
  }

  // Crear un mapa de scores del ciclo 2 para búsqueda rápida
  const cycle2Map = new Map(
    cycle2.strengthScores.map((s) => [ s.strengthKey, s.normalizedScore ])
  );

  // Calcular cambios
  const changes = cycle1.strengthScores.map((s1) => {
    const score2 = cycle2Map.get(s1.strengthKey) || 0;
    const delta = s1.normalizedScore - score2;

    let trend: 'up' | 'down' | 'stable';
    if (Math.abs(delta) < 0.05) {
      trend = 'stable';
    } else if (delta > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }

    return {
      strengthKey: s1.strengthKey,
      score1: s1.normalizedScore,
      score2,
      delta,
      trend,
    };
  });

  return { cycle1, cycle2, changes };
}

/**
 * Calcula las tendencias de fortalezas a lo largo del tiempo
 * Identifica fortalezas estables vs. en evolución
 */
export async function calculateStrengthTrends(
  userId: string
): Promise<StrengthTrend[]> {
  const history = await getFeedbackHistory(userId);

  if (history.length === 0) {
    return [];
  }

  // Agrupar scores por fortaleza
  const strengthMap = new Map<
    string,
    Array<{ cycleId: string; date: Date; score: number }>
  >();

  for (const cycle of history) {
    for (const score of cycle.strengthScores) {
      if (!strengthMap.has(score.strengthKey)) {
        strengthMap.set(score.strengthKey, []);
      }
      strengthMap.get(score.strengthKey)!.push({
        cycleId: cycle.id,
        date: cycle.lastResponseAt || cycle.createdAt,
        score: score.normalizedScore,
      });
    }
  }

  // Calcular tendencias
  const trends: StrengthTrend[] = [];

  for (const [ strengthKey, dataPoints ] of strengthMap.entries()) {
    // Ordenar por fecha
    dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calcular varianza
    const scores = dataPoints.map((d) => d.score);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;

    // Determinar tendencia basada en varianza y dirección
    let trend: StrengthTrend[ 'trend' ];
    if (dataPoints.length < 2) {
      trend = 'stable';
    } else if (variance > 0.1) {
      trend = 'variable';
    } else {
      const first = dataPoints[ 0 ].score;
      const last = dataPoints[ dataPoints.length - 1 ].score;
      const delta = last - first;

      if (Math.abs(delta) < 0.05) {
        trend = 'stable';
      } else if (delta > 0) {
        trend = 'improving';
      } else {
        trend = 'declining';
      }
    }

    // Obtener nombre de fortaleza
    const strength = await prisma.strength.findFirst({
      where: { name: strengthKey },
      select: { name: true },
    });

    trends.push({
      strengthKey,
      strengthName: strength?.name || strengthKey,
      dataPoints,
      variance,
      trend,
    });
  }

  // Ordenar por varianza (más estables primero)
  return trends.sort((a, b) => a.variance - b.variance);
}

/**
 * Obtiene los ajustes de fortalezas aceptados y rechazados históricos
 */
export async function getAdjustmentHistory(userId: string) {
  return prisma.strengthAdjustment.findMany({
    where: {
      userId,
      status: { not: 'PENDING' },
    },
    include: {
      strength: true,
    },
    orderBy: { processedAt: 'desc' },
  });
}
