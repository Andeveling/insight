"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

export async function getTeamReportData() {
	const session = await getSession();

	if (!session?.user?.id) {
		return null;
	}

	const userId = session.user.id;

	const teamMember = await prisma.teamMember.findFirst({
		where: { userId },
		include: {
			team: {
				include: {
					members: {
						include: {
							user: {
								include: {
									profile: true,
									userStrengths: {
										include: {
											strength: {
												include: {
													domain: true,
												},
											},
										},
										orderBy: { rank: "asc" },
									},
								},
							},
						},
					},
				},
			},
		},
	});

	if (!teamMember) {
		return { teamMember: null };
	}

	const team = teamMember.team;

	const existingReport = await prisma.report.findFirst({
		where: {
			teamId: team.id,
			type: "TEAM_FULL",
			status: "COMPLETED",
		},
		orderBy: { version: "desc" },
	});

	const reportContent = existingReport?.content
		? JSON.parse(existingReport.content)
		: null;
	const reportMetadata = existingReport?.metadata
		? JSON.parse(existingReport.metadata)
		: null;
	const membersWithStrengths = team.members.filter(
		(m) => m.user.userStrengths.length > 0,
	);

	return {
		teamMember,
		team: {
			id: team.id,
			name: team.name,
			description: team.description,
			members: team.members.map((m) => ({
				id: m.user.id,
				name: m.user.name,
				role: m.role,
				career: m.user.profile?.career ?? null,
				hasStrengths: m.user.userStrengths.length > 0,
				strengths: m.user.userStrengths.map((us) => ({
					rank: us.rank,
					name: us.strength.name,
					domain: us.strength.domain.name,
				})),
			})),
		},
		membersWithStrengthsCount: membersWithStrengths.length,
		existingReport: existingReport
			? {
					id: existingReport.id,
					version: existingReport.version,
					createdAt: existingReport.createdAt,
					modelUsed: existingReport.modelUsed,
					content: reportContent,
					metadata: reportMetadata,
				}
			: null,
	};
}
