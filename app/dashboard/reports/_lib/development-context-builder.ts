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
