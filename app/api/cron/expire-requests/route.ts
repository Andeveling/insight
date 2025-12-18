import { NextResponse } from "next/server";

import { markExpiredRequests } from "@/app/dashboard/feedback/_services/feedback-request.service";

/**
 * Cron endpoint to mark expired feedback requests
 * Should be called every 6 hours by Vercel Cron
 *
 * Protected by CRON_SECRET environment variable
 */
export async function GET(request: Request) {
	// Verify cron secret for security
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const expiredCount = await markExpiredRequests();

		console.log(`[Cron] Marked ${expiredCount} feedback requests as expired`);

		return NextResponse.json({
			success: true,
			expiredCount,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("[Cron] Error marking expired requests:", error);

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
