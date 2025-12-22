/**
 * Strength Levels Seeder
 *
 * Seeds initial data for the strength maturity system:
 * - Maturity level definitions (4 levels: Esponja, Conector, Guía, Alquimista)
 * - Quest templates (~60 missions across 20 strengths)
 * - Combo breaker definitions (4 combo types)
 */

import * as fs from "fs";
import * as path from "path";
import {
	type MaturityLevel,
	type PrismaClient,
	type QuestType,
} from "@/generated/prisma/client";

interface MaturityLevelSeed {
	level: MaturityLevel;
	name: string;
	description: string;
	minXp: number;
	maxXp: number | null;
	color: string;
	icon: string;
}

interface QuestTemplateSeed {
	strength: string;
	type: QuestType;
	title: string;
	description: string;
	xpReward: number;
	difficulty: number;
	cooldownHours?: number;
	icon: string;
}

interface ComboBreakerSeed {
	name: string;
	description: string;
	requiredCount: number;
	xpReward: number;
	cooldownHours: number;
	icon: string;
	strengths: string[][];
}

/**
 * Load JSON seed data files
 */
function loadSeedData<T>(filename: string): T[] {
	const filePath = path.join(
		process.cwd(),
		"prisma",
		"data",
		"strength-levels",
		filename,
	);
	const fileContent = fs.readFileSync(filePath, "utf-8");
	return JSON.parse(fileContent) as T[];
}

/**
 * Seed maturity level definitions
 */
async function seedMaturityLevels(prisma: PrismaClient) {
	console.log("🌱 Seeding maturity level definitions...");

	const maturityLevels = loadSeedData<MaturityLevelSeed>(
		"maturity-levels.json",
	);

	for (const level of maturityLevels) {
		await prisma.maturityLevelDefinition.upsert({
			where: { level: level.level },
			update: {
				name: level.name,
				description: level.description,
				minXp: level.minXp,
				maxXp: level.maxXp,
				color: level.color,
				icon: level.icon,
			},
			create: {
				level: level.level,
				name: level.name,
				description: level.description,
				minXp: level.minXp,
				maxXp: level.maxXp,
				color: level.color,
				icon: level.icon,
			},
		});
	}

	console.log(`✅ Seeded ${maturityLevels.length} maturity level definitions`);
}

/**
 * Seed quest templates
 */
async function seedQuestTemplates(prisma: PrismaClient) {
	console.log("🌱 Seeding quest templates...");

	const questTemplates = loadSeedData<QuestTemplateSeed>(
		"quest-templates.json",
	);

	// Get all strengths to map names to IDs
	const strengths = await prisma.strength.findMany({
		select: { id: true, name: true },
	});

	const strengthMap = new Map(strengths.map((s) => [s.name, s.id]));

	let createdCount = 0;

	for (const quest of questTemplates) {
		const strengthId = strengthMap.get(quest.strength);

		if (!strengthId) {
			console.warn(
				`⚠️ Strength not found: ${quest.strength} - skipping quest "${quest.title}"`,
			);
			continue;
		}

		// Use title + strengthId as unique identifier
		const existingQuest = await prisma.quest.findFirst({
			where: {
				strengthId,
				title: quest.title,
			},
		});

		if (existingQuest) {
			await prisma.quest.update({
				where: { id: existingQuest.id },
				data: {
					type: quest.type,
					description: quest.description,
					xpReward: quest.xpReward,
					difficulty: quest.difficulty,
					cooldownHours: quest.cooldownHours,
					icon: quest.icon,
					isActive: true,
				},
			});
		} else {
			await prisma.quest.create({
				data: {
					strengthId,
					type: quest.type,
					title: quest.title,
					description: quest.description,
					xpReward: quest.xpReward,
					difficulty: quest.difficulty,
					cooldownHours: quest.cooldownHours,
					requiresPartner: quest.type === "COOPERATIVE",
					icon: quest.icon,
					isActive: true,
				},
			});
			createdCount++;
		}
	}

	console.log(
		`✅ Seeded ${createdCount} quest templates (${questTemplates.length} total processed)`,
	);
}

/**
 * Seed combo breaker definitions
 */
export async function seedComboBreakers(prisma: PrismaClient) {
	console.log("🌱 Seeding combo breaker definitions...");

	const comboBreakers = loadSeedData<ComboBreakerSeed>("combo-breakers.json");

	// Get all strengths to map names to IDs
	const strengths = await prisma.strength.findMany({
		select: { id: true, name: true },
	});

	const strengthMap = new Map(strengths.map((s) => [s.name, s.id]));

	for (const combo of comboBreakers) {
		// Find or create combo breaker
		let comboBreaker = await prisma.comboBreaker.findFirst({
			where: { name: combo.name },
		});

		if (comboBreaker) {
			// Update existing
			comboBreaker = await prisma.comboBreaker.update({
				where: { id: comboBreaker.id },
				data: {
					description: combo.description,
					requiredCount: combo.requiredCount,
					xpReward: combo.xpReward,
					cooldownHours: combo.cooldownHours,
					icon: combo.icon,
					isActive: true,
				},
			});
		} else {
			// Create new
			comboBreaker = await prisma.comboBreaker.create({
				data: {
					name: combo.name,
					description: combo.description,
					requiredCount: combo.requiredCount,
					xpReward: combo.xpReward,
					cooldownHours: combo.cooldownHours,
					icon: combo.icon,
					isActive: true,
				},
			});
		}

		// Delete existing combo strengths for this combo
		await prisma.comboStrength.deleteMany({
			where: { comboBreakerId: comboBreaker.id },
		});

		// Create combo strength mappings for each valid combination
		for (const strengthNames of combo.strengths) {
			const strengthIds = strengthNames
				.map((name) => strengthMap.get(name))
				.filter((id): id is string => id !== undefined);

			if (strengthIds.length !== strengthNames.length) {
				const missing = strengthNames.filter((name) => !strengthMap.has(name));
				console.warn(
					`⚠️ Missing strengths for combo "${combo.name}": ${missing.join(", ")}`,
				);
				continue;
			}

			// Create junction records
			for (const strengthId of strengthIds) {
				await prisma.comboStrength.create({
					data: {
						comboBreakerId: comboBreaker.id,
						strengthId,
					},
				});
			}
		}
	}

	console.log(`✅ Seeded ${comboBreakers.length} combo breaker definitions`);
}

/**
 * Main seeder execution
 */
export async function seedStrengthLevels(prisma: PrismaClient) {
	try {
		await seedMaturityLevels(prisma);
		await seedQuestTemplates(prisma);
		// TODO: Fix combo breakers seeding logic - current data model needs revision
		// await seedComboBreakers(prisma);

		console.log("✨ Strength levels seeding completed successfully!");
		console.log(
			"⚠️  Note: Combo breakers seeding skipped - requires data model revision",
		);
	} catch (error) {
		console.error("❌ Error seeding strength levels:", error);
		throw error;
	}
}

// Note: This seeder is called from prisma/seed.ts main seeder
// No need for standalone execution with require.main check
