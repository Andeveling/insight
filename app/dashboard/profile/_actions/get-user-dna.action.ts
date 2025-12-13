"use server";

import { headers } from "next/headers";
import type { UserDnaData } from "@/lib/types";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

export async function getUserDna(): Promise<UserDnaData | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const dna = await prisma.userDNA.findUnique({
    where: { userId: session.user.id },
  });

  if (!dna) return null;

  try {
    return {
      title: dna.title,
      summary: dna.summary,
      dimensions: JSON.parse(dna.dimensions),
      synergies: JSON.parse(dna.synergies),
      idealRole: JSON.parse(dna.idealRole),
      purpose: dna.purpose,
    };
  } catch (e) {
    console.error("Error parsing User DNA JSON", e);
    return null;
  }
}
