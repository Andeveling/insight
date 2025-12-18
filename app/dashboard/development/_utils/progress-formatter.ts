/**
 * Progress Formatter
 *
 * Utility functions for formatting progress data for display.
 */

/**
 * Calculate completion percentage
 */
export function calculatePercentage(completed: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((completed / total) * 100);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
	return `${Math.round(value)}%`;
}

/**
 * Format time in minutes to human-readable string
 */
export function formatMinutes(minutes: number): string {
	if (minutes < 60) {
		return `${minutes} min`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) {
		return `${hours}h`;
	}

	return `${hours}h ${remainingMinutes}min`;
}

/**
 * Format XP value for display
 */
export function formatXpValue(xp: number): string {
	if (xp >= 1000000) {
		return `${(xp / 1000000).toFixed(1)}M XP`;
	}
	if (xp >= 1000) {
		return `${(xp / 1000).toFixed(1)}K XP`;
	}
	return `${xp} XP`;
}

/**
 * Get progress status label in Spanish
 */
export function getProgressStatusLabel(
	status: "not_started" | "in_progress" | "completed",
): string {
	const labels: Record<typeof status, string> = {
		not_started: "Sin empezar",
		in_progress: "En progreso",
		completed: "Completado",
	};
	return labels[status];
}

/**
 * Get progress status color class
 */
export function getProgressStatusColor(
	status: "not_started" | "in_progress" | "completed",
): string {
	const colors: Record<typeof status, string> = {
		not_started: "text-muted-foreground",
		in_progress: "text-amber-500",
		completed: "text-green-500",
	};
	return colors[status];
}

/**
 * Format streak for display
 */
export function formatStreak(days: number): string {
	if (days === 0) return "Sin racha";
	if (days === 1) return "1 día";
	return `${days} días`;
}

/**
 * Get streak message based on count
 */
export function getStreakMessage(days: number): string {
	if (days === 0) {
		return "Completa un desafío hoy para iniciar tu racha.";
	}
	if (days < 3) {
		return "¡Buen comienzo! Sigue así para ganar bonificaciones.";
	}
	if (days < 7) {
		return "¡Excelente! Estás ganando bonificaciones de racha.";
	}
	if (days < 14) {
		return "¡Impresionante! Una semana de constancia.";
	}
	if (days < 30) {
		return "¡Increíble dedicación! Sigue adelante.";
	}
	return "¡Eres imparable! Tu constancia es admirable.";
}

/**
 * Calculate estimated time to complete remaining challenges
 */
export function estimateTimeToComplete(
	remainingChallenges: number,
	averageMinutesPerChallenge: number = 10,
): string {
	const totalMinutes = remainingChallenges * averageMinutesPerChallenge;
	return formatMinutes(totalMinutes);
}

/**
 * Format date relative to now (e.g., "hace 2 días")
 */
export function formatRelativeDate(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - new Date(date).getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMinutes = Math.floor(diffMs / (1000 * 60));

	if (diffMinutes < 1) return "Ahora mismo";
	if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
	if (diffHours < 24) return `Hace ${diffHours}h`;
	if (diffDays === 1) return "Ayer";
	if (diffDays < 7) return `Hace ${diffDays} días`;
	if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
	return `Hace ${Math.floor(diffDays / 30)} meses`;
}

/**
 * Format challenge count
 */
export function formatChallengeCount(completed: number, total: number): string {
	return `${completed}/${total}`;
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressColor(percentage: number): string {
	if (percentage >= 100) return "bg-green-500";
	if (percentage >= 75) return "bg-emerald-500";
	if (percentage >= 50) return "bg-amber-500";
	if (percentage >= 25) return "bg-orange-500";
	return "bg-muted-foreground";
}
