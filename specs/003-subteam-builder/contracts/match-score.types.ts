/**
 * API Contracts: Match Score Calculation
 *
 * TypeScript interfaces for match score algorithm and analysis.
 *
 * @module contracts/match-score.types
 */

// ============================================================
// Match Score Input Types
// ============================================================

/**
 * Input for match score calculation
 */
export interface MatchScoreInput {
	members: string[]; // Array of user IDs
	projectTypeProfileId: string;
	teamContext?: TeamContext; // Optional context for enhanced calculation
}

/**
 * Team context for enhanced scoring
 */
export interface TeamContext {
	teamId: string;
	teamSize: number;
	teamCulture?: string; // Primary team culture
	teamDomainDistribution?: DomainDistribution;
}

// ============================================================
// Match Score Calculation Types
// ============================================================

/**
 * Weights for match score factors
 * Sum must equal 1.0
 */
export interface MatchScoreWeights {
	strengthCoverage: number; // Default: 0.30
	domainBalance: number; // Default: 0.25
	cultureFit: number; // Default: 0.20
	teamSize: number; // Default: 0.15
	redundancyPenalty: number; // Default: 0.10
}

/**
 * Default weights configuration
 */
export const DEFAULT_MATCH_SCORE_WEIGHTS: MatchScoreWeights = {
	strengthCoverage: 0.3,
	domainBalance: 0.25,
	cultureFit: 0.2,
	teamSize: 0.15,
	redundancyPenalty: 0.1,
};

/**
 * Result of match score calculation
 */
export interface MatchScoreResult {
	totalScore: number; // 0-100
	factors: MatchScoreFactorResults;
	gaps: StrengthGap[];
	recommendations: string[];
	metadata: MatchScoreMetadata;
}

/**
 * Results for each factor
 */
export interface MatchScoreFactorResults {
	strengthCoverage: StrengthCoverageResult;
	domainBalance: DomainBalanceResult;
	cultureFit: CultureFitResult;
	teamSize: TeamSizeResult;
	redundancyPenalty: RedundancyPenaltyResult;
}

// ============================================================
// Strength Coverage Factor
// ============================================================

/**
 * Strength coverage calculation result
 */
export interface StrengthCoverageResult {
	score: number; // 0-100
	weight: number;
	contribution: number;
	details: {
		uniqueStrengths: number; // Count of unique strengths
		totalPossibleStrengths: number; // 25 (5 strengths * 5 members max)
		strengthsList: string[]; // Names of strengths present
		coveragePercentage: number; // uniqueStrengths / totalPossibleStrengths
	};
}

// ============================================================
// Domain Balance Factor
// ============================================================

/**
 * Domain distribution across team
 */
export interface DomainDistribution {
	Thinking: number;
	Doing: number;
	Motivating: number;
	Feeling: number;
}

/**
 * Domain balance calculation result
 */
export interface DomainBalanceResult {
	score: number; // 0-100
	weight: number;
	contribution: number;
	details: {
		actual: DomainDistribution; // Actual distribution
		ideal: DomainDistribution; // Ideal from project type
		deviation: DomainDistribution; // Absolute difference
		balanceScore: number; // How balanced (0-100)
	};
}

// ============================================================
// Culture Fit Factor
// ============================================================

/**
 * Culture fit calculation result
 */
export interface CultureFitResult {
	score: number; // 0-100
	weight: number;
	contribution: number;
	details: {
		teamCultures: string[]; // Cultures present in team
		idealCultures: string[]; // Ideal from project type
		matchCount: number; // Number of matching cultures
		matchPercentage: number; // matchCount / idealCultures.length
	};
}

// ============================================================
// Team Size Factor
// ============================================================

/**
 * Team size calculation result
 */
export interface TeamSizeResult {
	score: number; // 0-100
	weight: number;
	contribution: number;
	details: {
		actualSize: number; // Current member count
		idealSize: number; // 5-7 members
		sizeScore: number; // Penalty for too small/large
	};
}

// ============================================================
// Redundancy Penalty Factor
// ============================================================

/**
 * Redundancy penalty calculation result
 */
export interface RedundancyPenaltyResult {
	score: number; // 0-10 (penalty points to subtract)
	weight: number;
	contribution: number; // Negative value
	details: {
		duplicateStrengths: DuplicateStrength[];
		totalDuplicates: number;
		penaltyPerDuplicate: number;
	};
}

/**
 * Duplicate strength information
 */
export interface DuplicateStrength {
	strengthName: string;
	strengthNameEs: string;
	count: number; // Number of team members with this strength
	members: string[]; // User IDs with this strength
}

// ============================================================
// Gap Analysis Types
// ============================================================

/**
 * Strength gap identified in team
 */
export interface StrengthGap {
	strengthName: string;
	strengthNameEs: string;
	domainName: string;
	domainNameEs: string;
	priority: "critical" | "recommended" | "optional";
	reason: string;
	impact: string; // What happens without this strength
	suggestedMembers?: SuggestedMember[]; // Potential members to add
}

/**
 * Suggested member to fill gap
 */
export interface SuggestedMember {
	userId: string;
	name: string;
	hasStrength: string; // Strength name they have
	scoreDelta: number; // Estimated score improvement
}

// ============================================================
// Recommendation Types
// ============================================================

/**
 * Recommendation for team improvement
 */
export interface Recommendation {
	type: "add_member" | "remove_member" | "change_focus" | "adjust_scope";
	priority: "high" | "medium" | "low";
	message: string;
	actionable: boolean;
	suggestedActions?: RecommendedAction[];
}

/**
 * Recommended action
 */
export interface RecommendedAction {
	action: string; // Human-readable action
	expectedImpact: string; // Expected outcome
	difficulty: "easy" | "medium" | "hard";
}

// ============================================================
// Metadata Types
// ============================================================

/**
 * Metadata about match score calculation
 */
export interface MatchScoreMetadata {
	calculatedAt: Date;
	version: string; // Algorithm version (e.g., "1.0.0")
	weights: MatchScoreWeights;
	projectType: string;
	memberCount: number;
}

// ============================================================
// Cache Types
// ============================================================

/**
 * Cached match score entry
 */
export interface CachedMatchScore {
	key: string; // Hash of input parameters
	result: MatchScoreResult;
	expiresAt: Date;
}

// ============================================================
// Utility Types
// ============================================================

/**
 * Score range classification
 */
export type ScoreRange = "excellent" | "good" | "fair" | "poor";

/**
 * Get score range label
 */
export function getScoreRange(score: number): ScoreRange {
	if (score >= 85) return "excellent";
	if (score >= 70) return "good";
	if (score >= 50) return "fair";
	return "poor";
}

/**
 * Score range configuration
 */
export interface ScoreRangeConfig {
	range: ScoreRange;
	min: number;
	max: number;
	label: string;
	labelEs: string;
	color: string; // Tailwind color class
	description: string;
	descriptionEs: string;
}

/**
 * Predefined score ranges
 */
export const SCORE_RANGES: ScoreRangeConfig[] = [
	{
		range: "excellent",
		min: 85,
		max: 100,
		label: "Excellent Match",
		labelEs: "Excelente Compatibilidad",
		color: "text-green-600",
		description: "This team is exceptionally well-suited for the project",
		descriptionEs:
			"Este equipo está excepcionalmente bien preparado para el proyecto",
	},
	{
		range: "good",
		min: 70,
		max: 84,
		label: "Good Match",
		labelEs: "Buena Compatibilidad",
		color: "text-blue-600",
		description: "This team has strong potential with minor gaps",
		descriptionEs: "Este equipo tiene gran potencial con brechas menores",
	},
	{
		range: "fair",
		min: 50,
		max: 69,
		label: "Fair Match",
		labelEs: "Compatibilidad Regular",
		color: "text-yellow-600",
		description: "This team may face challenges without adjustments",
		descriptionEs: "Este equipo puede enfrentar desafíos sin ajustes",
	},
	{
		range: "poor",
		min: 0,
		max: 49,
		label: "Poor Match",
		labelEs: "Compatibilidad Baja",
		color: "text-red-600",
		description: "Significant gaps exist - consider restructuring",
		descriptionEs: "Existen brechas significativas - considera reestructurar",
	},
];
