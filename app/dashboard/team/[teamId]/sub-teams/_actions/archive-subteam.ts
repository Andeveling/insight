/**
 * Archive Sub-Team Server Action
 *
 * Server actions for archiving and restoring sub-teams.
 * Changes status between 'active' and 'archived'.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_actions/archive-subteam
 */

"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

// ============================================================
// Types
// ============================================================

interface ArchiveSubTeamResponse {
	success: boolean;
	error?: string;
}

// ============================================================
// Server Actions
// ============================================================

/**
 * Archive a sub-team (set status to 'archived')
 *
 * Authorization: Only the creator or team admin can archive
 */
export async function archiveSubTeamAction(
	subTeamId: string,
): Promise<ArchiveSubTeamResponse> {
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
				status: true,
				deletedAt: true,
			},
		});

		if (!existingSubTeam) {
			return { success: false, error: "Sub-equipo no encontrado" };
		}

		if (existingSubTeam.deletedAt) {
			return { success: false, error: "Este sub-equipo ha sido eliminado" };
		}

		if (existingSubTeam.status === "archived") {
			return { success: false, error: "Este sub-equipo ya está archivado" };
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
					"Solo el creador o un administrador puede archivar este sub-equipo",
			};
		}

		// 4. Archive
		await prisma.subTeam.update({
			where: { id: subTeamId },
			data: {
				status: "archived",
				updatedAt: new Date(),
			},
		});

		// 5. Revalidate paths
		revalidatePath(`/dashboard/team/${existingSubTeam.parentTeamId}/sub-teams`);
		revalidatePath(
			`/dashboard/team/${existingSubTeam.parentTeamId}/sub-teams/${subTeamId}`,
		);

		return { success: true };
	} catch (error) {
		console.error("Error archiving sub-team:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Error al archivar el sub-equipo",
		};
	}
}

/**
 * Restore an archived sub-team (set status to 'active')
 *
 * Authorization: Only the creator or team admin can restore
 */
export async function restoreSubTeamAction(
	subTeamId: string,
): Promise<ArchiveSubTeamResponse> {
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
				status: true,
				deletedAt: true,
			},
		});

		if (!existingSubTeam) {
			return { success: false, error: "Sub-equipo no encontrado" };
		}

		if (existingSubTeam.deletedAt) {
			return {
				success: false,
				error: "Este sub-equipo ha sido eliminado permanentemente",
			};
		}

		if (existingSubTeam.status === "active") {
			return { success: false, error: "Este sub-equipo ya está activo" };
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
					"Solo el creador o un administrador puede restaurar este sub-equipo",
			};
		}

		// 4. Restore
		await prisma.subTeam.update({
			where: { id: subTeamId },
			data: {
				status: "active",
				updatedAt: new Date(),
			},
		});

		// 5. Revalidate paths
		revalidatePath(`/dashboard/team/${existingSubTeam.parentTeamId}/sub-teams`);
		revalidatePath(
			`/dashboard/team/${existingSubTeam.parentTeamId}/sub-teams/${subTeamId}`,
		);

		return { success: true };
	} catch (error) {
		console.error("Error restoring sub-team:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Error al restaurar el sub-equipo",
		};
	}
}
