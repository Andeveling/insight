/**
 * SubTeam Utilities
 *
 * Barrel export for all sub-team calculation utilities.
 *
 * @module lib/utils/subteam
 */

// Gap analysis utilities
export {
	compareDomainDistribution,
	generateRecommendations,
	identifyStrengthGaps,
} from "./gap-analyzer";

// Main match score calculator
export { calculateMatchScore } from "./match-score-calculator";

// Strength coverage utilities
export {
	calculateDomainDistribution,
	calculateStrengthCoverage,
	type MemberStrengthData,
	normalizeDomainDistribution,
} from "./strength-coverage";
