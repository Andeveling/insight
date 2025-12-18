/**
 * GET /api/gamification/progress
 * Returns the current user's gamification progress
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getExtendedUserStats } from "@/lib/services/gamification.service";
import {
	getStreakBonus,
	getLevelByXp,
	getXpForNextLevel,
	getLevelProgress,
} from "@/lib/constants/xp-levels";

export async function GET() {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "No autenticado" }, { status: 401 });
		}

		const stats = await getExtendedUserStats(session.user.id);

		if (!stats) {
			return NextResponse.json(
				{ error: "No se encontró progreso de gamificación" },
				{ status: 404 },
			);
		}

		const streakMultiplier = getStreakBonus(stats.currentStreak);
		const levelInfo = getLevelByXp(stats.xpTotal);
		const xpInCurrentLevel = stats.xpTotal - levelInfo.minXp;
		const xpForNextLevel = getXpForNextLevel(stats.xpTotal);
		const levelProgress = getLevelProgress(stats.xpTotal);

		return NextResponse.json({
			progress: {
				userId: session.user.id,
				xpTotal: stats.xpTotal,
				currentLevel: stats.currentLevel,
				currentLevelXp: xpInCurrentLevel,
				nextLevelXpRequired: xpForNextLevel,
				levelProgress,
				currentStreak: stats.currentStreak,
				streakMultiplier,
			},
		});
	} catch (error) {
		console.error("[API] gamification/progress error:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
