"use server";

/**
 * Get Team Members With Strengths Action
 *
 * Fetches all team members with their ranked strengths
 */

import { connection } from "next/server";
import type { DomainType, TeamMemberWithStrengths } from "@/lib/types";
import { prisma } from "@/lib/prisma.db";

export async function getTeamMembersWithStrengths(
	teamId: string,
): Promise<TeamMemberWithStrengths[]> {
	await connection();

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
	}));
}
