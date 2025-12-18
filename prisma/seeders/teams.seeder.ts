import type { PrismaClient } from "../../generated/prisma/client";

export async function seedTeams(prisma: PrismaClient) {
	console.log("🌱 Seeding teams...");

	await prisma.team.upsert({
		where: { name: "nojau" },
		update: {
			description:
				"Equipo nojau - Transformando la productividad empresarial a través de la innovación y el servicio impecable",
		},
		create: {
			name: "nojau",
			description:
				"Equipo nojau - Transformando la productividad empresarial a través de la innovación y el servicio impecable",
		},
	});

	console.log("✅ Seeded team: nojau");
}
