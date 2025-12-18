/**
 * Strength Coverage Calculator
 *
 * Calculates how well a team covers the ideal strengths for a project type.
 *
 * @module lib/utils/subteam/strength-coverage
 */

import type { StrengthCoverageResult } from "@/lib/types";
import type { DomainDistribution } from "@/lib/types/match-score.types";

import { DEFAULT_MATCH_SCORE_WEIGHTS } from "@/lib/types";

/**
 * Member strength data for calculation
 */
export interface MemberStrengthData {
	userId: string;
	strengths: {
		name: string;
		nameEs: string;
		rank: number;
		domain: string;
	}[];
}

/**
 * Calculate strength coverage score for a team
 *
 * @param members - Array of member strength data
 * @param idealStrengths - Array of ideal strength names for the project type
 * @returns Strength coverage result with score and details
 */
export function calculateStrengthCoverage(
	members: MemberStrengthData[],
	idealStrengths: string[],
): StrengthCoverageResult {
	const weight = DEFAULT_MATCH_SCORE_WEIGHTS.strengthCoverage;

	// Get all unique strengths from team members
	const teamStrengths = new Set<string>();
	members.forEach((member) => {
		member.strengths.forEach((strength) => {
			teamStrengths.add(strength.name);
		});
	});

	const uniqueStrengths = teamStrengths.size;
	const strengthsList = Array.from(teamStrengths);

	// Calculate coverage against ideal strengths
	const matchedStrengths = idealStrengths.filter((s) => teamStrengths.has(s));
	const coveragePercentage =
		idealStrengths.length > 0
			? matchedStrengths.length / idealStrengths.length
			: 0;

	// Calculate total possible (5 strengths per member, cap at ideal team size of 7)
	const effectiveMembers = Math.min(members.length, 7);
	const totalPossibleStrengths = effectiveMembers * 5;

	// Score based on coverage percentage (0-100)
	const score = Math.round(coveragePercentage * 100);

	return {
		score,
		weight,
		contribution: score * weight,
		details: {
			uniqueStrengths,
			totalPossibleStrengths,
			strengthsList,
			coveragePercentage,
		},
	};
}

/**
 * Calculate domain distribution from member strengths
 *
 * @param members - Array of member strength data
 * @returns Domain distribution counts
 */
export function calculateDomainDistribution(
	members: MemberStrengthData[],
): DomainDistribution {
	const distribution: DomainDistribution = {
		Thinking: 0,
		Doing: 0,
		Motivating: 0,
		Feeling: 0,
	};

	members.forEach((member) => {
		member.strengths.forEach((strength) => {
			const domain = strength.domain as keyof DomainDistribution;
			if (domain in distribution) {
				distribution[domain]++;
			}
		});
	});

	return distribution;
}

/**
 * Normalize domain distribution to percentages
 *
 * @param distribution - Domain distribution counts
 * @returns Normalized distribution (0-1 for each domain)
 */
export function normalizeDomainDistribution(
	distribution: DomainDistribution,
): DomainDistribution {
	const total = Object.values(distribution).reduce(
		(sum, count) => sum + count,
		0,
	);

	if (total === 0) {
		return { Thinking: 0.25, Doing: 0.25, Motivating: 0.25, Feeling: 0.25 };
	}

	return {
		Thinking: distribution.Thinking / total,
		Doing: distribution.Doing / total,
		Motivating: distribution.Motivating / total,
		Feeling: distribution.Feeling / total,
	};
}
