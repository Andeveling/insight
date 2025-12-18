/**
 * Professional Profile Schemas
 *
 * Zod validation schemas for user professional profile
 * used in personalized module generation.
 */

import { z } from "zod";

/**
 * Role satisfaction status enum
 */
export const RoleStatusSchema = z.enum([
	"satisfied",
	"partially_satisfied",
	"unsatisfied",
	"neutral",
]);

/**
 * Career goal options enum
 */
export const CareerGoalSchema = z.enum([
	"improve_current_role",
	"explore_new_responsibilities",
	"change_area",
	"lead_team",
	"other",
]);

/**
 * Professional profile data schema
 */
export const ProfessionalProfileSchema = z.object({
	roleStatus: RoleStatusSchema,
	currentRole: z.string().max(100, "Máximo 100 caracteres").optional(),
	industryContext: z.string().max(100, "Máximo 100 caracteres").optional(),
	careerGoals: z.array(CareerGoalSchema).max(5, "Máximo 5 metas").optional(),
});

/**
 * Save profile input schema (extends profile with skip option)
 */
export const SaveProfileInputSchema = ProfessionalProfileSchema.extend({
	skip: z.boolean().optional(),
});

/**
 * Profile output schema for API responses
 */
export const ProfileOutputSchema = z.object({
	hasProfile: z.boolean(),
	isComplete: z.boolean(),
	profile: ProfessionalProfileSchema.extend({
		completedAt: z.date().optional(),
		skippedAt: z.date().optional(),
	}).optional(),
});

/**
 * Form data schema for react-hook-form
 */
export const ProfileFormSchema = z.object({
	roleStatus: RoleStatusSchema,
	currentRole: z.string().max(100, "Máximo 100 caracteres").optional(),
	industryContext: z.string().max(100, "Máximo 100 caracteres").optional(),
	careerGoals: z.array(CareerGoalSchema).max(5, "Máximo 5 metas").default([]),
});

// Type exports
export type RoleStatus = z.infer<typeof RoleStatusSchema>;
export type CareerGoal = z.infer<typeof CareerGoalSchema>;
export type ProfessionalProfile = z.infer<typeof ProfessionalProfileSchema>;
export type SaveProfileInput = z.infer<typeof SaveProfileInputSchema>;
export type ProfileOutput = z.infer<typeof ProfileOutputSchema>;
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
