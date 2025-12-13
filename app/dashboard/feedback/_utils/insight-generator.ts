/**
 * Insight Generator Utility
 *
 * Genera insights a partir del feedback de pares usando IA o lógica basada en reglas
 * Implementa los prompts y patrones definidos en research.md
 */

import { generateText } from 'ai';
import { getModel } from '@/lib/ai';
import type { AggregatedStrengthScore } from '../_services/strength-mapping.service';
import { logAIError, logAISuccess } from './error-logger';

/**
 * Input para generación de insights
 */
export interface InsightGenerationInput {
  userName: string;
  selfStrengths: string[]; // Top 5 fortalezas auto-evaluadas
  peerStrengths: AggregatedStrengthScore[]; // Scores agregados del feedback
  responseCount: number;
  userId?: string; // For error logging
}

/**
 * Insight generado
 */
export interface GeneratedInsight {
  type: 'agreement' | 'blind_spot_high' | 'blind_spot_low' | 'emerging';
  title: string;
  description: string;
  strengthKey: string;
  confidence: number; // 0-1
}

/**
 * Resultado completo de la generación de insights
 */
export interface InsightResult {
  summary: string;
  insights: GeneratedInsight[];
  generatedAt: Date;
  method: 'ai' | 'rule-based';
}

/**
 * Plantilla de prompt para generación de insights con IA
 */
export function buildInsightPrompt(input: InsightGenerationInput): string {
  const { userName, selfStrengths, peerStrengths, responseCount } = input;

  const topPeerStrengths = peerStrengths
    .slice(0, 5)
    .map((s) => `- ${s.strengthKey}: ${s.normalizedScore.toFixed(1)}% (${s.responseCount} observaciones)`)
    .join('\n');

  const selfList = selfStrengths.map((s) => `- ${s}`).join('\n');

  return `Eres un coach experto en desarrollo de fortalezas personales. Analiza el feedback 360° de ${userName} y genera insights accionables.

## Contexto
- ${responseCount} compañeros de equipo proporcionaron feedback
- Respuestas anónimas basadas en observaciones de comportamiento

## Fortalezas Auto-evaluadas (Top 5)
${selfList}

## Percepción de Pares (Basado en feedback)
${topPeerStrengths}

## Tu Tarea
Genera un análisis breve (máximo 3 párrafos) que:
1. Identifique ACUERDOS: Fortalezas que tanto ${userName} como sus pares reconocen
2. Identifique PUNTOS CIEGOS ALTOS: Fortalezas que los pares ven pero ${userName} no reconoce en sí mismo
3. Identifique PUNTOS CIEGOS BAJOS: Fortalezas que ${userName} cree tener pero los pares no observan

Usa un tono constructivo y orientado al crecimiento. Menciona fortalezas específicas por nombre.

Responde en español.`;
}

/**
 * Genera insights usando IA (Vercel AI SDK con OpenAI)
 * Si falla, retorna null para usar fallback basado en reglas
 */
export async function generateAIInsights(
  input: InsightGenerationInput
): Promise<InsightResult | null> {
  const startTime = Date.now();

  try {
    const prompt = buildInsightPrompt(input);
    const model = getModel('individual');

    const { text } = await generateText({
      model,
      prompt,
      maxOutputTokens: 500,
      temperature: 0.7,
    });

    if (!text || text.trim().length === 0) {
      logAIError(
        new Error('AI returned empty response'),
        {
          operation: 'generateInsights',
          userId: input.userId,
          inputSummary: {
            userName: input.userName,
            selfStrengthsCount: input.selfStrengths.length,
            peerStrengthsCount: input.peerStrengths.length,
            responseCount: input.responseCount,
          },
          promptLength: prompt.length,
        },
        'medium'
      );
      return null;
    }

    // Log success for monitoring
    logAISuccess({
      operation: 'generateInsights',
      userId: input.userId,
      durationMs: Date.now() - startTime,
    });

    // Generar insights estructurados usando las reglas (para mantener consistencia)
    const ruleBasedInsights = generateRuleBasedInsights(input);

    return {
      summary: text,
      insights: ruleBasedInsights.insights,
      generatedAt: new Date(),
      method: 'ai',
    };
  } catch (error) {
    logAIError(error, {
      operation: 'generateInsights',
      userId: input.userId,
      inputSummary: {
        userName: input.userName,
        selfStrengthsCount: input.selfStrengths.length,
        peerStrengthsCount: input.peerStrengths.length,
        responseCount: input.responseCount,
      },
      responseCount: input.responseCount,
    });
    return null;
  }
}

/**
 * Genera insights con IA si está disponible, o fallback basado en reglas
 */
export async function generateInsights(
  input: InsightGenerationInput
): Promise<InsightResult> {
  // Intentar con IA primero
  const aiResult = await generateAIInsights(input);
  if (aiResult) {
    return aiResult;
  }

  // Fallback a reglas
  return generateRuleBasedInsights(input);
}

/**
 * Genera insights usando lógica basada en reglas (fallback cuando IA no disponible)
 */
export function generateRuleBasedInsights(
  input: InsightGenerationInput
): InsightResult {
  const { selfStrengths, peerStrengths, responseCount } = input;

  const selfSet = new Set(selfStrengths.map((s) => s.toLowerCase()));
  const insights: GeneratedInsight[] = [];

  // Obtener top 5 fortalezas de pares
  const topPeerKeys = peerStrengths.slice(0, 5).map((s) => s.strengthKey.toLowerCase());

  // 1. ACUERDOS: Fortalezas en ambas listas
  for (const score of peerStrengths.slice(0, 5)) {
    const key = score.strengthKey.toLowerCase();
    if (selfSet.has(key)) {
      insights.push({
        type: 'agreement',
        title: 'Fortaleza Validada',
        description: `Tus compañeros también reconocen tu ${formatStrengthName(score.strengthKey)}. Esta es una fortaleza consistente que proyectas claramente.`,
        strengthKey: score.strengthKey,
        confidence: score.normalizedScore / 100,
      });
    }
  }

  // 2. PUNTOS CIEGOS ALTOS: Pares ven, self no reconoce
  for (const score of peerStrengths.slice(0, 5)) {
    const key = score.strengthKey.toLowerCase();
    if (!selfSet.has(key) && score.normalizedScore >= 40) {
      insights.push({
        type: 'blind_spot_high',
        title: 'Talento Oculto',
        description: `Tus compañeros observan ${formatStrengthName(score.strengthKey)} en ti, aunque no lo reconoces en tu perfil. Considera explorar más esta fortaleza.`,
        strengthKey: score.strengthKey,
        confidence: score.normalizedScore / 100,
      });
    }
  }

  // 3. PUNTOS CIEGOS BAJOS: Self reconoce, pares no ven
  for (const selfStrength of selfStrengths) {
    const key = selfStrength.toLowerCase();
    if (!topPeerKeys.includes(key)) {
      // Buscar si tiene algún score bajo en pares
      const peerScore = peerStrengths.find(
        (s) => s.strengthKey.toLowerCase() === key
      );
      if (!peerScore || peerScore.normalizedScore < 30) {
        insights.push({
          type: 'blind_spot_low',
          title: 'Oportunidad de Visibilidad',
          description: `Tu ${formatStrengthName(selfStrength)} puede no ser tan visible para otros. Busca oportunidades para demostrar esta fortaleza más activamente.`,
          strengthKey: selfStrength,
          confidence: 0.5,
        });
      }
    }
  }

  // Limitar a 5 insights más relevantes
  const sortedInsights = insights
    .sort((a, b) => {
      // Priorizar acuerdos, luego puntos ciegos altos, luego bajos
      const typeOrder = { agreement: 0, blind_spot_high: 1, emerging: 2, blind_spot_low: 3 };
      return typeOrder[ a.type ] - typeOrder[ b.type ];
    })
    .slice(0, 5);

  // Generar resumen basado en reglas
  const summary = generateRuleBasedSummary(sortedInsights, responseCount);

  return {
    summary,
    insights: sortedInsights,
    generatedAt: new Date(),
    method: 'rule-based',
  };
}

/**
 * Genera un resumen textual basado en los insights
 */
function generateRuleBasedSummary(
  insights: GeneratedInsight[],
  responseCount: number
): string {
  const agreements = insights.filter((i) => i.type === 'agreement');
  const blindSpotsHigh = insights.filter((i) => i.type === 'blind_spot_high');
  const blindSpotsLow = insights.filter((i) => i.type === 'blind_spot_low');

  const parts: string[] = [];

  parts.push(`Basado en ${responseCount} respuestas de tus compañeros:`);

  if (agreements.length > 0) {
    const names = agreements.map((i) => formatStrengthName(i.strengthKey)).join(', ');
    parts.push(`\n\n✅ **Fortalezas Validadas**: ${names}. Estas fortalezas son consistentes entre tu percepción y la de tus pares.`);
  }

  if (blindSpotsHigh.length > 0) {
    const names = blindSpotsHigh.map((i) => formatStrengthName(i.strengthKey)).join(', ');
    parts.push(`\n\n💡 **Talentos Ocultos**: Tus compañeros observan ${names} en ti. Considera incorporar estas fortalezas a tu perfil.`);
  }

  if (blindSpotsLow.length > 0) {
    const names = blindSpotsLow.map((i) => formatStrengthName(i.strengthKey)).join(', ');
    parts.push(`\n\n🎯 **Oportunidades de Visibilidad**: ${names} podrían ser más visibles para tu equipo. Busca momentos para demostrar estas fortalezas.`);
  }

  return parts.join('');
}

/**
 * Formatea el nombre de una fortaleza para mostrar
 */
function formatStrengthName(key: string): string {
  // Convertir kebab-case o lowercase a Title Case
  return key
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
