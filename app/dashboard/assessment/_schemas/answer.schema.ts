import { z } from 'zod';

/**
 * Answer Validation Schemas
 * Different schemas for different question types
 * Includes edge case handling for empty values, malformed data, out-of-range numbers
 */

// Scale answer: number between 1-5 (strict validation)
export const ScaleAnswerSchema = z
  .number()
  .int()
  .min(1)
  .max(5);

// Choice answer: non-empty string (selected option)
export const ChoiceAnswerSchema = z
  .string()
  .min(1)
  .max(500);

// Ranking answer: array of non-empty strings (ordered options)
export const RankingAnswerSchema = z
  .array(z.string().min(1))
  .min(2)
  .max(10)
  .refine(
    (items) => new Set(items).size === items.length,
    { message: 'Ranking items must be unique' }
  );

// Generic answer value (can be any of the above)
export const AnswerValueSchema = z.union([
  ScaleAnswerSchema,
  ChoiceAnswerSchema,
  RankingAnswerSchema,
]);

// Save answer input schema
export const SaveAnswerInputSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: AnswerValueSchema,
  confidence: z.number().int().min(1).max(5).optional(),
});

// Auto-save answer input schema (less strict, allows partial data)
export const AutoSaveAnswerInputSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: AnswerValueSchema,
  confidence: z.number().int().min(1).max(5).optional(),
});

// User assessment answer schema
export const UserAssessmentAnswerSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: AnswerValueSchema,
  confidence: z.number().int().min(1).max(5).optional(),
  answeredAt: z.date(),
});

// Validate answer matches question type
export const validateAnswerForQuestion = (
  answer: z.infer<typeof AnswerValueSchema>,
  questionType: 'SCALE' | 'CHOICE' | 'RANKING'
): boolean => {
  if (questionType === 'SCALE') {
    return typeof answer === 'number';
  }
  if (questionType === 'CHOICE') {
    return typeof answer === 'string';
  }
  if (questionType === 'RANKING') {
    return Array.isArray(answer);
  }
  return false;
};

export type AnswerValue = z.infer<typeof AnswerValueSchema>;
export type SaveAnswerInput = z.infer<typeof SaveAnswerInputSchema>;
export type AutoSaveAnswerInput = z.infer<typeof AutoSaveAnswerInputSchema>;
export type UserAssessmentAnswerValidated = z.infer<typeof UserAssessmentAnswerSchema>;
