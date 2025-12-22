/**
 * Score Calculator Utility
 * Implements weighted accumulation scoring algorithm per research.md
 */

import type {
	AnswerValue,
	AssessmentResults,
	DomainScore,
	RankedStrength,
	StrengthScore,
} from "@/lib/types/assessment.types";

export interface QuestionData {
	id: string;
	phase: number;
	type: "SCALE" | "CHOICE" | "RANKING" | "SCENARIO";
	weight: number;
	domainId: string;
	strengthId: string | null;
	options?: string[] | null;
	maturityPolarity?: "NEUTRAL" | "RAW" | "MATURE";
}

export interface AnswerData {
	questionId: string;
	answer: AnswerValue;
}

export interface DomainInfo {
	id: string;
	name: string;
}

export interface StrengthInfo {
	id: string;
	name: string;
	domainId: string;
}

/**
 * Normalize an answer to a 0-1 scale based on question type
 */
export function normalizeAnswer(
	answer: AnswerValue,
	questionType: "SCALE" | "CHOICE" | "RANKING" | "SCENARIO",
): number {
	if (questionType === "SCALE") {
		// Scale answers are 1-5, normalize to 0-1
		const scaleValue = typeof answer === "number" ? answer : 3;
		return (scaleValue - 1) / 4; // (value - min) / (max - min)
	}

	if (questionType === "CHOICE") {
		// Choice answers indicate preference, return 1.0 for the selected strength
		return 1.0;
	}

	if (questionType === "RANKING" && Array.isArray(answer)) {
		// For ranking, we score based on position (handled per-item in strength scoring)
		return 1.0;
	}

	if (questionType === "SCENARIO") {
		// Scenario answers are binary choice (0 or 1 index)
		// 0 = RAW, 1 = MATURE
		return typeof answer === "number" ? answer : 0.5;
	}

	return 0.5; // Default neutral score
}

/**
 * Calculate domain scores from Phase 1 answers
 * Returns a map of domainId -> score (0-100)
 */
export function calculateDomainScores(
	answers: AnswerData[],
	questions: QuestionData[],
	domains: DomainInfo[],
): Record<string, DomainScore> {
	const domainScores: Record<
		string,
		{ totalScore: number; totalWeight: number }
	> = {};

	// Initialize all domains
	for (const domain of domains) {
		domainScores[domain.id] = { totalScore: 0, totalWeight: 0 };
	}

	// Calculate weighted scores for each answer
	for (const answer of answers) {
		const question = questions.find((q) => q.id === answer.questionId);
		if (!question || question.phase !== 1) continue;

		const normalizedValue = normalizeAnswer(answer.answer, question.type);
		const weightedScore = normalizedValue * question.weight;

		if (domainScores[question.domainId]) {
			domainScores[question.domainId].totalScore += weightedScore;
			domainScores[question.domainId].totalWeight += question.weight;
		}
	}

	// Convert to percentage scores (0-100)
	const result: Record<string, DomainScore> = {};

	for (const domain of domains) {
		const scores = domainScores[domain.id];
		const percentage =
			scores.totalWeight > 0
				? Math.round((scores.totalScore / scores.totalWeight) * 100)
				: 0;

		result[domain.id] = {
			domainId: domain.id,
			domainName: domain.name,
			score: percentage,
			questionCount: Math.round(scores.totalWeight), // Approximate count based on weights
		};
	}

	return result;
}

/**
 * Calculate strength scores from Phase 2 answers
 * Returns a map of strengthId -> score (0-100)
 */
export function calculateStrengthScores(
	answers: AnswerData[],
	questions: QuestionData[],
	strengths: StrengthInfo[],
): Record<string, StrengthScore> {
	const strengthScores: Record<
		string,
		{ totalScore: number; totalWeight: number }
	> = {};

	// Initialize relevant strengths
	for (const strength of strengths) {
		strengthScores[strength.id] = { totalScore: 0, totalWeight: 0 };
	}

	// Calculate weighted scores for each Phase 2 answer
	for (const answer of answers) {
		const question = questions.find((q) => q.id === answer.questionId);
		if (!question || question.phase !== 2 || !question.strengthId) continue;

		// For choice questions, check if the answer matches the strength's option
		if (question.type === "CHOICE" && typeof answer.answer === "string") {
			// The answer string should match one of the options
			// The first option typically corresponds to the question's primary strength
			const optionIndex = question.options?.indexOf(answer.answer) ?? -1;

			if (optionIndex === 0) {
				// Primary match - full weight
				strengthScores[question.strengthId].totalScore += 1.0 * question.weight;
				strengthScores[question.strengthId].totalWeight += question.weight;
			} else if (optionIndex > 0) {
				// Secondary match - partial weight
				strengthScores[question.strengthId].totalScore +=
					0.25 * question.weight;
				strengthScores[question.strengthId].totalWeight += question.weight;
			}
		} else if (question.type === "SCALE") {
			const normalizedValue = normalizeAnswer(answer.answer, question.type);
			strengthScores[question.strengthId].totalScore +=
				normalizedValue * question.weight;
			strengthScores[question.strengthId].totalWeight += question.weight;
		}
	}

	// Convert to percentage scores
	const result: Record<string, StrengthScore> = {};

	for (const strength of strengths) {
		const scores = strengthScores[strength.id];
		const percentage =
			scores.totalWeight > 0
				? Math.round((scores.totalScore / scores.totalWeight) * 100)
				: 0;

		result[strength.id] = {
			strengthId: strength.id,
			strengthName: strength.name,
			domainId: strength.domainId,
			score: percentage,
			questionCount: Math.round(scores.totalWeight),
		};
	}

	return result;
}

/**
 * Calculate response consistency for confidence scoring
 * Returns 0-1 where 1 is highly consistent
 */
function calculateConsistency(
	answers: AnswerData[],
	questions: QuestionData[],
): number {
	if (answers.length < 2) return 1.0;

	// Calculate variance of normalized answers
	const normalizedValues = answers
		.map((a) => {
			const q = questions.find((q) => q.id === a.questionId);
			if (!q) return null;
			return normalizeAnswer(a.answer, q.type);
		})
		.filter((v): v is number => v !== null);

	if (normalizedValues.length < 2) return 1.0;

	const mean =
		normalizedValues.reduce((a, b) => a + b, 0) / normalizedValues.length;
	const variance =
		normalizedValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
		normalizedValues.length;

	// Lower variance = higher consistency
	// Normalize variance to 0-1 scale (assuming max variance of 0.25 for 0-1 values)
	const normalizedVariance = Math.min(variance / 0.25, 1);

	return 1 - normalizedVariance;
}

/**
 * Calculate confidence score for a specific strength
 * Returns 0-100 based on weighted average, consistency, and sample size
 */
export function calculateConfidenceScore(
	strengthId: string,
	answers: AnswerData[],
	questions: QuestionData[],
): number {
	// Get answers related to this strength
	const relevantQuestions = questions.filter(
		(q) => q.strengthId === strengthId,
	);
	const relevantAnswers = answers.filter((a) =>
		relevantQuestions.some((q) => q.id === a.questionId),
	);

	if (relevantAnswers.length === 0) return 0;

	// Calculate weighted average response
	let weightedScore = 0;
	let totalWeight = 0;

	for (const answer of relevantAnswers) {
		const question = relevantQuestions.find((q) => q.id === answer.questionId);
		if (!question) continue;

		const normalizedValue = normalizeAnswer(answer.answer, question.type);
		weightedScore += normalizedValue * question.weight;
		totalWeight += question.weight;
	}

	const averageScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

	// Adjust for response consistency
	const consistency = calculateConsistency(relevantAnswers, relevantQuestions);

	// Adjust for sample size (more questions = higher confidence, cap at 10)
	const sampleSizeFactor = Math.min(relevantAnswers.length / 10, 1.0);

	// Final confidence score (0-100)
	return Math.round(averageScore * consistency * sampleSizeFactor * 100);
}

/**
 * Process Phase 3 ranking answers to determine final strength order
 */
function processRankingAnswers(
	answers: AnswerData[],
	questions: QuestionData[],
	strengthScores: Record<string, StrengthScore>,
): Record<string, number> {
	const rankingBoosts: Record<string, number> = {};

	// Initialize all strengths with 0 boost
	for (const strengthId of Object.keys(strengthScores)) {
		rankingBoosts[strengthId] = 0;
	}

	for (const answer of answers) {
		const question = questions.find((q) => q.id === answer.questionId);
		if (!question || question.phase !== 3 || question.type !== "RANKING")
			continue;

		if (Array.isArray(answer.answer)) {
			// Ranking weight: 1st=5, 2nd=4, 3rd=3, etc.
			answer.answer.forEach((item, index) => {
				// Each ranked item boosts its associated strength
				// Note: In practice, we'd need a mapping from ranking options to strengths
				const boost = (5 - index) * question.weight;

				// For now, distribute boost based on ranking position
				// This would be enhanced with proper option-to-strength mapping
				if (index < Object.keys(strengthScores).length) {
					const strengthIds = Object.keys(strengthScores);
					if (strengthIds[index]) {
						rankingBoosts[strengthIds[index]] += boost;
					}
				}
			});
		}
	}

	return rankingBoosts;
}

/**
 * Calculate final assessment results
 * Returns top 5 ranked strengths with confidence scores
 */
export function calculateFinalResults(
	answers: AnswerData[],
	questions: QuestionData[],
	domains: DomainInfo[],
	strengths: StrengthInfo[],
): AssessmentResults {
	// Calculate domain and strength scores
	const domainScores = calculateDomainScores(answers, questions, domains);
	const strengthScores = calculateStrengthScores(answers, questions, strengths);

	// Process Phase 3 rankings for final ordering
	const rankingBoosts = processRankingAnswers(
		answers,
		questions,
		strengthScores,
	);

	// Combine strength scores with ranking boosts
	const finalScores: Array<{
		strengthId: string;
		score: number;
		confidence: number;
	}> = [];

	for (const [strengthId, strengthScore] of Object.entries(strengthScores)) {
		const boost = rankingBoosts[strengthId] || 0;
		const adjustedScore = strengthScore.score + boost * 2; // Scale boost
		const confidence = calculateConfidenceScore(strengthId, answers, questions);

		finalScores.push({
			strengthId,
			score: adjustedScore,
			confidence,
		});
	}

	// Sort by score descending
	finalScores.sort((a, b) => b.score - a.score);

	// Take top 5
	const rankedStrengths: RankedStrength[] = finalScores
		.slice(0, 5)
		.map((item, index) => {
			const strength = strengths.find((s) => s.id === item.strengthId);
			const domain = domains.find((d) => d.id === strength?.domainId);

			return {
				rank: index + 1,
				strengthId: item.strengthId,
				strengthName: strength?.name || "Unknown",
				domainId: strength?.domainId || "",
				domainName: domain?.name || "Unknown",
				confidenceScore: item.confidence,
			};
		});

	// Calculate overall confidence
	const overallConfidence =
		rankedStrengths.length > 0
			? Math.round(
					rankedStrengths.reduce((sum, s) => sum + s.confidenceScore, 0) /
						rankedStrengths.length,
				)
			: 0;

	return {
		rankedStrengths,
		domainScores: Object.values(domainScores),
		overallConfidence,
		completedAt: new Date().toISOString(),
	};
}

/**
 * Calculate maturity levels based on Phase 4 answers
 * Returns a map of strengthId -> MaturityLevel (SPONGE | CONNECTOR | GUIDE | ALCHEMIST)
 */
export function calculateMaturityLevels(
	answers: AnswerData[],
	questions: QuestionData[],
	topStrengths: RankedStrength[],
): Record<string, "SPONGE" | "CONNECTOR" | "GUIDE" | "ALCHEMIST"> {
	const maturityLevels: Record<
		string,
		"SPONGE" | "CONNECTOR" | "GUIDE" | "ALCHEMIST"
	> = {};

	for (const strength of topStrengths) {
		// Default to CONNECTOR (middle ground) if no data
		maturityLevels[strength.strengthId] = "CONNECTOR";

		// Find the Phase 4 question for this strength
		const question = questions.find(
			(q) => q.phase === 4 && q.strengthId === strength.strengthId,
		);

		if (!question) continue;

		const answer = answers.find((a) => a.questionId === question.id);
		if (!answer) continue;

		// Logic: Option 0 = RAW (Sponge), Option 1 = MATURE (Guide/Alchemist)
		// We can map this to levels.
		// If user chose RAW -> SPONGE
		// If user chose MATURE -> GUIDE (or ALCHEMIST if confidence is very high?)

		// For now, simple mapping:
		// Option 0 -> SPONGE
		// Option 1 -> GUIDE

		if (typeof answer.answer === "string") {
			const optionIndex = question.options?.indexOf(answer.answer) ?? -1;

			if (optionIndex === 0) {
				maturityLevels[strength.strengthId] = "SPONGE";
			} else if (optionIndex === 1) {
				maturityLevels[strength.strengthId] = "GUIDE";
			}
		}
	}

	return maturityLevels;
}
