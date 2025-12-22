/**
 * Verify Assessment Questions Status
 *
 * Verifica el estado de las preguntas de assessment en ambas bases de datos
 */

import "dotenv/config";

import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";

interface DatabaseConfig {
	name: string;
	url: string;
	authToken?: string;
}

const databases: DatabaseConfig[] = [
	{
		name: "Local SQLite",
		url: "file:./dev.db",
	},
	{
		name: "Turso (Production)",
		url: process.env.TURSO_DATABASE_URL || "",
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
];

async function verifyDatabase(config: DatabaseConfig): Promise<void> {
	if (!config.url) {
		console.log(`⏭️  Skipping ${config.name} - No URL configured\n`);
		return;
	}

	console.log(`\n📊 ${config.name}`);
	console.log("=".repeat(50));

	const adapter = new PrismaLibSql({
		url: config.url,
		authToken: config.authToken,
	});
	const prisma = new PrismaClient({ adapter });

	try {
		// Count questions by phase
		const phaseGroups = await prisma.assessmentQuestion.groupBy({
			by: ["phase"],
			_count: true,
			orderBy: { phase: "asc" },
		});

		console.log("\nPreguntas por fase:");
		phaseGroups.forEach((p) => {
			console.log(`  Phase ${p.phase}: ${p._count} preguntas`);
		});

		const total = phaseGroups.reduce((sum, p) => sum + p._count, 0);
		console.log(`  Total: ${total} preguntas\n`);

		// Phase 4 breakdown by domain
		const phase4Questions = await prisma.assessmentQuestion.findMany({
			where: { phase: 4 },
			include: {
				domain: true,
				strength: true,
			},
			orderBy: { order: "asc" },
		});

		if (phase4Questions.length > 0) {
			console.log("Phase 4 por dominio:");
			const byDomain = phase4Questions.reduce(
				(acc, q) => {
					const domainName = q.domain?.name || "Unknown";
					if (!acc[domainName]) acc[domainName] = [];
					acc[domainName].push(q);
					return acc;
				},
				{} as Record<string, typeof phase4Questions>,
			);

			for (const [domain, questions] of Object.entries(byDomain)) {
				console.log(`  ${domain}: ${questions.length} preguntas`);
				questions.forEach((q) => {
					const strengthName = q.strength?.name || "?";
					console.log(`    Q${q.order} (${strengthName})`);
				});
			}
		}

		// Feedback questions count
		const feedbackCount = await prisma.feedbackQuestion.count();
		console.log(`\nPreguntas de feedback: ${feedbackCount}`);
	} catch (error) {
		console.error(`❌ Error:`, error);
	} finally {
		await prisma.$disconnect();
	}
}

async function main() {
	console.log("🔍 Assessment Questions Verification");
	console.log("=====================================\n");

	for (const database of databases) {
		await verifyDatabase(database);
	}

	console.log("\n✨ Verification completed!");
}

main();
