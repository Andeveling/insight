/**
 * Update Feedback Questions Script
 *
 * Updates feedback questions in Turso database with latest changes from data file.
 * This script specifically updates the 45 feedback questions including:
 * - 5 new questions (Q41-Q45) for time-keeper and believer coverage
 * - Adjusted weights in existing questions
 */

import "dotenv/config";

import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";
import feedbackQuestions from "../prisma/data/feedback-questions.data";

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
	console.error(
		"❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in environment variables",
	);
	process.exit(1);
}

console.log("📦 Connecting to Turso database...");

const adapter = new PrismaLibSql({
	url: databaseUrl,
	authToken: authToken,
});
const prisma = new PrismaClient({ adapter });

async function updateFeedbackQuestions() {
	console.log("🔄 Updating feedback questions in Turso...\n");

	let updated = 0;
	let created = 0;

	for (const question of feedbackQuestions) {
		try {
			const result = await prisma.feedbackQuestion.upsert({
				where: { order: question.order },
				update: {
					text: question.text,
					answerType: question.answerType,
					answerOptions: JSON.stringify(question.answerOptions),
					strengthMapping: JSON.stringify(question.strengthMapping),
				},
				create: {
					text: question.text,
					answerType: question.answerType,
					answerOptions: JSON.stringify(question.answerOptions),
					strengthMapping: JSON.stringify(question.strengthMapping),
					order: question.order,
				},
			});

			// Check if it was an update or create by trying to find if it existed
			const existing = await prisma.feedbackQuestion.findUnique({
				where: { order: question.order },
			});

			if (question.order > 40) {
				created++;
				console.log(
					`  ✨ Created Q${question.order}: ${question.text.slice(0, 60)}...`,
				);
			} else {
				updated++;
				console.log(
					`  ✅ Updated Q${question.order}: ${question.text.slice(0, 60)}...`,
				);
			}
		} catch (error) {
			console.error(`  ❌ Error processing Q${question.order}:`, error);
		}
	}

	console.log("\n📊 Summary:");
	console.log(`  ✨ Created: ${created} new questions`);
	console.log(`  ✅ Updated: ${updated} existing questions`);
	console.log(`  📝 Total: ${feedbackQuestions.length} questions in database`);
	console.log("\n✨ Feedback questions updated successfully!");
}

async function main() {
	try {
		await updateFeedbackQuestions();
	} catch (error) {
		console.error("❌ Error updating feedback questions:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
