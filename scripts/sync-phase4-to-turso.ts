/**
 * Sync Phase 4 Questions to Turso
 *
 * Sincroniza las 20 preguntas de Phase 4 desde el archivo de datos a Turso.
 * Las preguntas actuales en Turso (9) serán reemplazadas por las 20 nuevas.
 */

import "dotenv/config";

import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";
import { phase4Questions } from "../prisma/data/phase4-questions.data";

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
	console.error(
		"❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set",
	);
	process.exit(1);
}

console.log("📦 Connecting to Turso database...");

const adapter = new PrismaLibSql({
	url: databaseUrl,
	authToken: authToken,
});
const prisma = new PrismaClient({ adapter });

async function syncPhase4Questions() {
	console.log("🔄 Syncing Phase 4 questions to Turso...\n");

	try {
		// Get domain and strength mappings
		const domains = await prisma.domain.findMany();
		const domainMap = new Map(domains.map((d) => [d.name, d.id]));

		const strengths = await prisma.strength.findMany();
		const strengthMap = new Map(strengths.map((s) => [s.name, s.id]));

		console.log(
			`📋 Found ${domains.length} domains and ${strengths.length} strengths`,
		);

		// Delete existing Phase 4 questions
		const deleted = await prisma.assessmentQuestion.deleteMany({
			where: { phase: 4 },
		});
		console.log(`🗑️  Deleted ${deleted.count} existing Phase 4 questions\n`);

		// Insert new Phase 4 questions
		let inserted = 0;
		let skipped = 0;

		for (const question of phase4Questions) {
			const domainId = domainMap.get(question.domain);
			if (!domainId) {
				console.log(
					`  ⚠️  Domain "${question.domain}" not found - skipping Q${question.order}`,
				);
				skipped++;
				continue;
			}

			let strengthId: string | null = null;
			if (question.strength) {
				strengthId = strengthMap.get(question.strength) || null;
				if (!strengthId) {
					console.log(
						`  ⚠️  Strength "${question.strength}" not found - skipping Q${question.order}`,
					);
					skipped++;
					continue;
				}
			}

			await prisma.assessmentQuestion.create({
				data: {
					phase: question.phase,
					order: question.order,
					text: question.text,
					type: question.type,
					options: question.options ? JSON.stringify(question.options) : null,
					domainId,
					strengthId,
					weight: question.weight,
					maturityPolarity: question.maturityPolarity || "NEUTRAL",
				},
			});

			inserted++;
			const strengthName = question.strength || "No strength";
			console.log(
				`  ✅ Q${question.order} (${strengthName}): ${question.text.slice(0, 50)}...`,
			);
		}

		console.log(`\n📊 Summary:`);
		console.log(`  ✅ Inserted: ${inserted}`);
		console.log(`  ⚠️  Skipped: ${skipped}`);
		console.log(`  📝 Total: ${inserted}/${phase4Questions.length}`);

		// Verify by domain
		const phase4ByDomain = await prisma.assessmentQuestion.groupBy({
			by: ["domainId"],
			where: { phase: 4 },
			_count: true,
		});

		console.log(`\n📋 Phase 4 Questions by Domain:`);
		for (const group of phase4ByDomain) {
			const domain = domains.find((d) => d.id === group.domainId);
			console.log(`  ${domain?.name || "Unknown"}: ${group._count} questions`);
		}

		console.log("\n✨ Phase 4 questions synced successfully to Turso!");
	} catch (error) {
		console.error("❌ Error syncing questions:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

syncPhase4Questions();
