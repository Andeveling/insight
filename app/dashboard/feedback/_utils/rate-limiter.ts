/**
 * Rate limiter for feedback request endpoint
 * Limits users to max 10 feedback requests per day
 *
 * Uses in-memory cache with sliding window algorithm
 */

interface RateLimitEntry {
	timestamps: number[];
	windowStart: number;
}

// In-memory store for rate limiting
// In production, consider using Redis for distributed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_REQUESTS_PER_DAY = 10;
const WINDOW_SIZE_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
	const now = Date.now();

	for (const [userId, entry] of rateLimitStore.entries()) {
		// Remove entries with no recent timestamps
		if (now - entry.windowStart > WINDOW_SIZE_MS * 2) {
			rateLimitStore.delete(userId);
		}
	}
}

// Start cleanup interval
if (typeof setInterval !== "undefined") {
	setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);
}

/**
 * Result of a rate limit check
 */
export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetAt: Date;
	retryAfterSeconds?: number;
}

/**
 * Check if a user can make a new feedback request
 *
 * @param userId - User ID to check rate limit for
 * @returns Rate limit result
 */
export function checkRateLimit(userId: string): RateLimitResult {
	const now = Date.now();
	const windowStart = now - WINDOW_SIZE_MS;

	// Get or create entry for user
	let entry = rateLimitStore.get(userId);

	if (!entry) {
		entry = {
			timestamps: [],
			windowStart: now,
		};
		rateLimitStore.set(userId, entry);
	}

	// Filter out timestamps outside the current window
	entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);
	entry.windowStart = windowStart;

	// Calculate remaining requests
	const requestsInWindow = entry.timestamps.length;
	const remaining = Math.max(0, MAX_REQUESTS_PER_DAY - requestsInWindow);

	// Calculate when the oldest request will expire
	const oldestTimestamp = entry.timestamps[0] || now;
	const resetAt = new Date(oldestTimestamp + WINDOW_SIZE_MS);

	if (requestsInWindow >= MAX_REQUESTS_PER_DAY) {
		const retryAfterSeconds = Math.ceil(
			(oldestTimestamp + WINDOW_SIZE_MS - now) / 1000,
		);

		return {
			allowed: false,
			remaining: 0,
			resetAt,
			retryAfterSeconds,
		};
	}

	return {
		allowed: true,
		remaining: remaining - 1, // Account for the request about to be made
		resetAt,
	};
}

/**
 * Record a successful feedback request for rate limiting
 *
 * @param userId - User ID to record request for
 */
export function recordRequest(userId: string): void {
	const now = Date.now();
	const windowStart = now - WINDOW_SIZE_MS;

	let entry = rateLimitStore.get(userId);

	if (!entry) {
		entry = {
			timestamps: [],
			windowStart: now,
		};
		rateLimitStore.set(userId, entry);
	}

	// Clean up old timestamps and add new one
	entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);
	entry.timestamps.push(now);
}

/**
 * Get rate limit status for a user without consuming a request
 *
 * @param userId - User ID to check
 * @returns Current rate limit status
 */
export function getRateLimitStatus(userId: string): {
	used: number;
	limit: number;
	remaining: number;
	resetAt: Date;
} {
	const now = Date.now();
	const windowStart = now - WINDOW_SIZE_MS;

	const entry = rateLimitStore.get(userId);

	if (!entry) {
		return {
			used: 0,
			limit: MAX_REQUESTS_PER_DAY,
			remaining: MAX_REQUESTS_PER_DAY,
			resetAt: new Date(now + WINDOW_SIZE_MS),
		};
	}

	// Filter timestamps in current window
	const validTimestamps = entry.timestamps.filter((ts) => ts > windowStart);
	const used = validTimestamps.length;
	const oldestTimestamp = validTimestamps[0] || now;

	return {
		used,
		limit: MAX_REQUESTS_PER_DAY,
		remaining: Math.max(0, MAX_REQUESTS_PER_DAY - used),
		resetAt: new Date(oldestTimestamp + WINDOW_SIZE_MS),
	};
}

/**
 * Reset rate limit for a user (for testing or admin purposes)
 *
 * @param userId - User ID to reset
 */
export function resetRateLimit(userId: string): void {
	rateLimitStore.delete(userId);
}

/**
 * Clear all rate limits (for testing purposes)
 */
export function clearAllRateLimits(): void {
	rateLimitStore.clear();
}
