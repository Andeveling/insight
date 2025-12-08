import { createOpenAI } from "@ai-sdk/openai";

/**
 * AI SDK Provider Configuration
 *
 * NOTE: Google Generative AI is disabled due to API key referer restrictions
 * that block server-side requests. Only OpenAI is available.
 *
 * Model Selection Strategy:
 * - All reports use gpt-4o for reliable complex schema completion
 */

// OpenAI Provider
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model Aliases for different use cases
export const models = {
  individual: {
    openai: openai("gpt-4o"),
  },
  team: {
    openai: openai("gpt-4o"),
  },
} as const;

// Only OpenAI available (Google has referer restrictions for server-side)
export type ModelProvider = "openai";
export type ReportComplexity = "individual" | "team";

/**
 * Get the appropriate AI model based on report complexity
 */
export function getModel(complexity: ReportComplexity) {
  return models[ complexity ].openai;
}

/**
 * Get model identifier string for storage
 */
export function getModelId(): string {
  return "gpt-4o";
}

/**
 * Regeneration policy constants
 */
export const REGENERATION_POLICY = {
  /** Minimum days between regenerations */
  MIN_DAYS_BETWEEN_REGENERATIONS: 30,
  /** Error messages */
  ERRORS: {
    TOO_SOON: "Solo puedes regenerar el reporte cada 30 días o si cambian tus fortalezas.",
    NO_CHANGES: "Tus fortalezas no han cambiado desde el último reporte.",
  },
} as const;

/**
 * Generate a hash from user strengths for change detection
 */
export function generateStrengthsHash(
  strengths: Array<{ strengthId: string; rank: number }>,
): string {
  const sorted = [ ...strengths ].sort((a, b) => a.rank - b.rank);
  return sorted.map((s) => `${s.strengthId}:${s.rank}`).join("|");
}

/**
 * Check if regeneration is allowed based on policy
 */
export function canRegenerate(params: {
  lastGeneratedAt: Date | null;
  lastStrengthsHash: string | null;
  currentStrengthsHash: string;
}): { allowed: boolean; reason?: string } {
  const { lastGeneratedAt, lastStrengthsHash, currentStrengthsHash } = params;

  // First report - always allowed
  if (!lastGeneratedAt) {
    return { allowed: true };
  }

  // Check if strengths changed
  const strengthsChanged = lastStrengthsHash !== currentStrengthsHash;
  if (strengthsChanged) {
    return { allowed: true };
  }

  // Check time since last generation
  const daysSinceLastReport = Math.floor(
    (Date.now() - lastGeneratedAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceLastReport >= REGENERATION_POLICY.MIN_DAYS_BETWEEN_REGENERATIONS) {
    return { allowed: true };
  }

  // Not allowed
  const daysRemaining =
    REGENERATION_POLICY.MIN_DAYS_BETWEEN_REGENERATIONS - daysSinceLastReport;
  return {
    allowed: false,
    reason: `Podrás regenerar en ${daysRemaining} días, o si cambian tus fortalezas.`,
  };
}
