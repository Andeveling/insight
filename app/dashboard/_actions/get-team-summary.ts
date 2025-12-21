"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

export interface TeamMemberSummary {
	id: string;
	name: string;
	image: string | null;
	primaryStrength: {
		nameEs: string;
		domainKey: string;
	} | null;
}

export interface TeamSummaryResult {
	hasTeam: boolean;
	teamId: string | null;
	memberCount: number;
	members: TeamMemberSummary[];
}

/**
 * Get team summary for dashboard
 */
export async function getTeamSummary(): Promise<TeamSummaryResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		return {
			hasTeam: false,
			teamId: null,
			memberCount: 0,
			members: [],
		};
	}

	// Get user's team membership
	const membership = await prisma.teamMember.findFirst({
		where: { userId: session.user.id },
		include: {
			team: {
				include: {
					members: {
						include: {
							user: {
								include: {
									userStrengths: {
										where: { rank: 1 },
										include: {
											strength: {
												include: { domain: true },
											},
										},
									},
								},
							},
						},
						take: 5, // Limit to 5 members for preview
					},
				},
			},
		},
	});

	if (!membership) {
		return {
			hasTeam: false,
			teamId: null,
			memberCount: 0,
			members: [],
		};
	}

	// Get total member count
	const totalCount = await prisma.teamMember.count({
		where: { teamId: membership.teamId },
	});

	return {
		hasTeam: true,
		teamId: membership.teamId,
		memberCount: totalCount,
		members: membership.team.members.map((m) => {
			const primaryStrength = m.user.userStrengths[0];
			return {
				id: m.userId,
				name: m.user.name,
				image: m.user.image,
				primaryStrength: primaryStrength
					? {
							nameEs: primaryStrength.strength.nameEs,
							domainKey: primaryStrength.strength.domain.name,
						}
					: null,
			};
		}),
	};
}
