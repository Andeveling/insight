/**
 * XP Levels Configuration
 *
 * Defines the level progression system with XP thresholds,
 * names, and visual styling for each level.
 */

import type { LevelInfo } from "@/lib/types/gamification.types";

/**
 * Level configuration with XP thresholds
 * Using exponential growth for higher levels
 */
export const XP_LEVELS: LevelInfo[] = [
  { level: 1, name: "Novato", minXp: 0, maxXp: 500, color: "zinc" },
  { level: 2, name: "Aprendiz", minXp: 500, maxXp: 1200, color: "slate" },
  { level: 3, name: "Explorador", minXp: 1200, maxXp: 2000, color: "green" },
  { level: 4, name: "Practicante", minXp: 2000, maxXp: 3000, color: "emerald" },
  { level: 5, name: "Aventurero", minXp: 3000, maxXp: 4200, color: "teal" },
  { level: 6, name: "Veterano", minXp: 4200, maxXp: 5600, color: "cyan" },
  { level: 7, name: "Experto", minXp: 5600, maxXp: 7200, color: "sky" },
  { level: 8, name: "Especialista", minXp: 7200, maxXp: 9000, color: "blue" },
  { level: 9, name: "Maestro", minXp: 9000, maxXp: 11000, color: "indigo" },
  { level: 10, name: "Virtuoso", minXp: 11000, maxXp: 13500, color: "violet" },
  { level: 11, name: "Sabio", minXp: 13500, maxXp: 16500, color: "purple" },
  { level: 12, name: "Mentor", minXp: 16500, maxXp: 20000, color: "fuchsia" },
  { level: 13, name: "Visionario", minXp: 20000, maxXp: 24000, color: "pink" },
  { level: 14, name: "Líder", minXp: 24000, maxXp: 28500, color: "rose" },
  { level: 15, name: "Leyenda", minXp: 28500, maxXp: 35000, color: "amber" },
  {
    level: 16,
    name: "Gran Maestro",
    minXp: 35000,
    maxXp: 50000,
    color: "orange",
  },
  {
    level: 17,
    name: "Iluminado",
    minXp: 50000,
    maxXp: 75000,
    color: "yellow",
  },
  {
    level: 18,
    name: "Trascendente",
    minXp: 75000,
    maxXp: 100000,
    color: "lime",
  },
  {
    level: 19,
    name: "Arquetipo",
    minXp: 100000,
    maxXp: 150000,
    color: "red",
  },
  {
    level: 20,
    name: "Infinito",
    minXp: 150000,
    maxXp: Infinity,
    color: "gradient",
  },
];

/**
 * Maximum level in the system
 */
export const MAX_LEVEL = 20;

/**
 * Starting XP for new users
 */
export const STARTING_XP = 0;

/**
 * Starting level for new users
 */
export const STARTING_LEVEL = 1;

/**
 * XP required for first level up (Level 1 → Level 2)
 */
export const FIRST_LEVEL_XP = 500;

/**
 * Get level info by level number
 */
export function getLevelInfo(level: number): LevelInfo {
  const clampedLevel = Math.min(Math.max(level, 1), MAX_LEVEL);
  return XP_LEVELS[ clampedLevel - 1 ];
}

/**
 * Get level info by XP amount
 */
export function getLevelByXp(xp: number): LevelInfo {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[ i ].minXp) {
      return XP_LEVELS[ i ];
    }
  }
  return XP_LEVELS[ 0 ];
}

/**
 * Calculate XP needed for next level
 */
export function getXpForNextLevel(currentXp: number): number {
  const currentLevel = getLevelByXp(currentXp);
  if (currentLevel.level >= MAX_LEVEL) {
    return 0; // Already at max level
  }
  return currentLevel.maxXp - currentXp;
}

/**
 * Calculate progress percentage within current level
 */
export function getLevelProgress(currentXp: number): number {
  const levelInfo = getLevelByXp(currentXp);
  if (levelInfo.level >= MAX_LEVEL) {
    return 100;
  }

  const xpInLevel = currentXp - levelInfo.minXp;
  const xpRequiredForLevel = levelInfo.maxXp - levelInfo.minXp;

  return Math.round((xpInLevel / xpRequiredForLevel) * 100);
}

/**
 * Check if adding XP would cause a level up
 */
export function wouldLevelUp(currentXp: number, xpToAdd: number): boolean {
  const currentLevel = getLevelByXp(currentXp);
  const newLevel = getLevelByXp(currentXp + xpToAdd);
  return newLevel.level > currentLevel.level;
}

/**
 * Get all levels that would be gained
 */
export function getLevelsGained(
  currentXp: number,
  xpToAdd: number
): LevelInfo[] {
  const currentLevel = getLevelByXp(currentXp);
  const newLevel = getLevelByXp(currentXp + xpToAdd);

  if (newLevel.level <= currentLevel.level) {
    return [];
  }

  const levelsGained: LevelInfo[] = [];
  for (let i = currentLevel.level + 1; i <= newLevel.level; i++) {
    levelsGained.push(getLevelInfo(i));
  }

  return levelsGained;
}

/**
 * Streak bonus multipliers
 */
export const STREAK_BONUSES = {
  3: 1.1, // 10% bonus at 3-day streak
  7: 1.25, // 25% bonus at 7-day streak
  14: 1.5, // 50% bonus at 14-day streak
  30: 2.0, // 100% bonus at 30-day streak
} as const;

/**
 * Get streak bonus multiplier
 */
export function getStreakBonus(streakDays: number): number {
  if (streakDays >= 30) return STREAK_BONUSES[ 30 ];
  if (streakDays >= 14) return STREAK_BONUSES[ 14 ];
  if (streakDays >= 7) return STREAK_BONUSES[ 7 ];
  if (streakDays >= 3) return STREAK_BONUSES[ 3 ];
  return 1.0;
}

/**
 * Collaboration bonus (percentage increase)
 */
export const COLLABORATION_BONUS = 0.25; // 25% bonus for collaborative challenges

/**
 * Daily activity timeout in hours (for streak calculation)
 */
export const STREAK_TIMEOUT_HOURS = 48; // 48 hours to maintain streak
