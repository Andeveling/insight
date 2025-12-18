/**
 * SubTeam Zod Schemas
 *
 * Validation schemas for sub-team form data.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_schemas/subteam.schema
 */

import { z } from "zod";

// ============================================================
// Constants
// ============================================================

export const SUBTEAM_CONSTRAINTS = {
	NAME_MIN: 3,
	NAME_MAX: 50,
	DESCRIPTION_MAX: 500,
	MEMBERS_MIN: 2,
	MEMBERS_MAX: 10,
} as const;

// ============================================================
// Create SubTeam Schema
// ============================================================

/**
 * Schema for creating a new sub-team
 */
export const createSubTeamSchema = z.object({
	parentTeamId: z.string().uuid({
		message: "ID de equipo inválido",
	}),

	name: z
		.string()
		.min(SUBTEAM_CONSTRAINTS.NAME_MIN, {
			message: `El nombre debe tener al menos ${SUBTEAM_CONSTRAINTS.NAME_MIN} caracteres`,
		})
		.max(SUBTEAM_CONSTRAINTS.NAME_MAX, {
			message: `El nombre no puede exceder ${SUBTEAM_CONSTRAINTS.NAME_MAX} caracteres`,
		})
		.trim(),

	description: z
		.string()
		.max(SUBTEAM_CONSTRAINTS.DESCRIPTION_MAX, {
			message: `La descripción no puede exceder ${SUBTEAM_CONSTRAINTS.DESCRIPTION_MAX} caracteres`,
		})
		.trim()
		.default(""),

	projectTypeProfileId: z.string().uuid({
		message: "Tipo de proyecto inválido",
	}),

	members: z
		.array(z.string().uuid({ message: "ID de miembro inválido" }))
		.min(SUBTEAM_CONSTRAINTS.MEMBERS_MIN, {
			message: `Debes seleccionar al menos ${SUBTEAM_CONSTRAINTS.MEMBERS_MIN} miembros`,
		})
		.max(SUBTEAM_CONSTRAINTS.MEMBERS_MAX, {
			message: `No puedes seleccionar más de ${SUBTEAM_CONSTRAINTS.MEMBERS_MAX} miembros`,
		})
		.refine(
			(members) => {
				const unique = new Set(members);
				return unique.size === members.length;
			},
			{
				message: "No puedes agregar el mismo miembro más de una vez",
			},
		),
});

export type CreateSubTeamFormData = z.infer<typeof createSubTeamSchema>;

// ============================================================
// Update SubTeam Schema
// ============================================================

/**
 * Schema for updating an existing sub-team
 */
export const updateSubTeamSchema = z.object({
	id: z.string().uuid({
		message: "ID de sub-equipo inválido",
	}),

	name: z
		.string()
		.min(SUBTEAM_CONSTRAINTS.NAME_MIN, {
			message: `El nombre debe tener al menos ${SUBTEAM_CONSTRAINTS.NAME_MIN} caracteres`,
		})
		.max(SUBTEAM_CONSTRAINTS.NAME_MAX, {
			message: `El nombre no puede exceder ${SUBTEAM_CONSTRAINTS.NAME_MAX} caracteres`,
		})
		.trim()
		.optional(),

	description: z
		.string()
		.max(SUBTEAM_CONSTRAINTS.DESCRIPTION_MAX, {
			message: `La descripción no puede exceder ${SUBTEAM_CONSTRAINTS.DESCRIPTION_MAX} caracteres`,
		})
		.trim()
		.optional(),

	projectTypeProfileId: z
		.string()
		.uuid({
			message: "Tipo de proyecto inválido",
		})
		.optional(),

	members: z
		.array(z.string().uuid({ message: "ID de miembro inválido" }))
		.min(SUBTEAM_CONSTRAINTS.MEMBERS_MIN, {
			message: `Debes seleccionar al menos ${SUBTEAM_CONSTRAINTS.MEMBERS_MIN} miembros`,
		})
		.max(SUBTEAM_CONSTRAINTS.MEMBERS_MAX, {
			message: `No puedes seleccionar más de ${SUBTEAM_CONSTRAINTS.MEMBERS_MAX} miembros`,
		})
		.refine(
			(members) => {
				const unique = new Set(members);
				return unique.size === members.length;
			},
			{
				message: "No puedes agregar el mismo miembro más de una vez",
			},
		)
		.optional(),
});

export type UpdateSubTeamFormData = z.infer<typeof updateSubTeamSchema>;

// ============================================================
// Filter Schema
// ============================================================

/**
 * Schema for sub-team list filters
 */
export const subTeamFiltersSchema = z.object({
	status: z.enum(["all", "active", "archived"]).optional(),
	projectType: z.string().uuid().optional(),
	minMatchScore: z.number().min(0).max(100).optional(),
	maxMatchScore: z.number().min(0).max(100).optional(),
	searchQuery: z.string().max(100).optional(),
});

export type SubTeamFiltersFormData = z.infer<typeof subTeamFiltersSchema>;
