"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { profileSchema, ProfileFormValues } from "../_schemas/profile.schema";

export async function updateProfile(
	data: ProfileFormValues,
): Promise<{ success: true }> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("NOT_AUTHENTICATED");
	}

	let validated: ProfileFormValues;
	try {
		validated = profileSchema.parse(data);
	} catch (error) {
		if (error instanceof ZodError) {
			throw new Error("INVALID_INPUT");
		}
		throw error;
	}

	await prisma.userProfile.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			career: validated.career,
			age: validated.age,
			gender: validated.gender,
			description: validated.description,
			hobbies: validated.hobbies
				? JSON.stringify(validated.hobbies)
				: undefined,
		},
		update: {
			career: validated.career,
			age: validated.age,
			gender: validated.gender,
			description: validated.description,
			hobbies: validated.hobbies
				? JSON.stringify(validated.hobbies)
				: undefined,
		},
	});

	revalidatePath("/dashboard/profile");
	return { success: true };
}
