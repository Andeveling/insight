/**
 * Verify Feedback Questions in Turso
 *
 * Verifies that all 45 feedback questions are correctly stored in Turso database
 */

import "dotenv/config";

import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
	console.error(
		"❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set",
	);
	process.exit(1);
}

const adapter = new PrismaLibSql({
	url: databaseUrl,
	authToken: authToken,
});
const prisma = new PrismaClient({ adapter });

async function verifyFeedbackQuestions() {
	console.log("🔍 Verifying feedback questions in Turso...\n");

	const questions = await prisma.feedbackQuestion.findMany({
		orderBy: { order: "asc" },
	});

	console.log(`📊 Total questions in database: ${questions.length}`);
	console.log(`   Expected: 45 questions\n`);

	if (questions.length !== 45) {
		console.error(`❌ Mismatch: Expected 45, found ${questions.length}`);
	} else {
		console.log("✅ Count matches!\n");
	}

	console.log("📋 Last 5 questions (Q41-Q45):");
	const lastFive = questions.slice(-5);

	for (const q of lastFive) {
		const strengthMapping = JSON.parse(q.strengthMapping as string);
		const strengths = Object.values(strengthMapping)
			.flatMap((weights) => Object.keys(weights as Record<string, number>))
			.filter((s, i, arr) => arr.indexOf(s) === i);

		console.log(`\n  Q${q.order}: ${q.text}`);
		console.log(`    Strengths covered: ${strengths.join(", ")}`);
	}

	console.log("\n✨ Verification complete!");
}

async function main() {
	try {
		await verifyFeedbackQuestions();
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
