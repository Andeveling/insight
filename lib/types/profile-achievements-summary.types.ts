import type { ProfileAchievement } from "./profile-achievement.types";

export type ProfileAchievementsSummary = {
	unlockedCount: number;
	totalCount: number;
	recent: ProfileAchievement[];
};
