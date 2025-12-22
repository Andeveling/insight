/**
 * Generate Daily Quests Cron Job
 *
 * Runs daily at 00:00 UTC to generate new daily quests for all active users.
 * Called by Vercel Cron.
 */

import { NextResponse } from "next/server";
import { generateDailyQuestsForUser } from "@/app/dashboard/strength-levels/_services/quest-generator.service";
import { prisma } from "@/lib/prisma.db";

/**
 * Cron secret for authentication
 */
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
	// Verify cron secret
	const authHeader = request.headers.get("authorization");

	if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const startTime = Date.now();

	try {
		// Get all users who have at least one strength configured
		const usersWithStrengths = await prisma.userStrength.groupBy({
			by: ["userId"],
		});

		const userIds = usersWithStrengths.map((u) => u.userId);

		if (userIds.length === 0) {
			return NextResponse.json({
				success: true,
				message: "No users with strengths found",
				processed: 0,
				duration: Date.now() - startTime,
			});
		}

		// Process users in batches
		const BATCH_SIZE = 50;
		let successCount = 0;
		let errorCount = 0;
		const errors: string[] = [];

		for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
			const batch = userIds.slice(i, i + BATCH_SIZE);

			const results = await Promise.allSettled(
				batch.map(async (userId) => {
					const result = await generateDailyQuestsForUser(userId);
					if (!result.success) {
						throw new Error(result.error || "Unknown error");
					}
					return result.quests.length;
				}),
			);

			for (const result of results) {
				if (result.status === "fulfilled") {
					successCount++;
				} else {
					errorCount++;
					errors.push(result.reason?.message || "Unknown error");
				}
			}
		}

		const duration = Date.now() - startTime;

		console.log(
			`[GenerateDailyQuests] Processed ${userIds.length} users in ${duration}ms. Success: ${successCount}, Errors: ${errorCount}`,
		);

		return NextResponse.json({
			success: true,
			processed: userIds.length,
			successCount,
			errorCount,
			duration,
			...(errors.length > 0 && { sampleErrors: errors.slice(0, 5) }),
		});
	} catch (error) {
		console.error("[GenerateDailyQuests] Fatal error:", error);

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				duration: Date.now() - startTime,
			},
			{ status: 500 },
		);
	}
}
