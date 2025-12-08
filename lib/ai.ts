import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

/**
 * AI SDK Provider Configuration
 *
 * Model Selection Strategy:
 * - Individual Reports (simpler context): gpt-4o-mini or gemini-2.0-flash
 * - Team Reports (complex analysis): gpt-4o or gemini-2.5-pro
 */

// OpenAI Provider
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Generative AI Provider
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Model Aliases for different use cases
export const models = {
  // Models for individual reports (need gpt-4o for complex schema completion)
  individual: {
    openai: openai("gpt-4o"),
    google: google("gemini-2.5-pro"),
  },
  // Powerful models for team analysis
  team: {
    openai: openai("gpt-4o"),
    google: google("gemini-2.5-pro"),
  },
} as const;

// Default model selector based on report complexity
export type ModelProvider = "openai" | "google";
export type ReportComplexity = "individual" | "team";

/**
 * Get the appropriate AI model based on report complexity and provider preference
 */
export function getModel(
  complexity: ReportComplexity,
  provider: ModelProvider = "openai",
) {
  return models[ complexity ][ provider ];
}

/**
 * Get model identifier string for storage
 */
export function getModelId(
  complexity: ReportComplexity,
  provider: ModelProvider = "openai",
): string {
  const modelMap = {
    individual: {
      openai: "gpt-4o",
      google: "gemini-2.5-pro",
    },
    team: {
      openai: "gpt-4o",
      google: "gemini-2.5-pro",
    },
  } as const;

  return modelMap[ complexity ][ provider ];
}
