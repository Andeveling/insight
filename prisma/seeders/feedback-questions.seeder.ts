/**
 * Feedback Questions Seeder
 * Seeds behavioral observation questions for peer feedback
 * Based on research.md question design and strengths data
 */

import type { PrismaClient } from "../../generated/prisma/client";
import feedbackQuestions from "../data/feedback-questions.data";

/**
 * Seeds the feedback questions into the database
 */
export async function seedFeedbackQuestions(
	prisma: PrismaClient,
): Promise<void> {
	console.log("🌱 Seeding feedback questions...");

	for (const question of feedbackQuestions) {
		await prisma.feedbackQuestion.upsert({
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

		console.log(
			`  ✅ Question ${question.order}: ${question.text.slice(0, 50)}...`,
		);
	}

	console.log(`🎉 Seeded ${feedbackQuestions.length} feedback questions`);
}

/**
 * Clears all feedback questions from the database
 */
export async function clearFeedbackQuestions(
	prisma: PrismaClient,
): Promise<void> {
	console.log("🧹 Clearing feedback questions...");
	await prisma.feedbackQuestion.deleteMany({});
	console.log("✅ Cleared all feedback questions");
}
