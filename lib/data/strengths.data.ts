import { prisma } from "@/lib/prisma.db";
import type {
  TeamMemberWithStrengths,
  StrengthWithDomain,
  UserStrengthRanked,
} from "@/app/_shared/types/strength.types";

/**
 * Fetch a user with their strengths
 */
export async function getUserWithStrengths(
  userId: string
): Promise<TeamMemberWithStrengths | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userStrengths: {
        include: {
          strength: {
            include: {
              domain: true,
            },
          },
        },
        orderBy: {
          rank: "asc",
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? undefined,
    strengths: user.userStrengths.map((us) => ({
      strengthId: us.strengthId,
      rank: us.rank,
      strength: {
        id: us.strength.id,
        name: us.strength.name,
        nameEs: us.strength.nameEs,
        domain: us.strength.domain.name as any,
        briefDefinition: us.strength.briefDefinition,
        fullDefinition: us.strength.fullDefinition,
        howToUseMoreEffectively: us.strength.howToUseMoreEffectively
          ? JSON.parse(us.strength.howToUseMoreEffectively)
          : undefined,
        watchOuts: us.strength.watchOuts
          ? JSON.parse(us.strength.watchOuts)
          : undefined,
        strengthsDynamics: us.strength.strengthsDynamics ?? undefined,
        bestPartners: us.strength.bestPartners
          ? JSON.parse(us.strength.bestPartners)
          : undefined,
        careerApplications: us.strength.careerApplications
          ? JSON.parse(us.strength.careerApplications)
          : undefined,
      },
    })),
  };
}

/**
 * Fetch a user by email with their strengths
 */
export async function getUserByEmailWithStrengths(
  email: string
): Promise<TeamMemberWithStrengths | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userStrengths: {
        include: {
          strength: {
            include: {
              domain: true,
            },
          },
        },
        orderBy: {
          rank: "asc",
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? undefined,
    strengths: user.userStrengths.map((us) => ({
      strengthId: us.strengthId,
      rank: us.rank,
      strength: {
        id: us.strength.id,
        name: us.strength.name,
        nameEs: us.strength.nameEs,
        domain: us.strength.domain.name as any,
        briefDefinition: us.strength.briefDefinition,
        fullDefinition: us.strength.fullDefinition,
        howToUseMoreEffectively: us.strength.howToUseMoreEffectively
          ? JSON.parse(us.strength.howToUseMoreEffectively)
          : undefined,
        watchOuts: us.strength.watchOuts
          ? JSON.parse(us.strength.watchOuts)
          : undefined,
        strengthsDynamics: us.strength.strengthsDynamics ?? undefined,
        bestPartners: us.strength.bestPartners
          ? JSON.parse(us.strength.bestPartners)
          : undefined,
        careerApplications: us.strength.careerApplications
          ? JSON.parse(us.strength.careerApplications)
          : undefined,
      },
    })),
  };
}

/**
 * Fetch all team members with their strengths
 */
export async function getTeamMembersWithStrengths(
  teamId: string
): Promise<TeamMemberWithStrengths[]> {
  const teamMembers = await prisma.teamMember.findMany({
    where: { teamId },
    include: {
      user: {
        include: {
          userStrengths: {
            include: {
              strength: {
                include: {
                  domain: true,
                },
              },
            },
            orderBy: {
              rank: "asc",
            },
          },
        },
      },
    },
  });

  return teamMembers.map((tm) => ({
    id: tm.user.id,
    name: tm.user.name,
    email: tm.user.email,
    image: tm.user.image ?? undefined,
    strengths: tm.user.userStrengths.map((us) => ({
      strengthId: us.strengthId,
      rank: us.rank,
      strength: {
        id: us.strength.id,
        name: us.strength.name,
        nameEs: us.strength.nameEs,
        domain: us.strength.domain.name as any,
        briefDefinition: us.strength.briefDefinition,
        fullDefinition: us.strength.fullDefinition,
        howToUseMoreEffectively: us.strength.howToUseMoreEffectively
          ? JSON.parse(us.strength.howToUseMoreEffectively)
          : undefined,
        watchOuts: us.strength.watchOuts
          ? JSON.parse(us.strength.watchOuts)
          : undefined,
        strengthsDynamics: us.strength.strengthsDynamics ?? undefined,
        bestPartners: us.strength.bestPartners
          ? JSON.parse(us.strength.bestPartners)
          : undefined,
        careerApplications: us.strength.careerApplications
          ? JSON.parse(us.strength.careerApplications)
          : undefined,
      },
    })),
  }));
}

/**
 * Fetch team by name
 */
export async function getTeamByName(name: string) {
  return await prisma.team.findUnique({
    where: { name },
  });
}
