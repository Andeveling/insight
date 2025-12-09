"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { profileSchema, ProfileFormValues } from "../_schemas/profile.schema";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: ProfileFormValues) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validated = profileSchema.parse(data);

  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      career: validated.career,
      age: validated.age,
      gender: validated.gender,
      description: validated.description,
      hobbies: validated.hobbies ? JSON.stringify(validated.hobbies) : undefined,
    },
    update: {
      career: validated.career,
      age: validated.age,
      gender: validated.gender,
      description: validated.description,
      hobbies: validated.hobbies ? JSON.stringify(validated.hobbies) : undefined,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}
