"use server";

/**
 * Get User Team Action
 *
 * Fetches the team for the current authenticated user.
 * Returns the first team the user belongs to.
 */

import { connection } from "next/server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

export interface UserTeamInfo {
	id: string;
	name: string;
}

/**
 * Get the team of the current authenticated user
 * Returns null if user is not authenticated or has no team
 */
export async function getUserTeam(): Promise<UserTeamInfo | null> {
	await connection();

	const session = await getSession();

	if (!session?.user?.id) {
		return null;
	}

	// Get the first team the user belongs to
	const teamMembership = await prisma.teamMember.findFirst({
		where: {
			userId: session.user.id,
		},
		include: {
			team: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	if (!teamMembership?.team) {
		return null;
	}

	return {
		id: teamMembership.team.id,
		name: teamMembership.team.name,
	};
}
