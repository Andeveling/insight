/**
 * Gap Analyzer
 *
 * Identifies missing strengths and provides recommendations for team improvement.
 *
 * @module lib/utils/subteam/gap-analyzer
 */

import type { StrengthGap } from '@/lib/types';
import type { DomainDistribution } from '@/lib/types/match-score.types';
import type { MemberStrengthData } from './strength-coverage';
import type { DomainWeights } from '@/lib/types/project-type.types';

/**
 * Identify strength gaps in a team compared to ideal profile
 *
 * @param members - Array of member strength data
 * @param idealStrengths - Array of ideal strength names for the project type
 * @returns Array of identified gaps with priorities
 */
export function identifyStrengthGaps(
  members: MemberStrengthData[],
  idealStrengths: string[]
): StrengthGap[] {
  const gaps: StrengthGap[] = [];

  // Get all unique strengths from team members
  const teamStrengths = new Set<string>();
  members.forEach((member) => {
    member.strengths.forEach((strength) => {
      teamStrengths.add(strength.name);
    });
  });

  // Find missing ideal strengths
  idealStrengths.forEach((strengthName, index) => {
    if (!teamStrengths.has(strengthName)) {
      // First 2 ideal strengths are critical, next 2 recommended, rest optional
      let priority: 'critical' | 'recommended' | 'optional';
      if (index < 2) {
        priority = 'critical';
      } else if (index < 4) {
        priority = 'recommended';
      } else {
        priority = 'optional';
      }

      gaps.push({
        strengthName,
        strengthNameEs: strengthName, // TODO: Get Spanish name from database
        domainName: '', // TODO: Get domain from database
        domainNameEs: '',
        priority,
        reason: getGapReason(strengthName, priority),
        impact: getGapImpact(priority),
      });
    }
  });

  return gaps;
}

/**
 * Get reason message for a strength gap
 */
function getGapReason(strengthName: string, priority: 'critical' | 'recommended' | 'optional'): string {
  switch (priority) {
    case 'critical':
      return `${strengthName} es esencial para el éxito del proyecto. Su ausencia puede afectar significativamente los resultados.`;
    case 'recommended':
      return `${strengthName} mejoraría la capacidad del equipo para manejar desafíos específicos del proyecto.`;
    case 'optional':
      return `${strengthName} podría aportar valor adicional al equipo en situaciones específicas.`;
  }
}

/**
 * Get impact message for a strength gap
 */
function getGapImpact(priority: 'critical' | 'recommended' | 'optional'): string {
  switch (priority) {
    case 'critical':
      return 'Alto impacto: Riesgo significativo para el proyecto sin esta fortaleza.';
    case 'recommended':
      return 'Impacto medio: El equipo puede funcionar pero con limitaciones.';
    case 'optional':
      return 'Bajo impacto: Oportunidad de mejora sin afectar la viabilidad.';
  }
}

/**
 * Compare actual domain distribution against ideal
 *
 * @param actual - Actual normalized domain distribution
 * @param ideal - Ideal domain weights from project type
 * @returns Deviation for each domain
 */
export function compareDomainDistribution(
  actual: DomainDistribution,
  ideal: DomainWeights
): DomainDistribution {
  return {
    Thinking: Math.abs(actual.Thinking - ideal.Thinking),
    Doing: Math.abs(actual.Doing - ideal.Doing),
    Motivating: Math.abs(actual.Motivating - ideal.Motivating),
    Feeling: Math.abs(actual.Feeling - ideal.Feeling),
  };
}

/**
 * Generate recommendations based on gaps and domain balance
 *
 * @param gaps - Identified strength gaps
 * @param domainDeviation - Deviation from ideal domain distribution
 * @param memberCount - Current member count
 * @returns Array of recommendation strings
 */
export function generateRecommendations(
  gaps: StrengthGap[],
  domainDeviation: DomainDistribution,
  memberCount: number
): string[] {
  const recommendations: string[] = [];

  // Recommendations based on critical gaps
  const criticalGaps = gaps.filter((g) => g.priority === 'critical');
  if (criticalGaps.length > 0) {
    recommendations.push(
      `Considera agregar miembros con las fortalezas: ${criticalGaps.map((g) => g.strengthName).join(', ')}. Estas son críticas para el tipo de proyecto.`
    );
  }

  // Recommendations based on team size
  if (memberCount < 3) {
    recommendations.push(
      'El equipo es pequeño (menos de 3 miembros). Considera añadir más personas para mejor diversidad de fortalezas.'
    );
  } else if (memberCount > 8) {
    recommendations.push(
      'El equipo es grande (más de 8 miembros). Considera dividir en sub-grupos o roles más específicos.'
    );
  }

  // Recommendations based on domain imbalance
  const maxDeviation = Math.max(
    domainDeviation.Thinking,
    domainDeviation.Doing,
    domainDeviation.Motivating,
    domainDeviation.Feeling
  );

  if (maxDeviation > 0.2) {
    const dominantDomain = Object.entries(domainDeviation).reduce((a, b) =>
      a[ 1 ] > b[ 1 ] ? a : b
    )[ 0 ] as keyof DomainDistribution;

    recommendations.push(
      `El equipo tiene un desequilibrio en el dominio ${getDomainNameEs(dominantDomain)}. Considera balancear con fortalezas de otros dominios.`
    );
  }

  // If no specific recommendations, provide encouragement
  if (recommendations.length === 0) {
    recommendations.push(
      '¡El equipo tiene buena cobertura! Mantén la diversidad de fortalezas y revisa periódicamente.'
    );
  }

  return recommendations;
}

/**
 * Get Spanish name for a domain
 */
function getDomainNameEs(domain: keyof DomainDistribution): string {
  const names: Record<keyof DomainDistribution, string> = {
    Thinking: 'Pensamiento',
    Doing: 'Acción',
    Motivating: 'Motivación',
    Feeling: 'Sentimiento',
  };
  return names[ domain ];
}
