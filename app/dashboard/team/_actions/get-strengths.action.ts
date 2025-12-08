"use server";

/**
 * Get All Strengths Action
 *
 * Fetches all strengths from the database with their domain information
 */

import { connection } from "next/server";
import type {
  DomainType,
  StrengthWithDomain,
} from "@/app/_shared/types/strength.types";
import { prisma } from "@/lib/prisma.db";

export async function getAllStrengths(): Promise<StrengthWithDomain[]> {
  await connection();

  const strengths = await prisma.strength.findMany({
    include: {
      domain: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return strengths.map((s) => ({
    id: s.id,
    name: s.name,
    nameEs: s.nameEs,
    domain: s.domain.name as DomainType,
    briefDefinition: s.briefDefinition,
    fullDefinition: s.fullDefinition,
    howToUseMoreEffectively: s.howToUseMoreEffectively
      ? JSON.parse(s.howToUseMoreEffectively)
      : undefined,
    watchOuts: s.watchOuts ? JSON.parse(s.watchOuts) : undefined,
    strengthsDynamics: s.strengthsDynamics ?? undefined,
    bestPartners: s.bestPartners ? JSON.parse(s.bestPartners) : undefined,
    careerApplications: s.careerApplications
      ? JSON.parse(s.careerApplications)
      : undefined,
  }));
}
