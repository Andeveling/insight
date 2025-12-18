import { z } from "zod";
import { InsightSchema, RedFlagSchema } from "./individual-report.schema";

// ============================================================
// Team Report Schemas
// ============================================================

/**
 * Member strength summary for team context
 */
export const TeamMemberStrengthSummarySchema = z.object({
	memberId: z.string(),
	memberName: z.string(),
	role: z.string().optional(),
	topStrengths: z.array(z.string()).describe("Top 5 fortalezas en orden"),
	primaryDomain: z.string().describe("Dominio dominante para este miembro"),
	uniqueContribution: z
		.string()
		.describe("Qué aporta únicamente este miembro al equipo"),
});

export type TeamMemberStrengthSummary = z.infer<
	typeof TeamMemberStrengthSummarySchema
>;

/**
 * Domain coverage analysis
 */
export const DomainCoverageSchema = z.object({
	domain: z
		.enum(["Doing", "Feeling", "Motivating", "Thinking"])
		.describe("Usar valores exactos: Doing, Feeling, Motivating, Thinking"),
	percentage: z
		.number()
		.describe("Porcentaje de fortalezas del equipo en este dominio"),
	memberCount: z.number().describe("Número de miembros con fortalezas aquí"),
	strengths: z.array(z.string()).describe("Fortalezas específicas presentes"),
	status: z
		.enum(["underrepresented", "balanced", "dominant"])
		.describe(
			"underrepresented=subrepresentado, balanced=equilibrado, dominant=dominante",
		),
	recommendation: z
		.string()
		.describe("Acción a tomar basada en el estado de cobertura"),
});

export type DomainCoverage = z.infer<typeof DomainCoverageSchema>;

/**
 * Culture quadrant position
 */
export const CulturePositionSchema = z.object({
	culture: z
		.enum(["Execution", "Influence", "Strategy", "Cohesion"])
		.describe(
			"IMPORTANTE: Usar valores EXACTOS en inglés: Execution, Influence, Strategy, Cohesion",
		),
	cultureEs: z
		.string()
		.describe("Nombre en español: Ejecución, Influencia, Estrategia, Cohesión"),
	energyAxis: z.object({
		action: z.number().describe("Porcentaje hacia Acción (0-100)"),
		reflection: z.number().describe("Porcentaje hacia Reflexión (0-100)"),
	}),
	orientationAxis: z.object({
		results: z.number().describe("Porcentaje hacia Resultados (0-100)"),
		people: z.number().describe("Porcentaje hacia Personas (0-100)"),
	}),
	position: z.object({
		x: z.number().min(-100).max(100).describe("Posición X en mapa cultural"),
		y: z.number().min(-100).max(100).describe("Posición Y en mapa cultural"),
	}),
	description: z.string().describe("Qué significa esta cultura para el equipo"),
	implications: z
		.array(z.string())
		.describe("Implicaciones prácticas de esta cultura"),
});

export type CulturePosition = z.infer<typeof CulturePositionSchema>;

/**
 * Strength distribution across team
 */
export const StrengthDistributionSchema = z.object({
	strengthName: z.string().describe("Nombre de la fortaleza en español"),
	count: z.number().describe("Cuántos miembros tienen esta fortaleza"),
	percentage: z.number().describe("Porcentaje del equipo con esta fortaleza"),
	holders: z
		.array(z.string())
		.describe("Nombres de miembros con esta fortaleza"),
	status: z
		.enum(["rare", "common", "ubiquitous"])
		.describe("rare=rara, common=común, ubiquitous=ubicua"),
});

export type StrengthDistribution = z.infer<typeof StrengthDistributionSchema>;

/**
 * Team synergy analysis
 */
export const TeamSynergySchema = z.object({
	pair: z.array(z.string()).length(2).describe("Nombres de los dos miembros"),
	synergyScore: z
		.enum(["low", "medium", "high", "exceptional"])
		.describe("low=baja, medium=media, high=alta, exceptional=excepcional"),
	complementaryStrengths: z
		.array(z.string())
		.describe("Fortalezas que se complementan entre ellos"),
	potentialProjects: z
		.array(z.string())
		.describe("Tipos de proyectos en los que destacarían juntos"),
	watchOut: z.string().optional().describe("Punto potencial de fricción"),
});

export type TeamSynergy = z.infer<typeof TeamSynergySchema>;

/**
 * Capability gap analysis
 */
export const CapabilityGapSchema = z.object({
	area: z.string().describe("La capacidad o fortaleza que falta"),
	impact: z
		.enum(["low", "medium", "high", "critical"])
		.describe("low=bajo, medium=medio, high=alto, critical=crítico"),
	currentCoverage: z
		.string()
		.describe("Cómo el equipo actualmente maneja esta brecha"),
	recommendations: z.array(
		z.object({
			type: z
				.enum(["hire", "develop", "partner", "outsource"])
				.describe(
					"hire=contratar, develop=desarrollar, partner=asociarse, outsource=tercerizar",
				),
			description: z.string(),
		}),
	),
});

export type CapabilityGap = z.infer<typeof CapabilityGapSchema>;

/**
 * Team ritual recommendation
 */
export const TeamRitualSchema = z.object({
	name: z.string().describe("Nombre del ritual"),
	purpose: z.string().describe("Por qué este ritual ayuda al equipo"),
	frequency: z
		.enum(["daily", "weekly", "biweekly", "monthly", "quarterly"])
		.describe(
			"daily=diario, weekly=semanal, biweekly=quincenal, monthly=mensual, quarterly=trimestral",
		),
	duration: z.string().describe("Cuánto tiempo toma"),
	steps: z.array(z.string()).describe("Cómo implementar este ritual"),
	targetDomain: z.string().describe("Qué dominio o aspecto cultural aborda"),
});

export type TeamRitual = z.infer<typeof TeamRitualSchema>;

/**
 * Full Team Report Schema
 */
export const TeamReportSchema = z.object({
	// Resumen Ejecutivo
	summary: z.object({
		teamName: z.string(),
		memberCount: z.number(),
		headline: z
			.string()
			.describe(
				"Descripción de una línea de la identidad colectiva del equipo",
			),
		overview: z
			.string()
			.describe("Análisis de 2-3 párrafos de la composición del equipo"),
		teamArchetype: z
			.string()
			.describe(
				"Metáfora o arquetipo que captura al equipo (ej: 'El Motor de Innovación')",
			),
		superpower: z
			.string()
			.describe("Lo que este equipo hace mejor que la mayoría"),
		primaryChallenge: z
			.string()
			.describe("El principal desafío que enfrenta esta composición"),
	}),

	// Mapa Cultural del Equipo
	cultureMap: CulturePositionSchema,

	// Cobertura por Dominios
	domainCoverage: z
		.array(DomainCoverageSchema)
		.describe("Análisis de los cuatro dominios"),

	// Distribución de Fortalezas
	strengthsDistribution: z
		.array(StrengthDistributionSchema)
		.describe("Distribución de todas las fortalezas presentes en el equipo"),

	// Resúmenes de Miembros
	memberSummaries: z
		.array(TeamMemberStrengthSummarySchema)
		.describe("Resúmenes individuales para cada miembro del equipo"),

	// Sinergias del Equipo
	topSynergies: z
		.array(TeamSynergySchema)
		.describe("Mejores pares de colaboración en el equipo"),

	// Brechas de Capacidad
	capabilityGaps: z
		.array(CapabilityGapSchema)
		.describe("Fortalezas o capacidades faltantes"),

	// Insights Clave
	insights: z
		.array(InsightSchema)
		.describe("Insights clave sobre la composición del equipo"),

	// Red Flags / Riesgos
	redFlags: z
		.array(RedFlagSchema)
		.describe("Señales de advertencia y riesgos para el equipo"),

	// Rituales Recomendados
	recommendedRituals: z
		.array(TeamRitualSchema)
		.describe("Rituales para mejorar la efectividad del equipo"),

	// Optimización de Roles
	roleOptimization: z.array(
		z.object({
			memberName: z.string(),
			currentRole: z.string().optional(),
			optimalResponsibilities: z
				.array(z.string())
				.describe("Tareas alineadas con sus fortalezas"),
			avoidAssigning: z
				.array(z.string())
				.describe("Tareas que no coinciden con sus fortalezas"),
		}),
	),

	// Plan de Acción
	actionPlan: z.object({
		immediate: z
			.array(z.string())
			.describe("Acciones para el equipo esta semana"),
		shortTerm: z.array(z.string()).describe("Metas para el próximo mes"),
		longTerm: z
			.array(z.string())
			.describe("Metas estratégicas para el próximo trimestre"),
		hiringPriorities: z
			.array(z.string())
			.optional()
			.describe("Fortalezas a priorizar en próximas contrataciones"),
	}),
});

export type TeamReport = z.infer<typeof TeamReportSchema>;
