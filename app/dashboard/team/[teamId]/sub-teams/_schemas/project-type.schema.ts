/**
 * Project Type Zod Schema
 *
 * Validation schemas for project type selection.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_schemas/project-type.schema
 */

import { z } from "zod";

// ============================================================
// Project Type Enum
// ============================================================

export const projectTypeEnum = z.enum([
	"innovation",
	"execution",
	"crisis",
	"growth",
]);

export type ProjectTypeValue = z.infer<typeof projectTypeEnum>;

// ============================================================
// Project Type Selection Schema
// ============================================================

/**
 * Schema for project type selection in forms
 */
export const projectTypeSelectionSchema = z.object({
	projectTypeProfileId: z.string().uuid({
		message: "Debes seleccionar un tipo de proyecto",
	}),
});

export type ProjectTypeSelectionFormData = z.infer<
	typeof projectTypeSelectionSchema
>;

// ============================================================
// Project Type Filter Schema
// ============================================================

/**
 * Schema for filtering by project type
 */
export const projectTypeFilterSchema = z.object({
	projectType: projectTypeEnum.optional(),
});

export type ProjectTypeFilterFormData = z.infer<typeof projectTypeFilterSchema>;
