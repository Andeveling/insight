/**
 * Fix Assessment Questions Domain Script
 *
 * Corrige los dominios incorrectos en las preguntas de Phase 4:
 * - Analyst: Doing → Thinking
 * - Commander: Doing → Motivating
 *
 * Este script actualiza ambas bases de datos (local y Turso)
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

const DOMAIN_CORRECTIONS = [
	{
		phase: 4,
		order: 1,
		strength: "Analyst",
		oldDomain: "Doing",
		newDomain: "Thinking",
		text: "Tu equipo necesita tomar una decisión importante pero los datos no son concluyentes...",
	},
	{
		phase: 4,
		order: 2,
		strength: "Commander",
		oldDomain: "Doing",
		newDomain: "Motivating",
		text: "En medio de una crisis, el equipo necesita dirección inmediata...",
	},
];

async function fixDatabaseDomains(config: DatabaseConfig): Promise<void> {
	if (!config.url) {
		console.log(`⏭️  Skipping ${config.name} - No URL configured`);
		return;
	}

	console.log(`\n📦 Connecting to ${config.name}...`);

	const adapter = new PrismaLibSql({
		url: config.url,
		authToken: config.authToken,
	});
	const prisma = new PrismaClient({ adapter });

	try {
		// Get domain IDs
		const domains = await prisma.domain.findMany();
		const domainMap = new Map(domains.map((d) => [d.name, d.id]));

		let fixed = 0;
		let verified = 0;

		for (const correction of DOMAIN_CORRECTIONS) {
			const newDomainId = domainMap.get(correction.newDomain);
			const oldDomainId = domainMap.get(correction.oldDomain);

			if (!newDomainId) {
				console.log(
					`  ⚠️  Domain "${correction.newDomain}" not found in database`,
				);
				continue;
			}

			// Find the question
			const question = await prisma.assessmentQuestion.findFirst({
				where: {
					phase: correction.phase,
					order: correction.order,
				},
				include: {
					domain: true,
				},
			});

			if (!question) {
				console.log(
					`  ⚠️  Q${correction.order} (${correction.strength}) not found - skipping`,
				);
				continue;
			}

			// Check if it needs correction
			if (question.domainId === oldDomainId) {
				// Update the domain
				await prisma.assessmentQuestion.update({
					where: { id: question.id },
					data: { domainId: newDomainId },
				});
				fixed++;
				console.log(
					`  ✅ Fixed Q${correction.order} (${correction.strength}): ${correction.oldDomain} → ${correction.newDomain}`,
				);
			} else if (question.domainId === newDomainId) {
				verified++;
				console.log(
					`  ✓  Q${correction.order} (${correction.strength}): Already correct (${correction.newDomain})`,
				);
			} else {
				const currentDomain = question.domain?.name || "unknown";
				console.log(
					`  ⚠️  Q${correction.order} (${correction.strength}): Unexpected domain "${currentDomain}"`,
				);
			}
		}

		console.log(`\n📊 ${config.name} Summary:`);
		console.log(`  ✅ Fixed: ${fixed}`);
		console.log(`  ✓  Verified: ${verified}`);
		console.log(`  📝 Total: ${fixed + verified}/${DOMAIN_CORRECTIONS.length}`);
	} catch (error) {
		console.error(`❌ Error processing ${config.name}:`, error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

async function verifyCorrections(config: DatabaseConfig): Promise<void> {
	if (!config.url) return;

	console.log(`\n🔍 Verifying ${config.name}...`);

	const adapter = new PrismaLibSql({
		url: config.url,
		authToken: config.authToken,
	});
	const prisma = new PrismaClient({ adapter });

	try {
		const phase4Questions = await prisma.assessmentQuestion.findMany({
			where: { phase: 4 },
			orderBy: { order: "asc" },
			include: {
				domain: true,
				strength: true,
			},
		});

		console.log(`\n📋 Phase 4 Questions by Domain:\n`);

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
			console.log(`  ${domain} (${questions.length} questions):`);
			questions.forEach((q) => {
				const excerpt = q.text.slice(0, 45) + "...";
				const strengthName = q.strength?.name || "No strength";
				console.log(`    Q${q.order} (${strengthName}): ${excerpt}`);
			});
		}
	} finally {
		await prisma.$disconnect();
	}
}

async function main() {
	console.log("🔧 Assessment Questions Domain Fix");
	console.log("===================================\n");

	console.log("📋 Corrections to apply:");
	DOMAIN_CORRECTIONS.forEach((c) => {
		console.log(
			`  • Q${c.order} (${c.strength}): ${c.oldDomain} → ${c.newDomain}`,
		);
	});

	for (const database of databases) {
		if (!database.url) continue;
		await fixDatabaseDomains(database);
		await verifyCorrections(database);
	}

	console.log("\n✨ Domain corrections completed successfully!");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
