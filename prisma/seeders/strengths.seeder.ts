import type { PrismaClient } from "../../generated/prisma/client";
import { strengthsData } from "../data/strengths.data";

export async function seedStrengths(prisma: PrismaClient) {
	console.log("🌱 Seeding strengths...");

	for (const strengthData of strengthsData) {
		// Find the domain by name
		const domain = await prisma.domain.findUnique({
			where: { name: strengthData.domain },
		});

		if (!domain) {
			console.warn(`⚠️  Domain not found: ${strengthData.domain}`);
			continue;
		}

		await prisma.strength.upsert({
			where: { name: strengthData.strength },
			update: {
				nameEs: strengthData.nameEs,
				domainId: domain.id,
				briefDefinition: strengthData.briefDefinition,
				fullDefinition: strengthData.details.fullDefinition,
				howToUseMoreEffectively: strengthData.details.howToUseMoreEffectively
					? JSON.stringify(strengthData.details.howToUseMoreEffectively)
					: null,
				watchOuts: strengthData.details.watchOuts
					? JSON.stringify(strengthData.details.watchOuts)
					: null,
				strengthsDynamics: strengthData.details.strengthsDynamics || null,
				bestPartners: strengthData.details.bestPartners
					? JSON.stringify(strengthData.details.bestPartners)
					: null,
				careerApplications: strengthData.details.careerApplications
					? JSON.stringify(strengthData.details.careerApplications)
					: null,
			},
			create: {
				name: strengthData.strength,
				nameEs: strengthData.nameEs,
				domainId: domain.id,
				briefDefinition: strengthData.briefDefinition,
				fullDefinition: strengthData.details.fullDefinition,
				howToUseMoreEffectively: strengthData.details.howToUseMoreEffectively
					? JSON.stringify(strengthData.details.howToUseMoreEffectively)
					: null,
				watchOuts: strengthData.details.watchOuts
					? JSON.stringify(strengthData.details.watchOuts)
					: null,
				strengthsDynamics: strengthData.details.strengthsDynamics || null,
				bestPartners: strengthData.details.bestPartners
					? JSON.stringify(strengthData.details.bestPartners)
					: null,
				careerApplications: strengthData.details.careerApplications
					? JSON.stringify(strengthData.details.careerApplications)
					: null,
			},
		});
	}

	console.log(`✅ Seeded ${strengthsData.length} strengths`);
}
