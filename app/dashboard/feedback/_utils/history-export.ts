/**
 * History Export Utilities
 *
 * Funciones para exportar historial de feedback como CSV o PDF
 */

import type { FeedbackCycle, StrengthTrend } from '../_services/feedback-analysis.service';

/**
 * Tipo de formato de exportación
 */
export type ExportFormat = 'csv' | 'json';

/**
 * Datos para exportar
 */
export interface ExportData {
  cycles: FeedbackCycle[];
  trends: StrengthTrend[];
  generatedAt: Date;
  userName: string;
}

/**
 * Genera contenido CSV a partir de los ciclos de feedback
 */
export function generateCyclesCSV(cycles: FeedbackCycle[]): string {
  const headers = [
    'Fecha',
    'Total Respuestas',
    'Fortalezas Identificadas',
    'Resumen de Insights',
  ];

  const rows = cycles.map((cycle) => {
    const date = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(cycle.lastResponseAt || cycle.createdAt);

    const strengthCount = cycle.strengthScores.length;
    const insightsSummary = cycle.insights
      ? cycle.insights.substring(0, 200).replace(/"/g, '""')
      : 'Sin insights';

    return [
      date,
      cycle.totalResponses.toString(),
      strengthCount.toString(),
      `"${insightsSummary}"`,
    ].join(',');
  });

  return [ headers.join(','), ...rows ].join('\n');
}

/**
 * Genera contenido CSV a partir de las tendencias de fortalezas
 */
export function generateTrendsCSV(trends: StrengthTrend[]): string {
  const headers = [
    'Fortaleza',
    'Tendencia',
    'Varianza',
    'Score Actual',
    'Número de Mediciones',
  ];

  const trendLabels: Record<StrengthTrend[ 'trend' ], string> = {
    stable: 'Estable',
    improving: 'Mejorando',
    declining: 'Declinando',
    variable: 'Variable',
  };

  const rows = trends.map((trend) => {
    const currentScore =
      trend.dataPoints.length > 0
        ? Math.round(trend.dataPoints[ trend.dataPoints.length - 1 ].score * 100)
        : 0;

    return [
      `"${trend.strengthName}"`,
      trendLabels[ trend.trend ],
      trend.variance.toFixed(3),
      `${currentScore}%`,
      trend.dataPoints.length.toString(),
    ].join(',');
  });

  return [ headers.join(','), ...rows ].join('\n');
}

/**
 * Genera contenido CSV completo con todas las secciones
 */
export function generateFullCSV(data: ExportData): string {
  const header = `# Historial de Feedback 360°
# Usuario: ${data.userName}
# Generado: ${new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(data.generatedAt)}

`;

  const cyclesSection = `## Ciclos de Feedback
${generateCyclesCSV(data.cycles)}

`;

  const trendsSection = `## Tendencias de Fortalezas
${generateTrendsCSV(data.trends)}

`;

  // Detalle de scores por ciclo
  let detailSection = `## Detalle de Scores por Ciclo
Ciclo,Fortaleza,Score
`;

  for (const cycle of data.cycles) {
    const cycleDate = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(cycle.lastResponseAt || cycle.createdAt);

    for (const score of cycle.strengthScores) {
      detailSection += `${cycleDate},"${score.strengthKey}",${Math.round(score.normalizedScore * 100)}%\n`;
    }
  }

  return header + cyclesSection + trendsSection + detailSection;
}

/**
 * Genera contenido JSON para exportar
 */
export function generateJSON(data: ExportData): string {
  return JSON.stringify(
    {
      metadata: {
        userName: data.userName,
        generatedAt: data.generatedAt.toISOString(),
        version: '1.0',
      },
      cycles: data.cycles.map((cycle) => ({
        id: cycle.id,
        date: (cycle.lastResponseAt || cycle.createdAt).toISOString(),
        totalResponses: cycle.totalResponses,
        insights: cycle.insights,
        strengthScores: cycle.strengthScores,
      })),
      trends: data.trends.map((trend) => ({
        strengthKey: trend.strengthKey,
        strengthName: trend.strengthName,
        trend: trend.trend,
        variance: trend.variance,
        dataPoints: trend.dataPoints.map((dp) => ({
          date: dp.date.toISOString(),
          score: dp.score,
        })),
      })),
    },
    null,
    2
  );
}

/**
 * Descarga un archivo con el contenido especificado
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([ content ], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Exporta el historial de feedback en el formato especificado
 */
export function exportHistory(
  data: ExportData,
  format: ExportFormat
): void {
  const timestamp = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(data.generatedAt)
    .replace(/\//g, '-');

  if (format === 'csv') {
    const content = generateFullCSV(data);
    downloadFile(
      content,
      `feedback-historial-${timestamp}.csv`,
      'text/csv;charset=utf-8;'
    );
  } else if (format === 'json') {
    const content = generateJSON(data);
    downloadFile(
      content,
      `feedback-historial-${timestamp}.json`,
      'application/json'
    );
  }
}
