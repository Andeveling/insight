"use server";

import { getSession } from "@/lib/auth";
import {
  getLevelByXp,
  getLevelProgress,
  getStreakBonus,
  getXpForNextLevel,
} from "@/lib/constants/xp-levels";
import { getExtendedUserStats } from "@/lib/services/gamification.service";
import type { ProfileGamificationProgress } from "@/lib/types/profile-gamification-progress.types";

export async function getProfileGamificationProgress(): Promise<ProfileGamificationProgress | null> {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const stats = await getExtendedUserStats(session.user.id);

  const streakMultiplier = getStreakBonus(stats.currentStreak);
  const levelInfo = getLevelByXp(stats.xpTotal);
  const xpInCurrentLevel = stats.xpTotal - levelInfo.minXp;
  const nextLevelXpRequired = getXpForNextLevel(stats.xpTotal);
  const levelProgress = getLevelProgress(stats.xpTotal);

  return {
    userId: session.user.id,
    xpTotal: stats.xpTotal,
    currentLevel: stats.currentLevel,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXpRequired,
    levelProgress,
    currentStreak: stats.currentStreak,
    streakMultiplier,
  };
}
