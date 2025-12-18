import { z } from "zod";

/**
 * Session Validation Schemas
 */

export const SessionStatusSchema = z.enum([
	"IN_PROGRESS",
	"COMPLETED",
	"ABANDONED",
]);

export const PhaseSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export const DomainScoresSchema = z.record(
	z.string().uuid(),
	z.number().min(0),
);

export const StrengthScoresSchema = z.record(
	z.string().uuid(),
	z.number().min(0),
);

// Ranked strength schema
export const RankedStrengthSchema = z.object({
	strengthId: z.string().uuid(),
	strengthName: z.string(),
	rank: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5),
	]),
	confidenceScore: z.number().min(0).max(100),
	domainId: z.string().uuid(),
	domainName: z.string(),
	description: z.string().optional(),
	developmentTips: z.array(z.string()).optional(),
});

// Assessment results schema
export const AssessmentResultsSchema = z.object({
	strengths: z.array(RankedStrengthSchema).length(5),
	overallConfidence: z.number().min(0).max(100),
	recommendations: z.array(z.string()),
	generatedAt: z.date(),
});

// Assessment session schema
export const AssessmentSessionSchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
	status: SessionStatusSchema,
	phase: PhaseSchema,
	currentStep: z.number().int().positive(),
	totalSteps: z.number().int().positive(),
	domainScores: DomainScoresSchema.optional(),
	strengthScores: StrengthScoresSchema.optional(),
	results: AssessmentResultsSchema.optional(),
	startedAt: z.date(),
	lastActivityAt: z.date(),
	completedAt: z.date().optional(),
});

// Complete phase input schema
export const CompletePhaseInputSchema = z.object({
	sessionId: z.string().uuid(),
	phase: PhaseSchema,
});

// Phase transition result schema
export const PhaseTransitionResultSchema = z.object({
	completedPhase: PhaseSchema,
	domainScores: DomainScoresSchema.optional(),
	topDomains: z
		.array(
			z.object({
				id: z.string().uuid(),
				name: z.string(),
				score: z.number(),
			}),
		)
		.optional(),
	preliminaryStrengths: z
		.array(
			z.object({
				id: z.string().uuid(),
				name: z.string(),
				score: z.number(),
			}),
		)
		.optional(),
	nextPhase: z.union([z.literal(2), z.literal(3)]).optional(),
	nextPhasePreview: z.string().optional(),
});

export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type DomainScores = z.infer<typeof DomainScoresSchema>;
export type StrengthScores = z.infer<typeof StrengthScoresSchema>;
export type RankedStrength = z.infer<typeof RankedStrengthSchema>;
export type AssessmentResults = z.infer<typeof AssessmentResultsSchema>;
export type AssessmentSessionValidated = z.infer<
	typeof AssessmentSessionSchema
>;
export type CompletePhaseInput = z.infer<typeof CompletePhaseInputSchema>;
export type PhaseTransitionResult = z.infer<typeof PhaseTransitionResultSchema>;
