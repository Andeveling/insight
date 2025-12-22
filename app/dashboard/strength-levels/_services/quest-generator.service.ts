/**
 * Quest Generator Service
 *
 * Generates daily quests for users based on their configured strengths.
 * Selects random quest templates from the database and creates QuestCompletion entries.
 */

import { addHours, endOfDay, startOfDay } from "date-fns";
import type {
	Quest,
	QuestCompletion,
	Strength,
} from "@/generated/prisma/client";
import { QuestStatus, QuestType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma.db";

/**
 * Configuration for quest generation
 */
const QUEST_CONFIG = {
	/** Maximum number of daily quests per user per day */
	DAILY_QUESTS_PER_DAY: 3,
	/** Default XP reward for daily quests */
	DEFAULT_DAILY_XP: 50,
	/** Hours until daily quest expires (from generation) */
	DAILY_QUEST_EXPIRY_HOURS: 24,
} as const;

export interface GeneratedQuest {
	questId: string;
	questCompletionId: string;
	strengthId: string;
	strengthName: string;
	type: QuestType;
	title: string;
	description: string;
	xpReward: number;
	difficulty: number;
	icon: string;
	expiresAt: Date;
}

export interface GenerateDailyQuestsResult {
	success: boolean;
	quests: GeneratedQuest[];
	error?: string;
}

/**
 * Get user's strength IDs from their UserStrength records
 */
async function getUserStrengthIds(userId: string): Promise<string[]> {
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId },
		select: { strengthId: true },
	});

	return userStrengths.map((us) => us.strengthId);
}

/**
 * Get existing active quests for user (not expired, not completed)
 */
async function getExistingActiveQuests(
	userId: string,
): Promise<(QuestCompletion & { quest: Quest })[]> {
	const now = new Date();

	return prisma.questCompletion.findMany({
		where: {
			userId,
			status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
			OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
		},
		include: {
			quest: true,
		},
	});
}

/**
 * Get available quest templates for given strength IDs
 */
async function getAvailableQuestTemplates(
	strengthIds: string[],
	type: QuestType,
	excludeQuestIds: string[] = [],
): Promise<(Quest & { strength: Strength })[]> {
	return prisma.quest.findMany({
		where: {
			strengthId: { in: strengthIds },
			type,
			isActive: true,
			id: excludeQuestIds.length > 0 ? { notIn: excludeQuestIds } : undefined,
		},
		include: {
			strength: true,
		},
	});
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Select random quests with variety (prefer different strengths)
 */
function selectQuestsWithVariety(
	templates: (Quest & { strength: Strength })[],
	count: number,
): (Quest & { strength: Strength })[] {
	// Group by strength
	const byStrength = new Map<string, (Quest & { strength: Strength })[]>();

	for (const template of templates) {
		const existing = byStrength.get(template.strengthId) || [];
		existing.push(template);
		byStrength.set(template.strengthId, existing);
	}

	// Shuffle strength groups
	const strengthGroups = shuffleArray([...byStrength.values()]);

	const selected: (Quest & { strength: Strength })[] = [];
	let groupIndex = 0;

	// Round-robin selection from different strength groups
	while (selected.length < count && strengthGroups.some((g) => g.length > 0)) {
		const group = strengthGroups[groupIndex % strengthGroups.length];

		if (group.length > 0) {
			const randomIndex = Math.floor(Math.random() * group.length);
			selected.push(group.splice(randomIndex, 1)[0]);
		}

		groupIndex++;
	}

	return selected;
}

/**
 * Generate daily quests for a user
 *
 * @param userId - User ID to generate quests for
 * @returns Generated quests with their QuestCompletion IDs
 */
export async function generateDailyQuestsForUser(
	userId: string,
): Promise<GenerateDailyQuestsResult> {
	try {
		// Get user's configured strengths
		const strengthIds = await getUserStrengthIds(userId);

		if (strengthIds.length === 0) {
			return {
				success: false,
				quests: [],
				error: "Usuario no tiene fortalezas configuradas",
			};
		}

		// Get existing active quests to avoid duplicates
		const existingQuests = await getExistingActiveQuests(userId);
		const existingQuestIds = existingQuests.map((eq) => eq.questId);

		// Count how many daily quests user already has today
		const today = new Date();
		const todayStart = startOfDay(today);
		const todayEnd = endOfDay(today);

		const dailyQuestsToday = existingQuests.filter((eq) => {
			if (eq.quest.type !== QuestType.DAILY) return false;
			if (!eq.createdAt) return false;
			return eq.createdAt >= todayStart && eq.createdAt <= todayEnd;
		});

		const questsNeeded = Math.max(
			0,
			QUEST_CONFIG.DAILY_QUESTS_PER_DAY - dailyQuestsToday.length,
		);

		if (questsNeeded === 0) {
			return {
				success: true,
				quests: [],
				error: "Usuario ya tiene misiones diarias para hoy",
			};
		}

		// Get available quest templates
		const templates = await getAvailableQuestTemplates(
			strengthIds,
			QuestType.DAILY,
			existingQuestIds,
		);

		if (templates.length === 0) {
			return {
				success: false,
				quests: [],
				error:
					"No hay plantillas de misiones disponibles para las fortalezas del usuario",
			};
		}

		// Select random quests with variety
		const selectedTemplates = selectQuestsWithVariety(templates, questsNeeded);

		// Calculate expiration time
		const expiresAt = addHours(today, QUEST_CONFIG.DAILY_QUEST_EXPIRY_HOURS);

		// Create QuestCompletion entries
		const generatedQuests: GeneratedQuest[] = [];

		for (const template of selectedTemplates) {
			const questCompletion = await prisma.questCompletion.create({
				data: {
					userId,
					questId: template.id,
					status: QuestStatus.AVAILABLE,
					expiresAt,
				},
			});

			generatedQuests.push({
				questId: template.id,
				questCompletionId: questCompletion.id,
				strengthId: template.strengthId,
				strengthName: template.strength.name,
				type: template.type,
				title: template.title,
				description: template.description,
				xpReward: template.xpReward,
				difficulty: template.difficulty,
				icon: template.icon,
				expiresAt,
			});
		}

		return {
			success: true,
			quests: generatedQuests,
		};
	} catch (error) {
		console.error("[QuestGenerator] Error generating daily quests:", error);
		return {
			success: false,
			quests: [],
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}

/**
 * Get active quests for a user (available + in progress, not expired)
 */
export async function getActiveQuestsForUser(userId: string): Promise<{
	dailyQuests: (QuestCompletion & { quest: Quest & { strength: Strength } })[];
	bossQuests: (QuestCompletion & { quest: Quest & { strength: Strength } })[];
	comboQuests: (QuestCompletion & { quest: Quest & { strength: Strength } })[];
	coopQuests: (QuestCompletion & { quest: Quest & { strength: Strength } })[];
}> {
	const now = new Date();

	const quests = await prisma.questCompletion.findMany({
		where: {
			userId,
			status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
			OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
		},
		include: {
			quest: {
				include: {
					strength: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return {
		dailyQuests: quests.filter((q) => q.quest.type === QuestType.DAILY),
		bossQuests: quests.filter((q) => q.quest.type === QuestType.BOSS_BATTLE),
		comboQuests: quests.filter((q) => q.quest.type === QuestType.COMBO_BREAKER),
		coopQuests: quests.filter((q) => q.quest.type === QuestType.COOPERATIVE),
	};
}

/**
 * Check if user has any quests expiring soon (within hours)
 */
export function getExpiringQuests(
	quests: (QuestCompletion & { quest: Quest })[],
	hoursThreshold: number = 2,
): (QuestCompletion & { quest: Quest })[] {
	const now = new Date();
	const threshold = addHours(now, hoursThreshold);

	return quests.filter((q) => {
		if (!q.expiresAt) return false;
		return q.expiresAt <= threshold && q.expiresAt > now;
	});
}

/**
 * Configuration for boss battles
 */
export const BOSS_CONFIG = {
	/** Minimum maturity level required to access Boss Battles */
	MIN_LEVEL: "CONNECTOR" as const,
	COOLDOWN_HOURS: 168, // 7 days
	/** Maximum boss battles available at once */
	MAX_BOSS_BATTLES: 1,
} as const;

export interface GeneratedBossBattle {
	questId: string;
	questCompletionId: string;
	strengthId: string;
	strengthName: string;
	type: QuestType;
	title: string;
	description: string;
	xpReward: number;
	difficulty: number;
	icon: string;
	cooldownUntil: Date | null;
}

export interface GenerateBossBattlesResult {
	success: boolean;
	bossBattles: GeneratedBossBattle[];
	error?: string;
}

/**
 * Generate boss battles for user based on eligible strengths
 *
 * Boss battles are only available for strengths at CONNECTOR level or higher.
 * Each boss battle has a 7-day cooldown after completion.
 *
 * @param userId - User ID to generate boss battles for
 * @returns Available boss battles
 */
export async function generateBossBattlesForUser(
	userId: string,
): Promise<GenerateBossBattlesResult> {
	try {
		// Get user's maturity levels that are CONNECTOR or higher
		const eligibleStrengths = await prisma.strengthMaturityLevel.findMany({
			where: {
				userId,
				currentLevel: { in: ["CONNECTOR", "GUIDE", "ALCHEMIST"] },
			},
			include: {
				strength: true,
			},
		});

		if (eligibleStrengths.length === 0) {
			return {
				success: true,
				bossBattles: [],
				error: "Usuario no tiene fortalezas en nivel Conector o superior",
			};
		}

		const eligibleStrengthIds = eligibleStrengths.map((s) => s.strengthId);
		const now = new Date();

		// Get existing active or recent boss battles
		// Calculate cooldown threshold (now - COOLDOWN_HOURS)
		const cooldownThreshold = new Date(
			now.getTime() - BOSS_CONFIG.COOLDOWN_HOURS * 60 * 60 * 1000,
		);

		const existingBossBattles = await prisma.questCompletion.findMany({
			where: {
				userId,
				quest: {
					type: QuestType.BOSS_BATTLE,
					strengthId: { in: eligibleStrengthIds },
				},
				OR: [
					// Active boss battles
					{
						status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
					},
					// Recently completed (in cooldown) - completedAt within cooldown period
					{
						status: QuestStatus.COMPLETED,
						completedAt: { gt: cooldownThreshold },
					},
				],
			},
			include: {
				quest: {
					include: { strength: true },
				},
			},
		});

		// Group by strength to check cooldowns
		const strengthsWithActiveBoss = new Set<string>();
		const strengthsInCooldown = new Map<string, Date>();

		for (const bb of existingBossBattles) {
			if (
				bb.status === QuestStatus.AVAILABLE ||
				bb.status === QuestStatus.IN_PROGRESS
			) {
				strengthsWithActiveBoss.add(bb.quest.strengthId);
			}
			if (bb.status === QuestStatus.COMPLETED && bb.completedAt) {
				// Calculate when cooldown ends: completedAt + COOLDOWN_HOURS
				const cooldownEnds = addHours(
					bb.completedAt,
					BOSS_CONFIG.COOLDOWN_HOURS,
				);
				if (cooldownEnds > now) {
					strengthsInCooldown.set(bb.quest.strengthId, cooldownEnds);
				}
			}
		}

		// Find strengths that don't have active boss battles and aren't in cooldown
		const availableStrengthIds = eligibleStrengthIds.filter(
			(id) => !strengthsWithActiveBoss.has(id) && !strengthsInCooldown.has(id),
		);

		if (availableStrengthIds.length === 0) {
			// Return existing active boss battles with cooldown info
			const activeBossBattles = existingBossBattles
				.filter(
					(bb) =>
						bb.status === QuestStatus.AVAILABLE ||
						bb.status === QuestStatus.IN_PROGRESS,
				)
				.map((bb) => ({
					questId: bb.quest.id,
					questCompletionId: bb.id,
					strengthId: bb.quest.strengthId,
					strengthName: bb.quest.strength.name,
					type: bb.quest.type,
					title: bb.quest.title,
					description: bb.quest.description,
					xpReward: bb.quest.xpReward,
					difficulty: bb.quest.difficulty,
					icon: bb.quest.icon,
					cooldownUntil: null,
				}));

			return {
				success: true,
				bossBattles: activeBossBattles,
			};
		}

		// Get boss battle templates for available strengths
		const bossTemplates = await prisma.quest.findMany({
			where: {
				strengthId: { in: availableStrengthIds },
				type: QuestType.BOSS_BATTLE,
				isActive: true,
			},
			include: {
				strength: true,
			},
		});

		if (bossTemplates.length === 0) {
			return {
				success: true,
				bossBattles: [],
			};
		}

		// Select one boss battle per strength (up to MAX_BOSS_BATTLES)
		const selectedByStrength = new Map<string, (typeof bossTemplates)[0]>();
		const shuffledTemplates = shuffleArray(bossTemplates);

		for (const template of shuffledTemplates) {
			if (!selectedByStrength.has(template.strengthId)) {
				selectedByStrength.set(template.strengthId, template);
			}
			if (selectedByStrength.size >= BOSS_CONFIG.MAX_BOSS_BATTLES) break;
		}

		// Create QuestCompletion entries
		const generatedBossBattles: GeneratedBossBattle[] = [];

		for (const template of selectedByStrength.values()) {
			const questCompletion = await prisma.questCompletion.create({
				data: {
					userId,
					questId: template.id,
					status: QuestStatus.AVAILABLE,
					// Boss battles don't expire, but have cooldowns after completion
					expiresAt: null,
				},
			});

			generatedBossBattles.push({
				questId: template.id,
				questCompletionId: questCompletion.id,
				strengthId: template.strengthId,
				strengthName: template.strength.name,
				type: template.type,
				title: template.title,
				description: template.description,
				xpReward: template.xpReward,
				difficulty: template.difficulty,
				icon: template.icon,
				cooldownUntil: null,
			});
		}

		return {
			success: true,
			bossBattles: generatedBossBattles,
		};
	} catch (error) {
		console.error("[QuestGenerator] Error generating boss battles:", error);
		return {
			success: false,
			bossBattles: [],
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}

/**
 * Get all boss battles for a user (active, cooldowns, available)
 */
export async function getBossBattlesForUser(userId: string): Promise<{
	active: GeneratedBossBattle[];
	inCooldown: {
		strengthId: string;
		strengthName: string;
		cooldownUntil: Date;
	}[];
	availableStrengths: string[];
}> {
	const now = new Date();

	// Get user's maturity levels that meet minimum
	const eligibleStrengths = await prisma.strengthMaturityLevel.findMany({
		where: {
			userId,
			currentLevel: { in: ["CONNECTOR", "GUIDE", "ALCHEMIST"] },
		},
		include: {
			strength: true,
		},
	});

	if (eligibleStrengths.length === 0) {
		return {
			active: [],
			inCooldown: [],
			availableStrengths: [],
		};
	}

	const eligibleStrengthIds = eligibleStrengths.map((s) => s.strengthId);

	// Get all boss battle completions
	const bossBattles = await prisma.questCompletion.findMany({
		where: {
			userId,
			quest: {
				type: QuestType.BOSS_BATTLE,
				strengthId: { in: eligibleStrengthIds },
			},
		},
		include: {
			quest: {
				include: { strength: true },
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const active: GeneratedBossBattle[] = [];
	const inCooldown: {
		strengthId: string;
		strengthName: string;
		cooldownUntil: Date;
	}[] = [];
	const strengthsWithBoss = new Set<string>();

	for (const bb of bossBattles) {
		if (
			bb.status === QuestStatus.AVAILABLE ||
			bb.status === QuestStatus.IN_PROGRESS
		) {
			active.push({
				questId: bb.quest.id,
				questCompletionId: bb.id,
				strengthId: bb.quest.strengthId,
				strengthName: bb.quest.strength.name,
				type: bb.quest.type,
				title: bb.quest.title,
				description: bb.quest.description,
				xpReward: bb.quest.xpReward,
				difficulty: bb.quest.difficulty,
				icon: bb.quest.icon,
				cooldownUntil: null,
			});
			strengthsWithBoss.add(bb.quest.strengthId);
		} else if (bb.status === QuestStatus.COMPLETED && bb.completedAt) {
			// Calculate cooldown from completedAt
			const cooldownEnds = addHours(bb.completedAt, BOSS_CONFIG.COOLDOWN_HOURS);
			if (cooldownEnds > now && !strengthsWithBoss.has(bb.quest.strengthId)) {
				inCooldown.push({
					strengthId: bb.quest.strengthId,
					strengthName: bb.quest.strength.name,
					cooldownUntil: cooldownEnds,
				});
				strengthsWithBoss.add(bb.quest.strengthId);
			}
		}
	}

	const availableStrengths = eligibleStrengthIds.filter(
		(id) => !strengthsWithBoss.has(id),
	);

	return {
		active,
		inCooldown,
		availableStrengths,
	};
}
