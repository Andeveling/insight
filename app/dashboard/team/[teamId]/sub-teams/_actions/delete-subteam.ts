/**
 * Delete Sub-Team Server Action
 *
 * Server action for soft-deleting a sub-team.
 * Sets deletedAt timestamp instead of permanent deletion.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_actions/delete-subteam
 */

"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

// ============================================================
// Types
// ============================================================

interface DeleteSubTeamResponse {
	success: boolean;
	error?: string;
}

// ============================================================
// Server Action
// ============================================================

/**
 * Soft delete a sub-team by setting deletedAt
 *
 * Authorization: Only the creator or team admin can delete
 */
export async function deleteSubTeamAction(
	subTeamId: string,
): Promise<DeleteSubTeamResponse> {
	try {
		// 1. Verify session
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "No autenticado" };
		}

		// 2. Get existing sub-team
		const existingSubTeam = await prisma.subTeam.findUnique({
			where: { id: subTeamId },
			select: {
				id: true,
				parentTeamId: true,
				createdBy: true,
				deletedAt: true,
			},
		});

		if (!existingSubTeam) {
			return { success: false, error: "Sub-equipo no encontrado" };
		}

		if (existingSubTeam.deletedAt) {
			return { success: false, error: "Este sub-equipo ya ha sido eliminado" };
		}

		// 3. Authorization check: must be creator or team admin
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
					"Solo el creador o un administrador puede eliminar este sub-equipo",
			};
		}

		// 4. Soft delete
		await prisma.subTeam.update({
			where: { id: subTeamId },
			data: {
				deletedAt: new Date(),
			},
		});

		// 5. Revalidate paths
		revalidatePath(`/dashboard/team/${existingSubTeam.parentTeamId}/sub-teams`);

		return { success: true };
	} catch (error) {
		console.error("Error deleting sub-team:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Error al eliminar el sub-equipo",
		};
	}
}
