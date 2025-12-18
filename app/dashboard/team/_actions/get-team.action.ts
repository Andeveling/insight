"use server";

/**
 * Get Team By Name Action
 *
 * Fetches a team from the database by its name
 */

import { connection } from "next/server";
import { prisma } from "@/lib/prisma.db";

export async function getTeamByName(name: string) {
	await connection();

	return await prisma.team.findUnique({
		where: { name },
	});
}
