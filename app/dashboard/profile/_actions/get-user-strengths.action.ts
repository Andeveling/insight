"use server";

/**
 * Profile Server Actions
 *
 * Secure server actions for fetching authenticated user profile data
 */

import type {
  DomainType,
  TeamMemberWithStrengths,
} from "@/app/_shared/types/strength.types";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

/**
 * Get Current Authenticated User With Strengths
 *
 * Securely fetches the authenticated user's profile with their ranked strengths.
 * Uses the session to identify the user - no external parameters needed.
 *
 * @returns The authenticated user with strengths, or null if not authenticated
 */
export async function getCurrentUserWithStrengths(): Promise<TeamMemberWithStrengths | null> {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  return getUserByEmailWithStrengthsInternal(session.user.email);
}

/**
 * Internal function to fetch user by email with strengths
 * Not exported directly - use getCurrentUserWithStrengths for authenticated access
 */
async function getUserByEmailWithStrengthsInternal(
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
