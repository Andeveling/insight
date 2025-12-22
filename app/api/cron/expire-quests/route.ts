/**
 * Expire Quests Cron Job
 *
 * Runs hourly to mark expired quest completions as EXPIRED.
 * Called by Vercel Cron.
 */

import { NextResponse } from "next/server";
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
		const now = new Date();

		// Find all quest completions that are still IN_PROGRESS but have expired
		const expiredQuests = await prisma.questCompletion.updateMany({
			where: {
				status: "IN_PROGRESS",
				expiresAt: {
					lt: now,
				},
			},
			data: {
				status: "EXPIRED",
			},
		});

		const duration = Date.now() - startTime;

		console.log(
			`[ExpireQuests] Expired ${expiredQuests.count} quests in ${duration}ms`,
		);

		return NextResponse.json({
			success: true,
			expiredCount: expiredQuests.count,
			duration,
		});
	} catch (error) {
		console.error("[ExpireQuests] Fatal error:", error);

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
