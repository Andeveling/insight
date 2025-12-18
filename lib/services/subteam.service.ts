/**
 * SubTeam Service
 *
 * Service layer for sub-team CRUD operations and business logic.
 *
 * @module lib/services/subteam.service
 */

import { prisma } from "@/lib/prisma.db";
import type {
	CreateSubTeamInput,
	SubTeamDetail,
	SubTeamFilters,
	SubTeamListItem,
	SubTeamMember,
	SubTeamSortOption,
	UpdateSubTeamInput,
} from "@/lib/types";
import type {
	ProjectType,
	ProjectTypeOption,
} from "@/lib/types/project-type.types";

import { calculateMatchScore } from "@/lib/utils/subteam/match-score-calculator";
import type { MemberStrengthData } from "@/lib/utils/subteam/strength-coverage";

/**
 * Get list of sub-teams for a team
 */
export async function getSubTeamsList(
	teamId: string,
	filters?: SubTeamFilters,
	sort?: SubTeamSortOption,
): Promise<SubTeamListItem[]> {
	const where: Record<string, unknown> = {
		parentTeamId: teamId,
		deletedAt: null,
	};

	// Apply filters
	if (filters?.status && filters.status !== "all") {
		where.status = filters.status;
	}

	if (filters?.projectType) {
		where.projectTypeProfileId = filters.projectType;
	}

	if (
		filters?.minMatchScore !== undefined ||
		filters?.maxMatchScore !== undefined
	) {
		where.matchScore = {
			...(filters.minMatchScore !== undefined && {
				gte: filters.minMatchScore,
			}),
			...(filters.maxMatchScore !== undefined && {
				lte: filters.maxMatchScore,
			}),
		};
	}

	if (filters?.searchQuery) {
		where.name = { contains: filters.searchQuery };
	}

	// Determine sort order
	let orderBy: Record<string, string> = { createdAt: "desc" };
	if (sort) {
		const [field, direction] = sort.split("-") as [string, "asc" | "desc"];
		// Map sort fields to actual DB column names
		const fieldMap: Record<string, string> = {
			score: "matchScore",
			created: "createdAt",
		};
		orderBy = { [fieldMap[field] || field]: direction };
	}

	const subTeams = await prisma.subTeam.findMany({
		where,
		orderBy,
		select: {
			id: true,
			name: true,
			matchScore: true,
			members: true,
			status: true,
			createdAt: true,
			projectTypeProfile: {
				select: {
					id: true,
					name: true,
					nameEs: true,
					icon: true,
				},
			},
		},
	});

	return subTeams.map((st) => ({
		id: st.id,
		name: st.name,
		projectType: st.projectTypeProfile,
		matchScore: st.matchScore,
		memberCount: JSON.parse(st.members as string).length,
		status: st.status as "active" | "archived",
		createdAt: st.createdAt,
	}));
}

/**
 * Get detailed sub-team information
 */
export async function getSubTeamDetail(
	subTeamId: string,
): Promise<SubTeamDetail | null> {
	const subTeam = await prisma.subTeam.findUnique({
		where: { id: subTeamId },
		include: {
			parentTeam: {
				select: { id: true, name: true },
			},
			projectTypeProfile: true,
			creator: {
				select: { id: true, name: true, email: true },
			},
		},
	});

	if (!subTeam) return null;

	// Parse JSON fields
	const memberIds = JSON.parse(subTeam.members as string) as string[];
	const analysis = subTeam.analysis
		? JSON.parse(subTeam.analysis as string)
		: null;

	// Get member details with strengths
	const membersDetails = await getTeamMembersWithStrengths(memberIds);

	// Parse project type JSON fields
	const projectTypeProfile = {
		...subTeam.projectTypeProfile,
		type: subTeam.projectTypeProfile.type as ProjectType,
		idealStrengths: JSON.parse(subTeam.projectTypeProfile.idealStrengths),
		criticalDomains: JSON.parse(subTeam.projectTypeProfile.criticalDomains),
		cultureFit: JSON.parse(subTeam.projectTypeProfile.cultureFit),
		characteristics: subTeam.projectTypeProfile.characteristics
			? JSON.parse(subTeam.projectTypeProfile.characteristics)
			: [],
		characteristicsEs: subTeam.projectTypeProfile.characteristicsEs
			? JSON.parse(subTeam.projectTypeProfile.characteristicsEs)
			: [],
	};

	return {
		id: subTeam.id,
		parentTeamId: subTeam.parentTeamId,
		projectTypeProfileId: subTeam.projectTypeProfileId,
		name: subTeam.name,
		description: subTeam.description,
		members: memberIds,
		matchScore: subTeam.matchScore,
		analysis,
		status: subTeam.status as "active" | "archived",
		createdBy: subTeam.createdBy,
		createdAt: subTeam.createdAt,
		updatedAt: subTeam.updatedAt,
		deletedAt: subTeam.deletedAt,
		parentTeam: subTeam.parentTeam,
		projectTypeProfile,
		membersDetails,
		creator: subTeam.creator,
	};
}

/**
 * Get team members for sub-team member selector
 */
export async function getTeamMembersForSelector(
	teamId: string,
): Promise<SubTeamMember[]> {
	const teamMembers = await prisma.teamMember.findMany({
		where: { teamId },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
					userStrengths: {
						orderBy: { rank: "asc" },
						include: {
							strength: {
								select: {
									id: true,
									name: true,
									nameEs: true,
									domain: {
										select: { name: true, nameEs: true },
									},
								},
							},
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
		image: tm.user.image,
		strengths: tm.user.userStrengths.map((us) => ({
			id: us.strength.id,
			name: us.strength.name,
			nameEs: us.strength.nameEs,
			rank: us.rank,
			domain: us.strength.domain,
		})),
	}));
}

/**
 * Get all project type profiles for selector
 */
export async function getProjectTypeProfiles(): Promise<ProjectTypeOption[]> {
	const profiles = await prisma.projectTypeProfile.findMany({
		select: {
			id: true,
			type: true,
			name: true,
			nameEs: true,
			description: true,
			descriptionEs: true,
			icon: true,
		},
	});

	return profiles.map((p) => ({
		id: p.id,
		type: p.type as "innovation" | "execution" | "crisis" | "growth",
		name: p.name,
		nameEs: p.nameEs,
		description: p.description,
		descriptionEs: p.descriptionEs,
		icon: p.icon,
	}));
}

/**
 * Create a new sub-team
 */
export async function createSubTeam(
	input: CreateSubTeamInput,
	createdBy: string,
): Promise<{ id: string; matchScore: number | null }> {
	// Get project type profile for match score calculation
	const projectTypeProfile = await prisma.projectTypeProfile.findUnique({
		where: { id: input.projectTypeProfileId },
	});

	if (!projectTypeProfile) {
		throw new Error("Project type profile not found");
	}

	// Get member data for match score calculation
	const memberData = await getMemberStrengthData(input.members);

	// Parse project type for calculation
	const projectType = {
		type: projectTypeProfile.type as ProjectType,
		name: projectTypeProfile.name,
		nameEs: projectTypeProfile.nameEs,
		idealStrengths: JSON.parse(projectTypeProfile.idealStrengths),
		criticalDomains: JSON.parse(projectTypeProfile.criticalDomains),
		cultureFit: JSON.parse(projectTypeProfile.cultureFit),
		description: projectTypeProfile.description,
		descriptionEs: projectTypeProfile.descriptionEs,
		icon: projectTypeProfile.icon,
		characteristics: projectTypeProfile.characteristics
			? JSON.parse(projectTypeProfile.characteristics)
			: [],
		characteristicsEs: projectTypeProfile.characteristicsEs
			? JSON.parse(projectTypeProfile.characteristicsEs)
			: [],
	};

	// Calculate match score
	const matchScoreResult = calculateMatchScore(memberData, projectType);

	// Create sub-team
	const subTeam = await prisma.subTeam.create({
		data: {
			parentTeamId: input.parentTeamId,
			projectTypeProfileId: input.projectTypeProfileId,
			name: input.name,
			description: input.description,
			members: JSON.stringify(input.members),
			matchScore: matchScoreResult.totalScore,
			analysis: JSON.stringify({
				totalScore: matchScoreResult.totalScore,
				factors: matchScoreResult.factors,
				gaps: matchScoreResult.gaps,
				recommendations: matchScoreResult.recommendations,
				calculatedAt: new Date().toISOString(),
			}),
			createdBy,
		},
	});

	return { id: subTeam.id, matchScore: matchScoreResult.totalScore };
}

/**
 * Update an existing sub-team
 */
export async function updateSubTeam(
	input: UpdateSubTeamInput,
): Promise<{ id: string; matchScore: number | null }> {
	const existingSubTeam = await prisma.subTeam.findUnique({
		where: { id: input.id },
	});

	if (!existingSubTeam) {
		throw new Error("Sub-team not found");
	}

	// If members changed, recalculate match score
	let matchScore = existingSubTeam.matchScore;
	let analysis = existingSubTeam.analysis;

	if (input.members) {
		const projectTypeProfile = await prisma.projectTypeProfile.findUnique({
			where: {
				id: input.projectTypeProfileId || existingSubTeam.projectTypeProfileId,
			},
		});

		if (projectTypeProfile) {
			const memberData = await getMemberStrengthData(input.members);
			const projectType = {
				type: projectTypeProfile.type as ProjectType,
				name: projectTypeProfile.name,
				nameEs: projectTypeProfile.nameEs,
				idealStrengths: JSON.parse(projectTypeProfile.idealStrengths),
				criticalDomains: JSON.parse(projectTypeProfile.criticalDomains),
				cultureFit: JSON.parse(projectTypeProfile.cultureFit),
				description: projectTypeProfile.description,
				descriptionEs: projectTypeProfile.descriptionEs,
				icon: projectTypeProfile.icon,
				characteristics: projectTypeProfile.characteristics
					? JSON.parse(projectTypeProfile.characteristics)
					: [],
				characteristicsEs: projectTypeProfile.characteristicsEs
					? JSON.parse(projectTypeProfile.characteristicsEs)
					: [],
			};

			const matchScoreResult = calculateMatchScore(memberData, projectType);
			matchScore = matchScoreResult.totalScore;
			analysis = JSON.stringify({
				totalScore: matchScoreResult.totalScore,
				factors: matchScoreResult.factors,
				gaps: matchScoreResult.gaps,
				recommendations: matchScoreResult.recommendations,
				calculatedAt: new Date().toISOString(),
			});
		}
	}

	// Update sub-team
	const subTeam = await prisma.subTeam.update({
		where: { id: input.id },
		data: {
			...(input.name && { name: input.name }),
			...(input.description !== undefined && {
				description: input.description,
			}),
			...(input.members && { members: JSON.stringify(input.members) }),
			...(input.projectTypeProfileId && {
				projectTypeProfileId: input.projectTypeProfileId,
			}),
			matchScore,
			analysis,
		},
	});

	return { id: subTeam.id, matchScore };
}

/**
 * Archive (soft delete) a sub-team
 */
export async function archiveSubTeam(subTeamId: string): Promise<void> {
	await prisma.subTeam.update({
		where: { id: subTeamId },
		data: { status: "archived", deletedAt: new Date() },
	});
}

/**
 * Restore an archived sub-team
 */
export async function restoreSubTeam(subTeamId: string): Promise<void> {
	await prisma.subTeam.update({
		where: { id: subTeamId },
		data: { status: "active", deletedAt: null },
	});
}

/**
 * Permanently delete a sub-team
 */
export async function deleteSubTeam(subTeamId: string): Promise<void> {
	await prisma.subTeam.delete({
		where: { id: subTeamId },
	});
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get member strength data for match score calculation
 */
async function getMemberStrengthData(
	memberIds: string[],
): Promise<MemberStrengthData[]> {
	const users = await prisma.user.findMany({
		where: { id: { in: memberIds } },
		include: {
			userStrengths: {
				orderBy: { rank: "asc" },
				include: {
					strength: {
						select: {
							name: true,
							nameEs: true,
							domain: { select: { name: true } },
						},
					},
				},
			},
		},
	});

	return users.map((user) => ({
		userId: user.id,
		strengths: user.userStrengths.map((us) => ({
			name: us.strength.name,
			nameEs: us.strength.nameEs,
			rank: us.rank,
			domain: us.strength.domain.name,
		})),
	}));
}

/**
 * Get team members with their strengths
 */
async function getTeamMembersWithStrengths(
	memberIds: string[],
): Promise<SubTeamMember[]> {
	const users = await prisma.user.findMany({
		where: { id: { in: memberIds } },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			userStrengths: {
				orderBy: { rank: "asc" },
				include: {
					strength: {
						select: {
							id: true,
							name: true,
							nameEs: true,
							domain: {
								select: { name: true, nameEs: true },
							},
						},
					},
				},
			},
		},
	});

	return users.map((user) => ({
		id: user.id,
		name: user.name,
		email: user.email,
		image: user.image,
		strengths: user.userStrengths.map((us) => ({
			id: us.strength.id,
			name: us.strength.name,
			nameEs: us.strength.nameEs,
			rank: us.rank,
			domain: us.strength.domain,
		})),
	}));
}

/**
 * Suggested member that can fill a gap
 */
export interface SuggestedMemberForGap {
	member: SubTeamMember;
	fillsGaps: string[];
	scoreDelta: number;
}

/**
 * Get suggested team members who can fill strength gaps
 *
 * @param teamId - Parent team ID to find available members
 * @param currentMemberIds - IDs of members already in the sub-team
 * @param missingStrengths - Array of strength names that are missing
 * @param limit - Maximum number of suggestions to return
 * @returns Array of suggested members with gap coverage info
 */
export async function getSuggestedMembersForGap(
	teamId: string,
	currentMemberIds: string[],
	missingStrengths: string[],
	limit = 5,
): Promise<SuggestedMemberForGap[]> {
	if (missingStrengths.length === 0) return [];

	// Get all team members not currently in the sub-team
	const availableMembers = await prisma.teamMember.findMany({
		where: {
			teamId,
			userId: { notIn: currentMemberIds },
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
					userStrengths: {
						orderBy: { rank: "asc" },
						include: {
							strength: {
								select: {
									id: true,
									name: true,
									nameEs: true,
									domain: {
										select: { name: true, nameEs: true },
									},
								},
							},
						},
					},
				},
			},
		},
	});

	// Score each member based on how many gaps they can fill
	const suggestions: SuggestedMemberForGap[] = [];

	for (const tm of availableMembers) {
		const memberStrengths = tm.user.userStrengths.map((us) => us.strength.name);
		const fillsGaps = missingStrengths.filter((ms) =>
			memberStrengths.includes(ms),
		);

		if (fillsGaps.length > 0) {
			// Estimate score improvement (rough heuristic: 5 points per critical gap filled)
			const criticalGapsFilled = fillsGaps.length;
			const scoreDelta = criticalGapsFilled * 5;

			suggestions.push({
				member: {
					id: tm.user.id,
					name: tm.user.name,
					email: tm.user.email,
					image: tm.user.image,
					strengths: tm.user.userStrengths.map((us) => ({
						id: us.strength.id,
						name: us.strength.name,
						nameEs: us.strength.nameEs,
						rank: us.rank,
						domain: us.strength.domain,
					})),
				},
				fillsGaps,
				scoreDelta,
			});
		}
	}

	// Sort by number of gaps filled (descending), then by score delta
	suggestions.sort((a, b) => {
		if (b.fillsGaps.length !== a.fillsGaps.length) {
			return b.fillsGaps.length - a.fillsGaps.length;
		}
		return b.scoreDelta - a.scoreDelta;
	});

	return suggestions.slice(0, limit);
}
