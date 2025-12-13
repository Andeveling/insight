/**
 * Server Action: Calculate Match Score
 *
 * Calculates match score for a given member selection and project type.
 * Used for real-time preview during sub-team creation/editing.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_actions/calculate-match-score
 */

'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma.db';
import type { ActionResponse, MatchScoreResult } from '@/lib/types';
import type { ProjectType } from '@/lib/types/project-type.types';

import { calculateMatchScore as calculateScore } from '@/lib/utils/subteam/match-score-calculator';
import type { MemberStrengthData } from '@/lib/utils/subteam/strength-coverage';

/**
 * Input for match score calculation
 */
export interface CalculateMatchScoreInput {
  memberIds: string[];
  projectTypeProfileId: string;
  teamId: string;
}

/**
 * Calculate match score for a member selection
 *
 * @param input - Member IDs, project type profile ID, and team ID
 * @returns Match score result or error
 */
export async function calculateMatchScore(
  input: CalculateMatchScoreInput
): Promise<ActionResponse<MatchScoreResult>> {
  try {
    // Get session
    const session = await getSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Debes iniciar sesión para calcular el match score',
        code: 'UNAUTHORIZED',
      };
    }

    // Validate minimum members
    if (input.memberIds.length < 2) {
      return {
        success: false,
        error: 'Se requieren al menos 2 miembros para calcular el match score',
        code: 'VALIDATION_ERROR',
      };
    }

    // Validate maximum members
    if (input.memberIds.length > 10) {
      return {
        success: false,
        error: 'El máximo de miembros permitido es 10',
        code: 'VALIDATION_ERROR',
      };
    }

    // Check user is member of the team
    const teamMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: input.teamId,
        userId: session.user.id,
      },
    });

    if (!teamMembership) {
      return {
        success: false,
        error: 'No tienes permiso para acceder a este equipo',
        code: 'FORBIDDEN',
      };
    }

    // Get project type profile
    const projectTypeProfile = await prisma.projectTypeProfile.findUnique({
      where: { id: input.projectTypeProfileId },
    });

    if (!projectTypeProfile) {
      return {
        success: false,
        error: 'Tipo de proyecto no encontrado',
        code: 'NOT_FOUND',
      };
    }

    // Get member data with strengths
    const memberData = await getMemberStrengthData(input.memberIds);

    if (memberData.length !== input.memberIds.length) {
      return {
        success: false,
        error: 'Algunos miembros no tienen fortalezas configuradas',
        code: 'VALIDATION_ERROR',
      };
    }

    // Parse project type for calculation
    const projectType = {
      type: projectTypeProfile.type as ProjectType,
      name: projectTypeProfile.name,
      nameEs: projectTypeProfile.nameEs,
      idealStrengths: JSON.parse(projectTypeProfile.idealStrengths),
      criticalDomains: JSON.parse(projectTypeProfile.criticalDomains),
      cultureFit: JSON.parse(projectTypeProfile.cultureFit),
      description: projectTypeProfile.description,
      descriptionEs: projectTypeProfile.descriptionEs,
      icon: projectTypeProfile.icon,
      characteristics: projectTypeProfile.characteristics
        ? JSON.parse(projectTypeProfile.characteristics)
        : [],
      characteristicsEs: projectTypeProfile.characteristicsEs
        ? JSON.parse(projectTypeProfile.characteristicsEs)
        : [],
    };

    // Calculate match score
    const result = calculateScore(memberData, projectType);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error calculating match score:', error);
    return {
      success: false,
      error: 'Error al calcular el match score. Por favor, intenta de nuevo.',
      code: 'INTERNAL_ERROR',
    };
  }
}

/**
 * Get member strength data for calculation
 */
async function getMemberStrengthData(memberIds: string[]): Promise<MemberStrengthData[]> {
  const users = await prisma.user.findMany({
    where: {
      id: { in: memberIds },
    },
    include: {
      userStrengths: {
        orderBy: { rank: 'asc' },
        include: {
          strength: {
            include: {
              domain: true,
            },
          },
        },
      },
    },
  });

  return users
    .filter((user) => user.userStrengths.length > 0)
    .map((user) => ({
      userId: user.id,
      strengths: user.userStrengths.map((us) => ({
        name: us.strength.name,
        nameEs: us.strength.nameEs,
        rank: us.rank,
        domain: us.strength.domain.name,
      })),
    }));
}
