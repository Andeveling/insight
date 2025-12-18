import { z } from "zod";

/**
 * Question Validation Schemas
 */

export const QuestionTypeSchema = z.enum(["SCALE", "CHOICE", "RANKING"]);

export const ScaleRangeSchema = z.object({
	min: z.number().int().min(1),
	max: z.number().int().max(10),
	labels: z.array(z.string()).min(2),
});

export const AssessmentQuestionSchema = z.object({
	id: z.string().uuid(),
	phase: z.union([z.literal(1), z.literal(2), z.literal(3)]),
	order: z.number().int().positive(),
	text: z.string().min(10).max(500),
	type: QuestionTypeSchema,
	options: z.array(z.string()).optional(),
	scaleRange: ScaleRangeSchema.optional(),
	domainId: z.string().uuid(),
	strengthId: z.string().uuid().optional(),
	weight: z.number().min(0.1).max(2.0),
});

// Validation rules for question types
export const validateQuestionConsistency = (
	question: z.infer<typeof AssessmentQuestionSchema>,
) => {
	// Scale questions must have scaleRange
	if (question.type === "SCALE" && !question.scaleRange) {
		throw new Error("Scale questions must have scaleRange defined");
	}

	// Choice and Ranking questions must have options
	if (
		(question.type === "CHOICE" || question.type === "RANKING") &&
		!question.options
	) {
		throw new Error("Choice and Ranking questions must have options defined");
	}

	// Ranking questions must have at least 3 options
	if (
		question.type === "RANKING" &&
		question.options &&
		question.options.length < 3
	) {
		throw new Error("Ranking questions must have at least 3 options");
	}

	return true;
};

export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type ScaleRange = z.infer<typeof ScaleRangeSchema>;
export type AssessmentQuestionValidated = z.infer<
	typeof AssessmentQuestionSchema
>;
