import { z } from "zod";
import { InsightSchema, RedFlagSchema } from "./individual-report.schema";

// ============================================================
// Team Report Schemas
// ============================================================

/**
 * Member strength summary for team context
 */
export const TeamMemberStrengthSummarySchema = z.object({
  memberId: z.string(),
  memberName: z.string(),
  role: z.string().optional(),
  topStrengths: z.array(z.string()).describe("Top 5 strengths in order"),
  primaryDomain: z.string().describe("Dominant domain for this member"),
  uniqueContribution: z
    .string()
    .describe("What this member uniquely brings to the team"),
});

export type TeamMemberStrengthSummary = z.infer<
  typeof TeamMemberStrengthSummarySchema
>;

/**
 * Domain coverage analysis
 */
export const DomainCoverageSchema = z.object({
  domain: z.enum([ "Doing", "Feeling", "Motivating", "Thinking" ]),
  percentage: z.number().describe("Percentage of team strengths in this domain"),
  memberCount: z.number().describe("Number of members with strengths here"),
  strengths: z.array(z.string()).describe("Specific strengths present"),
  status: z
    .enum([ "underrepresented", "balanced", "dominant" ])
    .describe("Whether this domain needs attention"),
  recommendation: z
    .string()
    .describe("Action to take based on coverage status"),
});

export type DomainCoverage = z.infer<typeof DomainCoverageSchema>;

/**
 * Culture quadrant position
 */
export const CulturePositionSchema = z.object({
  culture: z.enum([ "Execution", "Influence", "Strategy", "Cohesion" ]),
  cultureEs: z.string().describe("Spanish name"),
  energyAxis: z.object({
    action: z.number().describe("Percentage toward Action"),
    reflection: z.number().describe("Percentage toward Reflection"),
  }),
  orientationAxis: z.object({
    results: z.number().describe("Percentage toward Results"),
    people: z.number().describe("Percentage toward People"),
  }),
  position: z.object({
    x: z.number().min(-100).max(100).describe("X position on culture map"),
    y: z.number().min(-100).max(100).describe("Y position on culture map"),
  }),
  description: z.string().describe("What this culture means for the team"),
  implications: z
    .array(z.string())
    .describe("Practical implications of this culture"),
});

export type CulturePosition = z.infer<typeof CulturePositionSchema>;

/**
 * Strength distribution across team
 */
export const StrengthDistributionSchema = z.object({
  strengthName: z.string(),
  count: z.number().describe("How many team members have this strength"),
  percentage: z.number().describe("Percentage of team with this strength"),
  holders: z.array(z.string()).describe("Names of members with this strength"),
  status: z
    .enum([ "rare", "common", "ubiquitous" ])
    .describe("How widespread this strength is"),
});

export type StrengthDistribution = z.infer<typeof StrengthDistributionSchema>;

/**
 * Team synergy analysis
 */
export const TeamSynergySchema = z.object({
  pair: z.array(z.string()).length(2).describe("Names of the two members"),
  synergyScore: z
    .enum([ "low", "medium", "high", "exceptional" ])
    .describe("How well they complement each other"),
  complementaryStrengths: z
    .array(z.string())
    .describe("Strengths that complement between them"),
  potentialProjects: z
    .array(z.string())
    .describe("Types of projects they'd excel at together"),
  watchOut: z.string().optional().describe("Potential friction point"),
});

export type TeamSynergy = z.infer<typeof TeamSynergySchema>;

/**
 * Capability gap analysis
 */
export const CapabilityGapSchema = z.object({
  area: z.string().describe("The capability or strength that is missing"),
  impact: z
    .enum([ "low", "medium", "high", "critical" ])
    .describe("How much this gap affects team performance"),
  currentCoverage: z
    .string()
    .describe("How the team currently handles this gap"),
  recommendations: z.array(
    z.object({
      type: z.enum([ "hire", "develop", "partner", "outsource" ]),
      description: z.string(),
    })
  ),
});

export type CapabilityGap = z.infer<typeof CapabilityGapSchema>;

/**
 * Team ritual recommendation
 */
export const TeamRitualSchema = z.object({
  name: z.string().describe("Name of the ritual"),
  purpose: z.string().describe("Why this ritual helps the team"),
  frequency: z
    .enum([ "daily", "weekly", "biweekly", "monthly", "quarterly" ])
    .describe("How often to do this"),
  duration: z.string().describe("How long it takes"),
  steps: z.array(z.string()).describe("How to implement this ritual"),
  targetDomain: z
    .string()
    .describe("Which domain or culture aspect this addresses"),
});

export type TeamRitual = z.infer<typeof TeamRitualSchema>;

/**
 * Full Team Report Schema
 */
export const TeamReportSchema = z.object({
  // Executive Summary
  summary: z.object({
    teamName: z.string(),
    memberCount: z.number(),
    headline: z
      .string()
      .describe("One-line description of the team's collective identity"),
    overview: z
      .string()
      .describe("2-3 paragraph analysis of the team's composition"),
    teamArchetype: z
      .string()
      .describe(
        "A metaphor or archetype that captures the team (e.g., 'The Innovation Engine')"
      ),
    superpower: z
      .string()
      .describe("What this team does better than most teams"),
    primaryChallenge: z
      .string()
      .describe("The main challenge this team composition faces"),
  }),

  // Team Culture Map
  cultureMap: CulturePositionSchema,

  // Domain Coverage
  domainCoverage: z
    .array(DomainCoverageSchema)
    .describe("Analysis of all four domains"),

  // Strengths Distribution
  strengthsDistribution: z
    .array(StrengthDistributionSchema)
    .describe("Distribution of all strengths present in the team"),

  // Member Summaries
  memberSummaries: z
    .array(TeamMemberStrengthSummarySchema)
    .describe("Individual summaries for each team member"),

  // Team Synergies
  topSynergies: z
    .array(TeamSynergySchema)
    .describe("Best collaboration pairs in the team"),

  // Capability Gaps
  capabilityGaps: z
    .array(CapabilityGapSchema)
    .describe("Missing strengths or capabilities"),

  // Key Insights
  insights: z
    .array(InsightSchema)
    .describe("Key insights about the team composition"),

  // Red Flags / Risks
  redFlags: z
    .array(RedFlagSchema)
    .describe("Warning signs and risks for the team"),

  // Recommended Rituals
  recommendedRituals: z
    .array(TeamRitualSchema)
    .describe("Rituals to enhance team effectiveness"),

  // Role Optimization
  roleOptimization: z.array(
    z.object({
      memberName: z.string(),
      currentRole: z.string().optional(),
      optimalResponsibilities: z
        .array(z.string())
        .describe("Tasks aligned with their strengths"),
      avoidAssigning: z
        .array(z.string())
        .describe("Tasks that don't match their strengths"),
    })
  ),

  // Action Plan
  actionPlan: z.object({
    immediate: z
      .array(z.string())
      .describe("Actions for the team this week"),
    shortTerm: z
      .array(z.string())
      .describe("Goals for the next month"),
    longTerm: z
      .array(z.string())
      .describe("Strategic goals for the next quarter"),
    hiringPriorities: z
      .array(z.string())
      .optional()
      .describe("Strengths to prioritize in next hires"),
  }),
});

export type TeamReport = z.infer<typeof TeamReportSchema>;
