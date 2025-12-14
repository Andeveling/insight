/**
 * Gamification Types
 *
 * Types for the gamification system including XP, levels, badges, and streaks.
 */

/**
 * Badge tiers
 */
export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";

/**
 * Badge unlock criteria types
 */
export type BadgeCriteriaType =
  | "xp"
  | "modules"
  | "challenges"
  | "streak"
  | "collaborative"
  | "level";

/**
 * Badge unlock criteria
 */
export interface BadgeUnlockCriteria {
  type: BadgeCriteriaType;
  threshold: number;
}

/**
 * Badge data
 */
export interface BadgeData {
  id: string;
  key: string;
  nameEs: string;
  descriptionEs: string;
  iconUrl: string;
  tier: BadgeTier;
  unlockCriteria: BadgeUnlockCriteria;
  xpReward: number;
  isActive: boolean;
}

/**
 * User's unlocked badge
 */
export interface UserBadgeData {
  id: string;
  gamificationId: string;
  badgeId: string;
  unlockedAt: Date;
  badge: BadgeData;
}

/**
 * User gamification profile
 */
export interface UserGamificationData {
  id: string;
  userId: string;
  xpTotal: number;
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXpRequired: number;
  longestStreak: number;
  currentStreak: number;
  lastActivityDate?: Date | null;
  modulesCompleted: number;
  challengesCompleted: number;
  collaborativeChallenges: number;
  badges?: UserBadgeData[];
}

/**
 * Level information
 */
export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  color: string;
}

/**
 * XP gain event
 */
export interface XpGainEvent {
  type: "challenge" | "module" | "badge" | "streak" | "collaboration";
  amount: number;
  description: string;
  timestamp: Date;
}

/**
 * Level up event
 */
export interface LevelUpEvent {
  previousLevel: number;
  newLevel: number;
  xpTotal: number;
  timestamp: Date;
}

/**
 * Streak information
 */
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date | null;
  streakActive: boolean;
  daysUntilStreakLost: number;
}

/**
 * Gamification stats for dashboard
 */
export interface GamificationStats {
  xpTotal: number;
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXpRequired: number;
  levelProgress: number; // 0-100 percentage
  modulesCompleted: number;
  challengesCompleted: number;
  collaborativeChallenges: number;
  badgesUnlocked: number;
  totalBadges: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * XP update result
 */
export interface XpUpdateResult {
  previousXp: number;
  newXp: number;
  xpGained: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  newBadges: BadgeData[];
  streakUpdated: boolean;
  newStreakValue: number;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userImage?: string | null;
  xpTotal: number;
  level: number;
  rank: number;
}

/**
 * Badge progress (for badges not yet unlocked)
 */
export interface BadgeProgress {
  badge: BadgeData;
  currentValue: number;
  targetValue: number;
  progress: number; // 0-100 percentage
  isUnlocked: boolean;
  unlockedAt?: Date | null;
}

/**
 * Activity summary for a time period
 */
export interface ActivitySummary {
  periodStart: Date;
  periodEnd: Date;
  xpEarned: number;
  challengesCompleted: number;
  modulesCompleted: number;
  badgesUnlocked: number;
  streakMaintained: boolean;
}

/**
 * Gamification notification
 */
export interface GamificationNotification {
  type: "xp" | "level_up" | "badge" | "streak" | "module_complete";
  title: string;
  description: string;
  icon?: string;
  xpAmount?: number;
  timestamp: Date;
}
