import { z } from "zod";

// ============================================================
// Common Schemas
// ============================================================

/**
 * Insight item - actionable positive finding
 */
export const InsightSchema = z.object({
  title: z.string().describe("Short title for the insight"),
  description: z
    .string()
    .describe("Detailed explanation of the insight and why it matters"),
  actionItems: z
    .array(z.string())
    .describe("Specific actions to leverage this insight"),
});

export type Insight = z.infer<typeof InsightSchema>;

/**
 * Red Flag / Risk item - warning or potential issue
 */
export const RedFlagSchema = z.object({
  title: z.string().describe("Short title for the risk/warning"),
  severity: z
    .enum([ "low", "medium", "high" ])
    .describe("How critical this risk is"),
  description: z
    .string()
    .describe("Detailed explanation of the risk and its potential impact"),
  mitigation: z
    .array(z.string())
    .describe("Actions to prevent or reduce this risk"),
});

export type RedFlag = z.infer<typeof RedFlagSchema>;

// ============================================================
// Individual Report Schemas
// ============================================================

/**
 * Career implications based on strengths
 */
export const CareerImplicationSchema = z.object({
  strengthName: z.string().describe("Name of the strength this applies to"),
  idealRoles: z
    .array(z.string())
    .describe("Job roles where this strength creates maximum impact"),
  industries: z
    .array(z.string())
    .describe("Industries that value this strength"),
  growthAreas: z
    .array(z.string())
    .describe("Skills to develop to maximize career potential"),
});

export type CareerImplication = z.infer<typeof CareerImplicationSchema>;

/**
 * Blind spot analysis - strength overuse risks
 */
export const BlindSpotSchema = z.object({
  strengthName: z.string().describe("The strength that can become a blind spot"),
  darkSide: z
    .string()
    .describe("How this strength can turn into a weakness when overused"),
  triggers: z
    .array(z.string())
    .describe("Situations that trigger overuse of this strength"),
  balancingStrategies: z
    .array(z.string())
    .describe("How to keep this strength in healthy balance"),
});

export type BlindSpot = z.infer<typeof BlindSpotSchema>;

/**
 * Partnership recommendation
 */
export const PartnershipRecommendationSchema = z.object({
  complementaryStrength: z
    .string()
    .describe("Strength name that complements well"),
  whyItWorks: z.string().describe("Explanation of the synergy"),
  collaborationTips: z
    .array(z.string())
    .describe("How to work effectively with someone with this strength"),
});

export type PartnershipRecommendation = z.infer<
  typeof PartnershipRecommendationSchema
>;

/**
 * Development strategy for a strength
 */
export const DevelopmentStrategySchema = z.object({
  strengthName: z.string().describe("The strength to develop"),
  currentLevel: z
    .enum([ "emerging", "developing", "established", "mastery" ])
    .describe("Current development level"),
  shortTermActions: z
    .array(z.string())
    .describe("Actions for the next 30 days"),
  longTermGoals: z.array(z.string()).describe("Goals for the next 6-12 months"),
  resources: z
    .array(z.string())
    .describe("Books, courses, or experiences to pursue"),
});

export type DevelopmentStrategy = z.infer<typeof DevelopmentStrategySchema>;

/**
 * Full Individual Report Schema
 */
export const IndividualReportSchema = z.object({
  // Executive Summary
  summary: z.object({
    headline: z
      .string()
      .describe("One-line description of this person's unique strength blend"),
    overview: z
      .string()
      .describe("2-3 paragraph overview of their strength profile"),
    dominantDomain: z
      .string()
      .describe("Their primary domain (Doing, Feeling, Motivating, Thinking)"),
    uniqueValue: z
      .string()
      .describe("What makes this person uniquely valuable to a team"),
  }),

  // Strengths Dynamics - how the top 5 work together
  strengthsDynamics: z.object({
    synergies: z
      .array(
        z.object({
          strengths: z
            .array(z.string())
            .describe("The 2-3 strengths that synergize"),
          effect: z.string().describe("How they amplify each other"),
        })
      )
      .describe("How different strengths in the top 5 complement each other"),
    tensions: z
      .array(
        z.object({
          strengths: z
            .array(z.string())
            .describe("The 2 strengths that may conflict"),
          conflict: z.string().describe("The nature of the tension"),
          resolution: z.string().describe("How to manage this tension"),
        })
      )
      .describe("Potential conflicts between strengths"),
    uniqueBlend: z
      .string()
      .describe(
        "Description of what makes this specific combination special and rare"
      ),
  }),

  // Career Implications
  careerImplications: z
    .array(CareerImplicationSchema)
    .describe("Career implications for each top 5 strength"),

  // Blind Spots
  blindSpots: z
    .array(BlindSpotSchema)
    .describe("Potential blind spots for each strength"),

  // Development Strategies
  developmentStrategies: z
    .array(DevelopmentStrategySchema)
    .describe("Development plan for each strength"),

  // Best Partnerships
  bestPartnerships: z
    .array(PartnershipRecommendationSchema)
    .describe("Ideal partnership strengths to seek"),

  // Key Insights
  insights: z
    .array(InsightSchema)
    .describe("Key insights and opportunities for growth"),

  // Red Flags / Risks
  redFlags: z
    .array(RedFlagSchema)
    .describe("Warning signs and risks to watch for"),

  // Actionable Next Steps
  actionPlan: z.object({
    immediate: z
      .array(z.string())
      .describe("Actions to take this week"),
    shortTerm: z
      .array(z.string())
      .describe("Goals for the next month"),
    longTerm: z
      .array(z.string())
      .describe("Vision for the next year"),
  }),
});

export type IndividualReport = z.infer<typeof IndividualReportSchema>;
