"use server";

/**
 * Get User By Email With Strengths Action
 *
 * Fetches a user from the database by email with their ranked strengths
 */

import type {
  DomainType,
  TeamMemberWithStrengths,
} from "@/app/_shared/types/strength.types";
import { prisma } from "@/lib/prisma.db";

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
        domain: us.strength.domain.name as DomainType,
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
