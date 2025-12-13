/**
 * Question Mapper Utility for Peer Feedback
 *
 * Maps answer options to strength weights based on research.md definitions
 * Provides typed interfaces for question-answer-strength relationships
 */

import type { FeedbackQuestion as PrismaFeedbackQuestion } from '@/generated/prisma/client';

/**
 * Answer option structure as stored in FeedbackQuestion.answerOptions
 */
export interface AnswerOption {
  id: string;
  text: string;
  order: number;
}

/**
 * Strength mapping structure as stored in FeedbackQuestion.strengthMapping
 * Maps answer option IDs to strength weights
 */
export interface StrengthMapping {
  [ answerId: string ]: {
    [ strengthKey: string ]: number;
  };
}

/**
 * Parsed feedback question with typed JSON fields
 */
export interface ParsedFeedbackQuestion {
  id: string;
  text: string;
  answerType: string;
  order: number;
  answerOptions: AnswerOption[];
  strengthMapping: StrengthMapping;
}

/**
 * Result of mapping an answer to strengths
 */
export interface StrengthWeight {
  strengthKey: string;
  weight: number;
}

/**
 * Parses a Prisma FeedbackQuestion into a typed structure
 *
 * @param question - Raw Prisma FeedbackQuestion with JSON string fields
 * @returns Parsed question with typed answerOptions and strengthMapping
 */
export function parseFeedbackQuestion(
  question: PrismaFeedbackQuestion
): ParsedFeedbackQuestion {
  return {
    id: question.id,
    text: question.text,
    answerType: question.answerType,
    order: question.order,
    answerOptions: JSON.parse(question.answerOptions as string) as AnswerOption[],
    strengthMapping: JSON.parse(question.strengthMapping as string) as StrengthMapping,
  };
}

/**
 * Gets strength weights for a specific answer option
 *
 * @param question - Parsed feedback question
 * @param answerId - The ID of the selected answer option
 * @returns Array of strength weights for the selected answer
 */
export function getStrengthWeightsForAnswer(
  question: ParsedFeedbackQuestion,
  answerId: string
): StrengthWeight[] {
  const mapping = question.strengthMapping[ answerId ];

  if (!mapping) {
    console.warn(`No strength mapping found for answer "${answerId}" in question "${question.id}"`);
    return [];
  }

  return Object.entries(mapping).map(([ strengthKey, weight ]) => ({
    strengthKey,
    weight,
  }));
}

/**
 * Gets all available answer options for a question in display order
 *
 * @param question - Parsed feedback question
 * @returns Array of answer options sorted by order
 */
export function getAnswerOptions(question: ParsedFeedbackQuestion): AnswerOption[] {
  return [ ...question.answerOptions ].sort((a, b) => a.order - b.order);
}

/**
 * Validates that an answer ID exists for a question
 *
 * @param question - Parsed feedback question
 * @param answerId - The answer ID to validate
 * @returns Boolean indicating if the answer ID is valid
 */
export function isValidAnswerId(
  question: ParsedFeedbackQuestion,
  answerId: string
): boolean {
  return question.answerOptions.some((option) => option.id === answerId);
}

/**
 * Gets all strength keys that can be affected by a question
 *
 * @param question - Parsed feedback question
 * @returns Array of unique strength keys across all answers
 */
export function getAffectedStrengths(question: ParsedFeedbackQuestion): string[] {
  const strengthKeys = new Set<string>();

  for (const answerMapping of Object.values(question.strengthMapping)) {
    for (const strengthKey of Object.keys(answerMapping)) {
      strengthKeys.add(strengthKey);
    }
  }

  return Array.from(strengthKeys);
}

/**
 * Calculates the maximum possible weight for each strength in a question
 * Useful for normalization purposes
 *
 * @param question - Parsed feedback question
 * @returns Map of strength keys to their maximum possible weights
 */
export function getMaxStrengthWeights(
  question: ParsedFeedbackQuestion
): Map<string, number> {
  const maxWeights = new Map<string, number>();

  for (const answerMapping of Object.values(question.strengthMapping)) {
    for (const [ strengthKey, weight ] of Object.entries(answerMapping)) {
      const currentMax = maxWeights.get(strengthKey) ?? 0;
      maxWeights.set(strengthKey, Math.max(currentMax, weight));
    }
  }

  return maxWeights;
}
