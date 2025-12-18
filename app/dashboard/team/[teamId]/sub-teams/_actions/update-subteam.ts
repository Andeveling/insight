/**
 * Update Sub-Team Server Action
 *
 * Server action for updating an existing sub-team.
 * Includes authorization check and match score recalculation.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_actions/update-subteam
 */

"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { updateSubTeam as updateSubTeamService } from "@/lib/services/subteam.service";
import type { UpdateSubTeamInput } from "@/lib/types";

import { updateSubTeamSchema } from "../_schemas/subteam.schema";

interface UpdateSubTeamResponse {
	success: boolean;
	data?: {
		id: string;
		matchScore: number | null;
	};
	error?: string;
}

/**
 * Update an existing sub-team
 *
 * Authorization: Only the creator or team admin can update
 */
export async function updateSubTeamAction(
	input: UpdateSubTeamInput,
): Promise<UpdateSubTeamResponse> {
	try {
		// 1. Verify session
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "No autenticado" };
		}

		// 2. Validate input
		const validationResult = updateSubTeamSchema.safeParse(input);
		if (!validationResult.success) {
			const firstError = validationResult.error.issues[0];
			return {
				success: false,
				error: firstError?.message || "Datos inválidos",
			};
		}

		const validatedData = validationResult.data;

		// 3. Get existing sub-team
		const existingSubTeam = await prisma.subTeam.findUnique({
			where: { id: validatedData.id },
			select: {
				id: true,
				parentTeamId: true,
				createdBy: true,
			},
		});

		if (!existingSubTeam) {
			return { success: false, error: "Sub-equipo no encontrado" };
		}

		// 4. Authorization check: must be creator or team admin
		const membership = await prisma.teamMember.findFirst({
			where: {
				teamId: existingSubTeam.parentTeamId,
				userId: session.user.id,
			},
			select: {
				role: true,
			},
		});

		if (!membership) {
			return { success: false, error: "No eres miembro de este equipo" };
		}

		const isCreator = existingSubTeam.createdBy === session.user.id;
		const isAdmin = membership.role === "admin" || membership.role === "owner";

		if (!isCreator && !isAdmin) {
			return {
				success: false,
				error:
					"Solo el creador o un administrador puede editar este sub-equipo",
			};
		}

		// 5. Validate members if provided
		if (validatedData.members && validatedData.members.length > 0) {
			// Check members belong to the team
			const teamMembers = await prisma.teamMember.findMany({
				where: {
					teamId: existingSubTeam.parentTeamId,
					userId: { in: validatedData.members },
				},
				select: { userId: true },
			});

			const validMemberIds = new Set(teamMembers.map((tm) => tm.userId));
			const invalidMembers = validatedData.members.filter(
				(id) => !validMemberIds.has(id),
			);

			if (invalidMembers.length > 0) {
				return {
					success: false,
					error: "Algunos miembros seleccionados no pertenecen al equipo",
				};
			}
		}

		// 6. Update sub-team (service handles score recalculation)
		const result = await updateSubTeamService(validatedData);

		// 7. Revalidate paths
		revalidatePath(`/dashboard/team/${existingSubTeam.parentTeamId}/sub-teams`);
		revalidatePath(
			`/dashboard/team/${existingSubTeam.parentTeamId}/sub-teams/${result.id}`,
		);

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error("Error updating sub-team:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Error al actualizar el sub-equipo",
		};
	}
}

/**
 * Update sub-team members only (for What-If simulation apply)
 *
 * Simplified version that only updates members and recalculates score
 */
export async function updateSubTeamMembers(
	subTeamId: string,
	newMembers: string[],
): Promise<UpdateSubTeamResponse> {
	return updateSubTeamAction({
		id: subTeamId,
		members: newMembers,
	});
}
