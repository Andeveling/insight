import { z } from "zod";

// ============================================================
// Common Schemas
// ============================================================

/**
 * Insight item - actionable positive finding
 */
export const InsightSchema = z.object({
  title: z.string().describe("Título corto del insight"),
  description: z
    .string()
    .describe("Explicación detallada del insight y por qué importa"),
  actionItems: z
    .array(z.string())
    .describe("Acciones específicas para aprovechar este insight"),
});

export type Insight = z.infer<typeof InsightSchema>;

/**
 * Red Flag / Risk item - warning or potential issue
 */
export const RedFlagSchema = z.object({
  title: z.string().describe("Título corto del riesgo/advertencia"),
  severity: z
    .enum([ "low", "medium", "high" ])
    .describe("low=bajo, medium=medio, high=alto - qué tan crítico es este riesgo"),
  description: z
    .string()
    .describe("Explicación detallada del riesgo y su potencial impacto"),
  mitigation: z
    .array(z.string())
    .describe("Acciones para prevenir o reducir este riesgo"),
});

export type RedFlag = z.infer<typeof RedFlagSchema>;

// ============================================================
// Individual Report Schemas
// ============================================================

/**
 * Career implications based on strengths
 */
export const CareerImplicationSchema = z.object({
  strengthName: z.string().describe("Nombre de la fortaleza a la que aplica"),
  idealRoles: z
    .array(z.string())
    .describe("Roles laborales donde esta fortaleza crea máximo impacto"),
  industries: z
    .array(z.string())
    .describe("Industrias que valoran esta fortaleza"),
  growthAreas: z
    .array(z.string())
    .describe("Habilidades a desarrollar para maximizar potencial de carrera"),
});

export type CareerImplication = z.infer<typeof CareerImplicationSchema>;

/**
 * Blind spot analysis - strength overuse risks
 */
export const BlindSpotSchema = z.object({
  strengthName: z.string().describe("La fortaleza que puede volverse punto ciego"),
  darkSide: z
    .string()
    .describe("Cómo esta fortaleza puede convertirse en debilidad cuando se usa en exceso"),
  triggers: z
    .array(z.string())
    .describe("Situaciones que disparan el uso excesivo de esta fortaleza"),
  balancingStrategies: z
    .array(z.string())
    .describe("Cómo mantener esta fortaleza en balance saludable"),
});

export type BlindSpot = z.infer<typeof BlindSpotSchema>;

/**
 * Partnership recommendation
 */
export const PartnershipRecommendationSchema = z.object({
  complementaryStrength: z
    .string()
    .describe("Nombre de la fortaleza que complementa bien"),
  whyItWorks: z.string().describe("Explicación de la sinergia"),
  collaborationTips: z
    .array(z.string())
    .describe("Cómo trabajar efectivamente con alguien con esta fortaleza"),
});

export type PartnershipRecommendation = z.infer<
  typeof PartnershipRecommendationSchema
>;

/**
 * Development strategy for a strength
 */
export const DevelopmentStrategySchema = z.object({
  strengthName: z.string().describe("La fortaleza a desarrollar"),
  currentLevel: z
    .enum([ "emerging", "developing", "established", "mastery" ])
    .describe("emerging=emergente, developing=en desarrollo, established=establecido, mastery=maestría"),
  shortTermActions: z
    .array(z.string())
    .describe("Acciones para los próximos 30 días"),
  longTermGoals: z.array(z.string()).describe("Metas para los próximos 6-12 meses"),
  resources: z
    .array(z.string())
    .describe("Libros, cursos o experiencias a buscar"),
});

export type DevelopmentStrategy = z.infer<typeof DevelopmentStrategySchema>;

/**
 * Full Individual Report Schema
 */
export const IndividualReportSchema = z.object({
  // Resumen Ejecutivo
  summary: z.object({
    headline: z
      .string()
      .describe("Descripción de una línea de la mezcla única de fortalezas"),
    overview: z
      .string()
      .describe("Resumen de 2-3 párrafos del perfil de fortalezas"),
    dominantDomain: z
      .string()
      .describe("Dominio primario: Hacer, Sentir, Motivar o Pensar"),
    uniqueValue: z
      .string()
      .describe("Qué hace a esta persona únicamente valiosa para un equipo"),
  }),

  // Dinámicas de Fortalezas - cómo trabajan juntas las top 5
  strengthsDynamics: z.object({
    synergies: z
      .array(
        z.object({
          strengths: z
            .array(z.string())
            .describe("Las 2-3 fortalezas que crean sinergia"),
          effect: z.string().describe("Cómo se amplifican entre sí"),
        })
      )
      .describe("Cómo diferentes fortalezas en el top 5 se complementan"),
    tensions: z
      .array(
        z.object({
          strengths: z
            .array(z.string())
            .describe("Las 2 fortalezas que pueden entrar en conflicto"),
          conflict: z.string().describe("La naturaleza de la tensión"),
          resolution: z.string().describe("Cómo manejar esta tensión"),
        })
      )
      .describe("Potenciales conflictos entre fortalezas"),
    uniqueBlend: z
      .string()
      .describe("Descripción de qué hace esta combinación específica especial y rara"),
  }),

  // Implicaciones de Carrera
  careerImplications: z
    .array(CareerImplicationSchema)
    .describe("Implicaciones de carrera para cada fortaleza del top 5"),

  // Puntos Ciegos
  blindSpots: z
    .array(BlindSpotSchema)
    .describe("Potenciales puntos ciegos para cada fortaleza"),

  // Estrategias de Desarrollo
  developmentStrategies: z
    .array(DevelopmentStrategySchema)
    .describe("Plan de desarrollo para cada fortaleza"),

  // Mejores Partnerships
  bestPartnerships: z
    .array(PartnershipRecommendationSchema)
    .describe("Fortalezas de partnership ideales a buscar"),

  // Insights Clave
  insights: z
    .array(InsightSchema)
    .describe("Insights clave y oportunidades de crecimiento"),

  // Red Flags / Riesgos
  redFlags: z
    .array(RedFlagSchema)
    .describe("Señales de advertencia y riesgos a vigilar"),

  // Próximos Pasos Accionables
  actionPlan: z.object({
    immediate: z
      .array(z.string())
      .describe("Acciones a tomar esta semana"),
    shortTerm: z
      .array(z.string())
      .describe("Metas para el próximo mes"),
    longTerm: z
      .array(z.string())
      .describe("Visión para el próximo año"),
  }),
});

export type IndividualReport = z.infer<typeof IndividualReportSchema>;
