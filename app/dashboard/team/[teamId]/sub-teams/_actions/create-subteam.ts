/**
 * Server Action: Create SubTeam
 *
 * Creates a new sub-team with member assignment and match score calculation.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_actions/create-subteam
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma.db';
import { createSubTeam as createSubTeamService } from '@/lib/services/subteam.service';
import type { ActionResponse, CreateSubTeamInput } from '@/lib/types';

import { createSubTeamSchema } from '@/app/dashboard/team/[teamId]/sub-teams/_schemas/subteam.schema';

/**
 * Create a new sub-team
 *
 * @param input - Sub-team creation data
 * @returns Success response with created sub-team ID or error
 */
export async function createSubTeam(
  input: CreateSubTeamInput
): Promise<ActionResponse<{ id: string; matchScore: number | null }>> {
  try {
    // Get session
    const session = await getSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Debes iniciar sesión para crear un sub-equipo',
        code: 'UNAUTHORIZED',
      };
    }

    // Validate input
    const validationResult = createSubTeamSchema.safeParse(input);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[ 0 ];
      return {
        success: false,
        error: firstError?.message || 'Datos de entrada inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    // Check user is member of the parent team
    const teamMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: input.parentTeamId,
        userId: session.user.id,
      },
    });

    if (!teamMembership) {
      return {
        success: false,
        error: 'No tienes permiso para crear sub-equipos en este equipo',
        code: 'FORBIDDEN',
      };
    }

    // Verify all members belong to the parent team
    const memberCount = await prisma.teamMember.count({
      where: {
        teamId: input.parentTeamId,
        userId: { in: input.members },
      },
    });

    if (memberCount !== input.members.length) {
      return {
        success: false,
        error: 'Algunos miembros no pertenecen al equipo',
        code: 'VALIDATION_ERROR',
      };
    }

    // Create sub-team
    const result = await createSubTeamService(input, session.user.id);

    // Revalidate cache for the sub-teams list
    revalidatePath(`/dashboard/team/${input.parentTeamId}/sub-teams`);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error creating sub-team:', error);
    return {
      success: false,
      error: 'Error al crear el sub-equipo. Por favor, intenta de nuevo.',
      code: 'INTERNAL_ERROR',
    };
  }
}

/**
 * Form action wrapper with redirect
 *
 * @param formData - Form data from the sub-team creation form
 */
export async function createSubTeamWithRedirect(formData: FormData): Promise<void> {
  const parentTeamId = formData.get('parentTeamId') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string | null;
  const projectTypeProfileId = formData.get('projectTypeProfileId') as string;
  const membersJson = formData.get('members') as string;

  const members = JSON.parse(membersJson) as string[];

  const result = await createSubTeam({
    parentTeamId,
    name,
    description: description || undefined,
    projectTypeProfileId,
    members,
  });

  if (result.success) {
    redirect(`/dashboard/team/${parentTeamId}/sub-teams/${result.data.id}`);
  }
}
