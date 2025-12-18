/**
 * Project Types Seeder
 *
 * Seeds the ProjectTypeProfile table with predefined project types.
 *
 * @module prisma/seeders/seed-project-types
 */

import { prisma } from "@/lib/prisma.db";
import { projectTypesData } from "../data/project-types.data";

/**
 * Seeds the ProjectTypeProfile table.
 * Uses upsert to handle both initial seeding and updates.
 */
export async function seedProjectTypes(): Promise<void> {
	console.log("🌱 Seeding project types...");

	for (const projectType of projectTypesData) {
		await prisma.projectTypeProfile.upsert({
			where: { type: projectType.type },
			update: {
				name: projectType.name,
				nameEs: projectType.nameEs,
				idealStrengths: projectType.idealStrengths,
				criticalDomains: projectType.criticalDomains,
				cultureFit: projectType.cultureFit,
				description: projectType.description,
				descriptionEs: projectType.descriptionEs,
				characteristics: projectType.characteristics,
				characteristicsEs: projectType.characteristicsEs,
				icon: projectType.icon,
			},
			create: projectType,
		});
	}

	const count = await prisma.projectTypeProfile.count();
	console.log(`✅ Project types seeded: ${count} profiles`);
}
