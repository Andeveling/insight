/**
 * Error Logger for AI Insight Generation
 *
 * Provides structured error logging for debugging AI-related failures
 * In production, this could be integrated with error tracking services like Sentry
 */

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface AIErrorContext {
	operation: string;
	userId?: string;
	inputSummary?: Record<string, unknown>;
	model?: string;
	promptLength?: number;
	responseCount?: number;
}

export interface LoggedError {
	id: string;
	timestamp: Date;
	severity: ErrorSeverity;
	message: string;
	stack?: string;
	context: AIErrorContext;
	resolved: boolean;
}

// In-memory error log (in production, use a database or logging service)
const errorLog: LoggedError[] = [];
const MAX_LOG_SIZE = 1000;

/**
 * Generate a unique error ID
 */
function generateErrorId(): string {
	return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Determine error severity based on error type
 */
function determineSeverity(
	error: unknown,
	context: AIErrorContext,
): ErrorSeverity {
	if (error instanceof Error) {
		// API key issues are critical
		if (
			error.message.includes("API key") ||
			error.message.includes("authentication")
		) {
			return "critical";
		}
		// Rate limiting is high
		if (error.message.includes("rate limit") || error.message.includes("429")) {
			return "high";
		}
		// Token limit exceeded is medium
		if (error.message.includes("token") || error.message.includes("length")) {
			return "medium";
		}
		// Network errors are high
		if (
			error.message.includes("network") ||
			error.message.includes("timeout")
		) {
			return "high";
		}
	}

	// Default severity based on operation
	if (context.operation.includes("critical")) {
		return "high";
	}

	return "medium";
}

/**
 * Log an AI-related error with context
 *
 * @param error - The error that occurred
 * @param context - Contextual information about the operation
 * @param severity - Optional override for error severity
 * @returns The logged error ID for reference
 */
export function logAIError(
	error: unknown,
	context: AIErrorContext,
	severity?: ErrorSeverity,
): string {
	const errorId = generateErrorId();
	const calculatedSeverity = severity || determineSeverity(error, context);

	const logEntry: LoggedError = {
		id: errorId,
		timestamp: new Date(),
		severity: calculatedSeverity,
		message: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined,
		context: {
			...context,
			// Sanitize sensitive data
			inputSummary: context.inputSummary
				? sanitizeInputSummary(context.inputSummary)
				: undefined,
		},
		resolved: false,
	};

	// Add to log, maintaining max size
	errorLog.unshift(logEntry);
	if (errorLog.length > MAX_LOG_SIZE) {
		errorLog.pop();
	}

	// Console output with formatting
	const severityColors: Record<ErrorSeverity, string> = {
		low: "\x1b[32m", // green
		medium: "\x1b[33m", // yellow
		high: "\x1b[31m", // red
		critical: "\x1b[35m", // magenta
	};

	const reset = "\x1b[0m";
	const color = severityColors[calculatedSeverity];

	console.error(
		`${color}[AI Error ${calculatedSeverity.toUpperCase()}]${reset} ${errorId}`,
	);
	console.error(`  Operation: ${context.operation}`);
	console.error(`  Message: ${logEntry.message}`);

	if (context.userId) {
		console.error(`  User: ${context.userId.slice(0, 8)}...`);
	}

	if (process.env.NODE_ENV === "development" && logEntry.stack) {
		console.error(`  Stack:\n${logEntry.stack}`);
	}

	// In production, send to error tracking service
	if (
		process.env.NODE_ENV === "production" &&
		calculatedSeverity === "critical"
	) {
		sendToErrorTrackingService(logEntry);
	}

	return errorId;
}

/**
 * Sanitize input summary to remove sensitive data
 */
function sanitizeInputSummary(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const sanitized: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(input)) {
		// Skip potentially sensitive keys
		if (
			["email", "password", "token", "secret", "key"].some((s) =>
				key.toLowerCase().includes(s),
			)
		) {
			sanitized[key] = "[REDACTED]";
		} else if (typeof value === "string" && value.length > 100) {
			sanitized[key] = `${value.slice(0, 100)}... (${value.length} chars)`;
		} else if (Array.isArray(value)) {
			sanitized[key] = `[Array: ${value.length} items]`;
		} else {
			sanitized[key] = value;
		}
	}

	return sanitized;
}

/**
 * Placeholder for error tracking service integration
 * In production, replace with actual Sentry/DataDog/etc. integration
 */
function sendToErrorTrackingService(error: LoggedError): void {
	// TODO: Integrate with Sentry, DataDog, or similar
	console.log(
		`[ErrorTracking] Would send error ${error.id} to tracking service`,
	);
}

/**
 * Get recent errors from the log
 *
 * @param limit - Maximum number of errors to return
 * @param severityFilter - Optional filter by severity
 * @returns Recent logged errors
 */
export function getRecentErrors(
	limit: number = 50,
	severityFilter?: ErrorSeverity,
): LoggedError[] {
	let errors = errorLog;

	if (severityFilter) {
		errors = errors.filter((e) => e.severity === severityFilter);
	}

	return errors.slice(0, limit);
}

/**
 * Get error statistics
 */
export function getErrorStats(): {
	total: number;
	bySeverity: Record<ErrorSeverity, number>;
	last24h: number;
	unresolvedCount: number;
} {
	const now = Date.now();
	const oneDayAgo = now - 24 * 60 * 60 * 1000;

	const bySeverity: Record<ErrorSeverity, number> = {
		low: 0,
		medium: 0,
		high: 0,
		critical: 0,
	};

	let last24h = 0;
	let unresolvedCount = 0;

	for (const error of errorLog) {
		bySeverity[error.severity]++;

		if (error.timestamp.getTime() > oneDayAgo) {
			last24h++;
		}

		if (!error.resolved) {
			unresolvedCount++;
		}
	}

	return {
		total: errorLog.length,
		bySeverity,
		last24h,
		unresolvedCount,
	};
}

/**
 * Mark an error as resolved
 *
 * @param errorId - Error ID to mark resolved
 * @returns True if error was found and marked
 */
export function markErrorResolved(errorId: string): boolean {
	const error = errorLog.find((e) => e.id === errorId);

	if (error) {
		error.resolved = true;
		return true;
	}

	return false;
}

/**
 * Clear all errors (for testing)
 */
export function clearErrorLog(): void {
	errorLog.length = 0;
}

/**
 * Log a successful AI operation (for monitoring success rates)
 */
export function logAISuccess(context: {
	operation: string;
	userId?: string;
	durationMs: number;
	tokensUsed?: number;
}): void {
	if (process.env.NODE_ENV === "development") {
		console.log(
			`[AI Success] ${context.operation} completed in ${context.durationMs}ms`,
		);

		if (context.tokensUsed) {
			console.log(`  Tokens used: ${context.tokensUsed}`);
		}
	}
}
