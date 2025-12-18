/**
 * Session Cleanup CRON Job
 * Archives assessment sessions with no activity for 30+ days
 *
 * Deployment: Set up as a Vercel CRON job or external scheduler
 * Recommended schedule: Daily at 3:00 AM UTC
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.db";
import { SessionStatus } from "@/generated/prisma/client";

// Verify CRON secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * Archive sessions inactive for more than specified days
 */
async function cleanupStaleSessions(daysInactive: number = 30): Promise<{
	archived: number;
	failed: number;
}> {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

	try {
		// Find stale in-progress sessions
		const staleSessions = await prisma.assessmentSession.findMany({
			where: {
				status: SessionStatus.IN_PROGRESS,
				lastActivityAt: {
					lt: cutoffDate,
				},
			},
			select: {
				id: true,
				userId: true,
				lastActivityAt: true,
			},
		});

		if (staleSessions.length === 0) {
			console.log("[Session Cleanup] No stale sessions found");
			return { archived: 0, failed: 0 };
		}

		console.log(
			`[Session Cleanup] Found ${staleSessions.length} stale sessions`,
		);

		// Archive sessions in batches
		const batchSize = 100;
		let archived = 0;
		let failed = 0;

		for (let i = 0; i < staleSessions.length; i += batchSize) {
			const batch = staleSessions.slice(i, i + batchSize);
			const sessionIds = batch.map((s) => s.id);

			try {
				const result = await prisma.assessmentSession.updateMany({
					where: {
						id: { in: sessionIds },
					},
					data: {
						status: SessionStatus.ABANDONED,
					},
				});

				archived += result.count;
				console.log(
					`[Session Cleanup] Archived batch ${i / batchSize + 1}: ${result.count} sessions`,
				);
			} catch (error) {
				failed += batch.length;
				console.error(`[Session Cleanup] Failed to archive batch:`, error);
			}
		}

		return { archived, failed };
	} catch (error) {
		console.error("[Session Cleanup] Error finding stale sessions:", error);
		throw error;
	}
}

/**
 * Permanently delete archived sessions older than 90 days
 */
async function deleteOldArchivedSessions(
	daysArchived: number = 90,
): Promise<number> {
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - daysArchived);

	try {
		// Delete answers first (foreign key constraint)
		await prisma.userAssessmentAnswer.deleteMany({
			where: {
				session: {
					status: SessionStatus.ABANDONED,
					updatedAt: {
						lt: cutoffDate,
					},
				},
			},
		});

		// Then delete sessions
		const result = await prisma.assessmentSession.deleteMany({
			where: {
				status: SessionStatus.ABANDONED,
				updatedAt: {
					lt: cutoffDate,
				},
			},
		});

		console.log(
			`[Session Cleanup] Deleted ${result.count} old archived sessions`,
		);
		return result.count;
	} catch (error) {
		console.error("[Session Cleanup] Error deleting old sessions:", error);
		throw error;
	}
}

export async function GET(request: Request) {
	// Verify authorization
	const authHeader = request.headers.get("authorization");

	if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
		console.warn("[Session Cleanup] Unauthorized access attempt");
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const startTime = Date.now();

	try {
		// Archive stale sessions (30+ days inactive)
		const archiveResult = await cleanupStaleSessions(30);

		// Delete old archived sessions (90+ days old)
		const deletedCount = await deleteOldArchivedSessions(90);

		const duration = Date.now() - startTime;

		const summary = {
			success: true,
			timestamp: new Date().toISOString(),
			duration: `${duration}ms`,
			results: {
				sessionsArchived: archiveResult.archived,
				archiveFailures: archiveResult.failed,
				sessionsDeleted: deletedCount,
			},
		};

		console.log("[Session Cleanup] Complete:", summary);

		return NextResponse.json(summary);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		console.error("[Session Cleanup] Failed:", errorMessage);

		return NextResponse.json(
			{
				success: false,
				timestamp: new Date().toISOString(),
				error: errorMessage,
			},
			{ status: 500 },
		);
	}
}
