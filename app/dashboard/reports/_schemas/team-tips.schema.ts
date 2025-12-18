import { z } from "zod";

// ============================================================
// Team Tips Report Schema
// Personal report: How YOU should relate to YOUR team members
// ============================================================

/**
 * Communication style recommendation for interacting with a team member
 */
export const MemberCommunicationTipSchema = z.object({
	memberId: z.string().describe("ID del miembro del equipo"),
	memberName: z.string().describe("Nombre del miembro del equipo"),
	memberRole: z.string().optional().describe("Rol del miembro en el equipo"),
	theirTopStrengths: z
		.array(z.string())
		.describe("Top 3 fortalezas del miembro"),
	relationshipDynamics: z.object({
		compatibility: z
			.enum(["high", "medium", "low"])
			.describe("high=alta, medium=media, low=baja - compatibilidad natural"),
		synergies: z
			.array(z.string())
			.describe("Fortalezas que se complementan entre ustedes"),
		potentialFrictions: z
			.array(z.string())
			.describe("Posibles puntos de fricción basados en sus fortalezas"),
	}),
	communicationStyle: z.object({
		preferredApproach: z
			.string()
			.describe("Cómo prefiere esta persona recibir comunicación"),
		doList: z
			.array(z.string())
			.describe("Acciones recomendadas al comunicarte con esta persona"),
		dontList: z
			.array(z.string())
			.describe("Acciones a evitar al comunicarte con esta persona"),
	}),
	collaborationTips: z
		.array(z.string())
		.describe("Consejos específicos para colaborar efectivamente"),
	projectTypes: z
		.array(z.string())
		.describe("Tipos de proyectos donde trabajarían bien juntos"),
});

export type MemberCommunicationTip = z.infer<
	typeof MemberCommunicationTipSchema
>;

/**
 * General team consideration
 */
export const TeamConsiderationSchema = z.object({
	title: z.string().describe("Título de la consideración"),
	description: z
		.string()
		.describe("Explicación detallada de qué tener en cuenta"),
	whenToApply: z
		.string()
		.describe("Situaciones donde esta consideración es más relevante"),
	actionItems: z
		.array(z.string())
		.describe("Acciones concretas para aplicar esta consideración"),
});

export type TeamConsideration = z.infer<typeof TeamConsiderationSchema>;

/**
 * Book recommendation with context
 */
export const BookRecommendationSchema = z.object({
	title: z.string().describe("Título del libro"),
	author: z.string().describe("Autor del libro"),
	whyRecommended: z
		.string()
		.describe("Por qué este libro es relevante para el contexto"),
	keyTakeaways: z
		.array(z.string())
		.describe("3 aprendizajes clave que se pueden aplicar"),
	applicationToTeam: z
		.string()
		.describe("Cómo aplicar lo aprendido específicamente al equipo"),
});

export type BookRecommendation = z.infer<typeof BookRecommendationSchema>;

/**
 * Full Team Tips Report Schema
 */
export const TeamTipsReportSchema = z.object({
	// Resumen Personal
	personalSummary: z.object({
		userName: z.string(),
		teamName: z.string(),
		headline: z
			.string()
			.describe("Tu rol natural en este equipo basado en tus fortalezas"),
		yourStrengthsInTeamContext: z
			.string()
			.describe(
				"Cómo tus fortalezas específicas aportan valor único a este equipo",
			),
		naturalRole: z
			.string()
			.describe(
				"El rol que naturalmente tiendes a tomar en dinámicas de equipo",
			),
		growthOpportunity: z
			.string()
			.describe(
				"La mayor oportunidad de crecimiento que este equipo te ofrece",
			),
	}),

	// Consejos por Miembro
	memberTips: z
		.array(MemberCommunicationTipSchema)
		.describe("Consejos de comunicación para cada miembro del equipo"),

	// Consideraciones Generales del Equipo
	teamConsiderations: z
		.array(TeamConsiderationSchema)
		.describe("Consideraciones importantes para relacionarte con el equipo"),

	// Estrategias de Comunicación General
	communicationStrategies: z.object({
		inMeetings: z
			.array(z.string())
			.describe("Cómo participar efectivamente en reuniones con este equipo"),
		inConflicts: z
			.array(z.string())
			.describe("Cómo manejar desacuerdos con este equipo"),
		inCelebrations: z
			.array(z.string())
			.describe("Cómo celebrar logros de manera que resuene con el equipo"),
		dailyInteractions: z
			.array(z.string())
			.describe("Tips para interacciones del día a día"),
	}),

	// Libros Personales (para TI basado en tus fortalezas)
	personalBooks: z
		.array(BookRecommendationSchema)
		.length(5)
		.describe(
			"5 libros recomendados específicamente para TI basado en tus fortalezas y cómo mejorar tu rol en el equipo",
		),

	// Libros de Equipo (para todos, para conectar mejor)
	teamBooks: z
		.array(BookRecommendationSchema)
		.length(5)
		.describe(
			"5 libros que TODO el equipo debería leer juntos para mejorar la conexión y colaboración",
		),

	// Plan de Acción
	actionPlan: z.object({
		thisWeek: z
			.array(z.string())
			.describe("Acciones para implementar esta semana"),
		thisMonth: z
			.array(z.string())
			.describe("Metas para este mes en tu relación con el equipo"),
		ongoing: z
			.array(z.string())
			.describe("Prácticas continuas para mantener buenas relaciones"),
	}),
});

export type TeamTipsReport = z.infer<typeof TeamTipsReportSchema>;
