/**
 * Session Utilities
 * Helper functions for session management (client-side compatible)
 */

/**
 * Check if a session should be considered stale (7+ days old)
 * @param lastActivityAt - The last activity timestamp
 * @returns true if the session is stale
 */
export function isSessionStale(lastActivityAt: Date): boolean {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	return lastActivityAt < sevenDaysAgo;
}

/**
 * Calculate session progress percentage
 */
export function calculateProgress(
	currentStep: number,
	totalSteps: number,
): number {
	if (totalSteps <= 0) return 0;
	return Math.round((currentStep / totalSteps) * 100);
}

/**
 * Format session duration from start date
 */
export function getSessionDuration(startedAt: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - startedAt.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "today";
	if (diffDays === 1) return "yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	return `${Math.floor(diffDays / 30)} months ago`;
}

/**
 * Session storage key for recovery
 */
const SESSION_STORAGE_KEY = "assessment_session_id";

/**
 * Store session ID in sessionStorage for recovery
 */
export function storeSessionId(sessionId: string): void {
	if (typeof window !== "undefined") {
		sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
	}
}

/**
 * Get stored session ID from sessionStorage
 */
export function getStoredSessionId(): string | null {
	if (typeof window !== "undefined") {
		return sessionStorage.getItem(SESSION_STORAGE_KEY);
	}
	return null;
}

/**
 * Clear stored session ID
 */
export function clearStoredSessionId(): void {
	if (typeof window !== "undefined") {
		sessionStorage.removeItem(SESSION_STORAGE_KEY);
	}
}
