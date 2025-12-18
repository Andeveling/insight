/**
 * Development Context Builder
 *
 * Builds context data from user's development progress to enrich AI prompts.
 * This provides the AI with meaningful activity data for personalized insights.
 *
 * @feature 009-contextual-reports
 */

/**
 * Simple development context for prompt building
 */
export interface SimpleDevelopmentContext {
	modulesCompleted: number;
	challengesCompleted: number;
	xpTotal: number;
	currentLevel: number;
	badgesUnlocked: number;
	streakDays: number;
	hasStrengths: boolean;
}

/**
 * Build a text summary of development context for AI prompts
 */
export function buildDevelopmentContextPrompt(
	context: SimpleDevelopmentContext,
): string {
	const lines: string[] = [
		"## Contexto de Desarrollo del Usuario",
		"",
		"El usuario ha demostrado su compromiso con el desarrollo personal a través de:",
		"",
	];

	// Strengths status
	if (context.hasStrengths) {
		lines.push(
			"- ✅ Ha identificado y configurado sus 5 fortalezas principales",
		);
	}

	// Modules completed
	if (context.modulesCompleted > 0) {
		lines.push(
			`- 📚 Ha completado ${context.modulesCompleted} módulo${context.modulesCompleted > 1 ? "s" : ""} de desarrollo`,
		);
	}

	// Challenges completed
	if (context.challengesCompleted > 0) {
		lines.push(
			`- 🎯 Ha completado ${context.challengesCompleted} challenge${context.challengesCompleted > 1 ? "s" : ""} prácticos`,
		);
	}

	// XP and Level
	if (context.xpTotal > 0) {
		lines.push(
			`- ⭐ Ha acumulado ${context.xpTotal} XP, alcanzando el nivel ${context.currentLevel}`,
		);
	}

	// Badges
	if (context.badgesUnlocked > 0) {
		lines.push(
			`- 🏅 Ha desbloqueado ${context.badgesUnlocked} badge${context.badgesUnlocked > 1 ? "s" : ""} de logros`,
		);
	}

	// Streak
	if (context.streakDays > 0) {
		lines.push(
			`- 🔥 Mantiene una racha de ${context.streakDays} día${context.streakDays > 1 ? "s" : ""} consecutivos`,
		);
	}

	lines.push("");
	lines.push("### Implicaciones para el Reporte");
	lines.push("");
	lines.push(
		"Este nivel de actividad indica un compromiso genuino con el autoconocimiento. ",
	);
	lines.push(
		"El reporte debe reconocer este esfuerzo y proporcionar insights que conecten ",
	);
	lines.push(
		"directamente con la práctica demostrada, no solo teoría abstracta.",
	);
	lines.push("");

	// Add specific guidance based on progress level
	if (context.xpTotal >= 500) {
		lines.push(
			"🌟 **Nivel Avanzado**: El usuario ha invertido tiempo significativo. ",
		);
		lines.push(
			"Proporciona insights más profundos y desafiantes que asuman familiaridad ",
		);
		lines.push("con los conceptos básicos de fortalezas.");
	} else if (context.xpTotal >= 200) {
		lines.push(
			"📈 **Nivel Intermedio**: El usuario está en proceso de internalizar sus fortalezas. ",
		);
		lines.push(
			"Equilibra insights prácticos con oportunidades de profundización.",
		);
	} else {
		lines.push("🌱 **Nivel Inicial**: El usuario está comenzando su viaje. ");
		lines.push(
			"Prioriza insights accionables y concretos que puedan aplicar de inmediato.",
		);
	}

	return lines.join("\n");
}

/**
 * Build metadata for report with development context
 */
export function buildReportMetadataV2(
	context: SimpleDevelopmentContext,
): Record<string, unknown> {
	return {
		version: 2,
		generatedWith: "contextual-readiness",
		developmentSnapshot: {
			modulesCompleted: context.modulesCompleted,
			challengesCompleted: context.challengesCompleted,
			xpTotal: context.xpTotal,
			currentLevel: context.currentLevel,
			badgesUnlocked: context.badgesUnlocked,
			streakDays: context.streakDays,
		},
		readinessScore: calculateReadinessScoreFromContext(context),
		generatedAt: new Date().toISOString(),
	};
}

/**
 * Calculate readiness score from development context
 */
function calculateReadinessScoreFromContext(
	context: SimpleDevelopmentContext,
): number {
	// Simplified version - full calculation is in readiness-calculator.ts
	let score = 0;

	if (context.hasStrengths) score += 10;
	score += Math.min(context.modulesCompleted / 3, 1) * 30;
	score += Math.min(context.xpTotal / 100, 1) * 35;
	score += Math.min(context.challengesCompleted / 5, 1) * 25;

	return Math.round(score);
}

/**
 * Check if context is sufficient for meaningful report generation
 */
export function hasMinimumContext(context: SimpleDevelopmentContext): boolean {
	return (
		context.hasStrengths &&
		context.modulesCompleted >= 3 &&
		context.xpTotal >= 100 &&
		context.challengesCompleted >= 5
	);
}

// ============================================================
// Team Development Context (Feature 009 - US4)
// ============================================================

/**
 * Team member development snapshot
 */
export interface TeamMemberDevelopmentContext {
	userId: string;
	userName: string;
	modulesCompleted: number;
	challengesCompleted: number;
	xpTotal: number;
	currentLevel: number;
	hasStrengths: boolean;
	readinessScore: number;
}

/**
 * Team development context for prompt building
 */
export interface TeamDevelopmentContext {
	teamId: string;
	teamName: string;
	members: TeamMemberDevelopmentContext[];
	aggregated: {
		totalModulesCompleted: number;
		totalChallengesCompleted: number;
		totalXp: number;
		averageLevel: number;
		membersWithStrengths: number;
		readyMembersCount: number;
		readyMembersPercent: number;
	};
}

/**
 * Build a text summary of team development context for AI prompts
 */
export function buildTeamDevelopmentContextPrompt(
	context: TeamDevelopmentContext,
): string {
	const lines: string[] = [
		"## Contexto de Desarrollo del Equipo",
		"",
		`Equipo: **${context.teamName}** (${context.members.length} miembros)`,
		"",
		"### Métricas Agregadas del Equipo",
		"",
	];

	const { aggregated } = context;

	lines.push(
		`- 👥 ${aggregated.membersWithStrengths} de ${context.members.length} miembros han identificado sus fortalezas`,
	);
	lines.push(
		`- 📚 ${aggregated.totalModulesCompleted} módulos completados en total por el equipo`,
	);
	lines.push(
		`- 🎯 ${aggregated.totalChallengesCompleted} challenges completados en total`,
	);
	lines.push(
		`- ⭐ ${aggregated.totalXp} XP acumulados (promedio nivel ${aggregated.averageLevel.toFixed(1)})`,
	);
	lines.push(
		`- ✅ ${aggregated.readyMembersCount} miembros (${aggregated.readyMembersPercent}%) tienen suficiente progreso`,
	);
	lines.push("");

	// Member breakdown
	lines.push("### Desglose por Miembro");
	lines.push("");

	// Sort by readiness score descending
	const sortedMembers = [...context.members].sort(
		(a, b) => b.readinessScore - a.readinessScore,
	);

	for (const member of sortedMembers) {
		const status = member.readinessScore >= 50 ? "✅" : "⏳";
		lines.push(
			`- ${status} **${member.userName}**: Nivel ${member.currentLevel}, ${member.modulesCompleted} módulos, ${member.challengesCompleted} challenges`,
		);
	}

	lines.push("");
	lines.push("### Implicaciones para el Reporte de Equipo");
	lines.push("");

	// Provide AI guidance based on team composition
	if (aggregated.readyMembersPercent >= 80) {
		lines.push(
			"🌟 **Equipo Altamente Activo**: La mayoría de los miembros han invertido ",
		);
		lines.push(
			"tiempo significativo en desarrollo. El reporte puede incluir patrones ",
		);
		lines.push("de sinergia y oportunidades de colaboración avanzadas.");
	} else if (aggregated.readyMembersPercent >= 60) {
		lines.push(
			"📈 **Equipo en Desarrollo**: Hay una mezcla de miembros muy activos y otros ",
		);
		lines.push(
			"comenzando. Destaca oportunidades de mentoría entre miembros y patrones ",
		);
		lines.push("emergentes del equipo.");
	} else {
		lines.push(
			"🌱 **Equipo en Etapa Inicial**: Varios miembros están comenzando su camino. ",
		);
		lines.push(
			"Enfócate en fortalezas identificadas y sugiere actividades grupales que ",
		);
		lines.push("motiven la participación colectiva.");
	}

	return lines.join("\n");
}

/**
 * Build team metadata for report with development context
 */
export function buildTeamReportMetadataV2(
	context: TeamDevelopmentContext,
): Record<string, unknown> {
	return {
		version: 2,
		generatedWith: "contextual-readiness",
		teamSnapshot: {
			membersCount: context.members.length,
			readyMembersCount: context.aggregated.readyMembersCount,
			readyMembersPercent: context.aggregated.readyMembersPercent,
			totalModulesCompleted: context.aggregated.totalModulesCompleted,
			totalChallengesCompleted: context.aggregated.totalChallengesCompleted,
			totalXp: context.aggregated.totalXp,
			averageLevel: context.aggregated.averageLevel,
		},
		memberSnapshots: context.members.map((m) => ({
			userId: m.userId,
			readinessScore: m.readinessScore,
			modulesCompleted: m.modulesCompleted,
			xpTotal: m.xpTotal,
		})),
		generatedAt: new Date().toISOString(),
	};
}
