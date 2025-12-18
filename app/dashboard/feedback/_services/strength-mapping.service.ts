/**
 * Strength Mapping Service
 *
 * Calculates strength scores from peer feedback responses
 * Aggregates multiple responses into weighted strength insights
 * Based on research.md algorithm design
 */

import { prisma } from "@/lib/prisma.db";
import {
	getStrengthWeightsForAnswer,
	type ParsedFeedbackQuestion,
	parseFeedbackQuestion,
	type StrengthWeight,
} from "../_utils/question-mapper";

/**
 * Aggregated strength score from peer feedback
 */
export interface AggregatedStrengthScore {
	strengthKey: string;
	totalWeight: number;
	responseCount: number;
	averageWeight: number;
	normalizedScore: number; // 0-100 scale
}

/**
 * Complete feedback analysis result
 */
export interface FeedbackAnalysisResult {
	userId: string;
	totalResponses: number;
	strengthScores: AggregatedStrengthScore[];
	topStrengths: string[]; // Top 5 by normalized score
	emergingStrengths: string[]; // Strengths with moderate scores
	timestamp: Date;
}

/**
 * Single response with answer for processing
 */
interface ResponseWithAnswer {
	questionId: string;
	answer: string;
}

/**
 * Calculates strength scores from a set of feedback responses
 *
 * @param responses - Array of feedback responses with question ID and answer
 * @param questions - Parsed feedback questions for mapping
 * @returns Map of strength keys to their calculated weights
 */
export function calculateStrengthScores(
	responses: ResponseWithAnswer[],
	questions: ParsedFeedbackQuestion[],
): Map<string, StrengthWeight[]> {
	const strengthScores = new Map<string, StrengthWeight[]>();

	for (const response of responses) {
		const question = questions.find((q) => q.id === response.questionId);

		if (!question) {
			console.warn(`Question not found for response: ${response.questionId}`);
			continue;
		}

		const weights = getStrengthWeightsForAnswer(question, response.answer);

		for (const weight of weights) {
			const existing = strengthScores.get(weight.strengthKey) ?? [];
			existing.push(weight);
			strengthScores.set(weight.strengthKey, existing);
		}
	}

	return strengthScores;
}

/**
 * Aggregates strength scores from multiple peer responses
 * Uses weighted average with response count consideration
 *
 * @param strengthScores - Map of strength keys to arrays of weights
 * @param totalResponders - Number of unique responders
 * @returns Array of aggregated strength scores
 */
export function aggregateStrengthScores(
	strengthScores: Map<string, StrengthWeight[]>,
	totalResponders: number,
): AggregatedStrengthScore[] {
	const aggregated: AggregatedStrengthScore[] = [];

	for (const [strengthKey, weights] of strengthScores) {
		const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
		const responseCount = weights.length;
		const averageWeight = responseCount > 0 ? totalWeight / responseCount : 0;

		// Normalize to 0-100 scale
		// Max possible: 0.9 weight * 5 questions * responses = 4.5 * responses
		// We normalize based on the theoretical maximum per responder
		const maxPossiblePerResponder = 4.5; // 0.9 * 5 questions
		const maxPossible = maxPossiblePerResponder * totalResponders;
		const normalizedScore =
			maxPossible > 0 ? Math.min(100, (totalWeight / maxPossible) * 100) : 0;

		aggregated.push({
			strengthKey,
			totalWeight,
			responseCount,
			averageWeight,
			normalizedScore: Math.round(normalizedScore * 10) / 10, // 1 decimal precision
		});
	}

	// Sort by normalized score descending
	return aggregated.sort((a, b) => b.normalizedScore - a.normalizedScore);
}

/**
 * Analyzes all completed feedback for a user and produces strength insights
 *
 * @param userId - The user ID to analyze feedback for
 * @returns Complete feedback analysis result or null if insufficient data
 */
export async function analyzePeerFeedback(
	userId: string,
): Promise<FeedbackAnalysisResult | null> {
	// Get all completed feedback requests for this user
	const completedRequests = await prisma.feedbackRequest.findMany({
		where: {
			requesterId: userId,
			status: "COMPLETED",
		},
		include: {
			responses: true,
		},
	});

	if (completedRequests.length === 0) {
		return null;
	}

	// Collect all responses
	const allResponses: ResponseWithAnswer[] = [];
	const uniqueResponders = new Set<string>();

	for (const request of completedRequests) {
		for (const response of request.responses) {
			allResponses.push({
				questionId: response.questionId,
				answer: response.answer,
			});
			// Track unique responders (using anonymous hash for privacy)
			if (response.anonymousHash) {
				uniqueResponders.add(response.anonymousHash);
			}
		}
	}

	// Get all feedback questions
	const rawQuestions = await prisma.feedbackQuestion.findMany({
		orderBy: { order: "asc" },
	});
	const questions = rawQuestions.map(parseFeedbackQuestion);

	// Calculate and aggregate scores
	const strengthScores = calculateStrengthScores(allResponses, questions);
	const aggregatedScores = aggregateStrengthScores(
		strengthScores,
		uniqueResponders.size,
	);

	// Determine top and emerging strengths
	const topStrengths = aggregatedScores.slice(0, 5).map((s) => s.strengthKey);

	const emergingStrengths = aggregatedScores
		.filter((s) => s.normalizedScore >= 20 && s.normalizedScore < 50)
		.slice(0, 5)
		.map((s) => s.strengthKey);

	return {
		userId,
		totalResponses: allResponses.length,
		strengthScores: aggregatedScores,
		topStrengths,
		emergingStrengths,
		timestamp: new Date(),
	};
}

/**
 * Compares peer feedback analysis with user's self-assessed strengths
 * Identifies blind spots (peer sees but user doesn't) and hidden strengths (user sees but peers don't)
 *
 * @param userId - The user ID to analyze
 * @param feedbackAnalysis - The peer feedback analysis result
 * @returns Object with blind spots and hidden strengths
 */
export async function compareWithSelfAssessment(
	userId: string,
	feedbackAnalysis: FeedbackAnalysisResult,
): Promise<{
	blindSpots: string[]; // Peers see, user doesn't recognize
	hiddenStrengths: string[]; // User claims, peers don't observe
	validated: string[]; // Both agree
}> {
	// Get user's self-assessed strengths
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId },
		include: { strength: true },
		orderBy: { rank: "asc" },
	});

	// Convert strength names to lowercase keys for comparison
	const toKey = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

	const selfAssessedKeys = new Set(
		userStrengths.map((us) => toKey(us.strength.name)),
	);

	const peerObservedKeys = new Set(feedbackAnalysis.topStrengths);

	// Blind spots: In peer top 5 but not in self top 5
	const blindSpots = feedbackAnalysis.topStrengths.filter(
		(key) => !selfAssessedKeys.has(key),
	);

	// Hidden strengths: In self top 5 but not in peer observations
	const hiddenStrengths = userStrengths
		.slice(0, 5)
		.map((us) => toKey(us.strength.name))
		.filter((key) => !peerObservedKeys.has(key));

	// Validated: Both agree on these strengths
	const validated = feedbackAnalysis.topStrengths.filter((key) =>
		selfAssessedKeys.has(key),
	);

	return {
		blindSpots,
		hiddenStrengths,
		validated,
	};
}

/**
 * Generates strength adjustment suggestions based on peer feedback
 *
 * @param userId - The user ID
 * @param feedbackAnalysis - The feedback analysis result
 * @returns Array of suggested strength adjustments
 */
export async function generateStrengthAdjustments(
	userId: string,
	feedbackAnalysis: FeedbackAnalysisResult,
): Promise<
	Array<{
		strengthKey: string;
		suggestedDelta: number;
		reason: string;
	}>
> {
	const comparison = await compareWithSelfAssessment(userId, feedbackAnalysis);
	const adjustments: Array<{
		strengthKey: string;
		suggestedDelta: number;
		reason: string;
	}> = [];

	// For blind spots, suggest positive adjustment (peers see it, user should consider)
	for (const strengthKey of comparison.blindSpots) {
		const score = feedbackAnalysis.strengthScores.find(
			(s) => s.strengthKey === strengthKey,
		);
		if (score && score.normalizedScore >= 40) {
			adjustments.push({
				strengthKey,
				suggestedDelta: 1, // Suggest moving up in ranking
				reason: `Peers consistently observe ${strengthKey} in your behavior`,
			});
		}
	}

	// For hidden strengths with low peer observation, suggest reconsideration
	for (const strengthKey of comparison.hiddenStrengths) {
		adjustments.push({
			strengthKey,
			suggestedDelta: -1, // Suggest reconsidering ranking
			reason: `This strength may not be as visible to others as you perceive`,
		});
	}

	return adjustments;
}
