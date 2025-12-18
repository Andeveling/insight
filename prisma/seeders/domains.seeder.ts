import type { PrismaClient } from "../../generated/prisma/client";
import domainsData from "../data/domains.data";

export async function seedDomains(prisma: PrismaClient) {
	console.log("🌱 Seeding domains...");

	for (const domain of domainsData) {
		await prisma.domain.upsert({
			where: { name: domain.name },
			update: {
				nameEs: domain.nameEs,
				description: domain.description,
				metaphor: domain.metaphor,
				keyQuestion: domain.keyQuestion,
				summary: domain.summary,
				contributionToTeam: JSON.stringify(domain.contributionToTeam),
				potentialPitfall: domain.potentialPitfall,
			},
			create: {
				name: domain.name,
				nameEs: domain.nameEs,
				description: domain.description,
				metaphor: domain.metaphor,
				keyQuestion: domain.keyQuestion,
				summary: domain.summary,
				contributionToTeam: JSON.stringify(domain.contributionToTeam),
				potentialPitfall: domain.potentialPitfall,
			},
		});
	}

	console.log(`✅ Seeded ${domainsData.length} domains`);
}
