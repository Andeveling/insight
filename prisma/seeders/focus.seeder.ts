import focusData, { domainFocusMapping } from "../data/focus.data";
import type { PrismaClient } from "../../generated/prisma/client";

/**
 * Seeds Focus data and DomainFocus relationships
 *
 * Focus represents the two axes:
 * - Energy: Action ↔ Reflection
 * - Orientation: Results ↔ People
 *
 * Each Domain maps to one Focus per axis
 */
export async function seedFocus(prisma: PrismaClient) {
	console.log("🌱 Seeding focus axes...");

	// Create Focus entries
	const focusMap: Record<string, string> = {};

	for (const focus of focusData) {
		const created = await prisma.focus.upsert({
			where: { name: focus.name },
			update: {
				nameEs: focus.nameEs,
				axis: focus.axis,
				description: focus.description,
				icon: focus.icon,
			},
			create: {
				name: focus.name,
				nameEs: focus.nameEs,
				axis: focus.axis,
				description: focus.description,
				icon: focus.icon,
			},
		});
		focusMap[focus.name] = created.id;
	}

	console.log(`✅ Seeded ${focusData.length} focus axes`);

	// Create DomainFocus relationships
	console.log("🌱 Seeding domain-focus relationships...");

	const domains = await prisma.domain.findMany();
	let relationCount = 0;

	for (const domain of domains) {
		const mapping = domainFocusMapping[domain.name];
		if (!mapping) {
			console.warn(`⚠️ No focus mapping found for domain: ${domain.name}`);
			continue;
		}

		// Create energy axis relationship
		const energyFocusId = focusMap[mapping.energy];
		if (energyFocusId) {
			await prisma.domainFocus.upsert({
				where: {
					domainId_focusId: {
						domainId: domain.id,
						focusId: energyFocusId,
					},
				},
				update: { weight: 1.0 },
				create: {
					domainId: domain.id,
					focusId: energyFocusId,
					weight: 1.0,
				},
			});
			relationCount++;
		}

		// Create orientation axis relationship
		const orientationFocusId = focusMap[mapping.orientation];
		if (orientationFocusId) {
			await prisma.domainFocus.upsert({
				where: {
					domainId_focusId: {
						domainId: domain.id,
						focusId: orientationFocusId,
					},
				},
				update: { weight: 1.0 },
				create: {
					domainId: domain.id,
					focusId: orientationFocusId,
					weight: 1.0,
				},
			});
			relationCount++;
		}
	}

	console.log(`✅ Seeded ${relationCount} domain-focus relationships`);

	return focusMap;
}
