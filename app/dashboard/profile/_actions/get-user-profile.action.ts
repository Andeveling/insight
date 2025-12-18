"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { ProfileFormValues } from "../_schemas/profile.schema";

export async function getUserProfile(): Promise<ProfileFormValues | null> {
	const session = await getSession();

	if (!session?.user?.id) {
		return null;
	}

	const profile = await prisma.userProfile.findUnique({
		where: { userId: session.user.id },
	});

	if (!profile) return null;

	let hobbies: string[] = [];
	try {
		if (profile.hobbies) {
			hobbies = JSON.parse(profile.hobbies);
		}
	} catch (e) {
		console.error("Failed to parse hobbies JSON", e);
	}

	return {
		career: profile.career ?? undefined,
		age: profile.age ?? undefined,
		gender: (profile.gender as "M" | "F" | "O") ?? undefined,
		description: profile.description ?? undefined,
		hobbies,
	};
}
