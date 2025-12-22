/**
 * XP Calculator Unit Tests
 *
 * Tests for the strength maturity XP progression system.
 */

import { describe, expect, it } from "vitest";
import {
	LEVEL_ORDER,
	XP_THRESHOLDS,
} from "@/lib/constants/strength-levels.constants";
import {
	calculateOverallMastery,
	calculateProgress,
	formatXpDisplay,
	getLevelForXp,
	getLevelIndex,
	getNextLevel,
	getPreviousLevel,
	getXpForLevel,
	getXpForNextLevel,
	getXpToNextLevel,
	shouldLevelUp,
} from "@/lib/services/strength-levels/xp-calculator";

describe("XP Calculator Service", () => {
	describe("getNextLevel", () => {
		it("should return CONNECTOR for SPONGE", () => {
			expect(getNextLevel("SPONGE")).toBe("CONNECTOR");
		});

		it("should return GUIDE for CONNECTOR", () => {
			expect(getNextLevel("CONNECTOR")).toBe("GUIDE");
		});

		it("should return ALCHEMIST for GUIDE", () => {
			expect(getNextLevel("GUIDE")).toBe("ALCHEMIST");
		});

		it("should return null for ALCHEMIST (max level)", () => {
			expect(getNextLevel("ALCHEMIST")).toBeNull();
		});
	});

	describe("getPreviousLevel", () => {
		it("should return null for SPONGE (min level)", () => {
			expect(getPreviousLevel("SPONGE")).toBeNull();
		});

		it("should return SPONGE for CONNECTOR", () => {
			expect(getPreviousLevel("CONNECTOR")).toBe("SPONGE");
		});

		it("should return GUIDE for ALCHEMIST", () => {
			expect(getPreviousLevel("ALCHEMIST")).toBe("GUIDE");
		});
	});

	describe("getLevelIndex", () => {
		it("should return correct indices for all levels", () => {
			expect(getLevelIndex("SPONGE")).toBe(0);
			expect(getLevelIndex("CONNECTOR")).toBe(1);
			expect(getLevelIndex("GUIDE")).toBe(2);
			expect(getLevelIndex("ALCHEMIST")).toBe(3);
		});
	});

	describe("getXpForLevel", () => {
		it("should return correct XP thresholds", () => {
			expect(getXpForLevel("SPONGE")).toBe(0);
			expect(getXpForLevel("CONNECTOR")).toBe(500);
			expect(getXpForLevel("GUIDE")).toBe(1500);
			expect(getXpForLevel("ALCHEMIST")).toBe(5000);
		});
	});

	describe("getXpForNextLevel", () => {
		it("should return XP needed for next level", () => {
			expect(getXpForNextLevel("SPONGE")).toBe(500);
			expect(getXpForNextLevel("CONNECTOR")).toBe(1500);
			expect(getXpForNextLevel("GUIDE")).toBe(5000);
		});

		it("should return null for ALCHEMIST", () => {
			expect(getXpForNextLevel("ALCHEMIST")).toBeNull();
		});
	});

	describe("getLevelForXp", () => {
		it("should return SPONGE for 0-499 XP", () => {
			expect(getLevelForXp(0)).toBe("SPONGE");
			expect(getLevelForXp(250)).toBe("SPONGE");
			expect(getLevelForXp(499)).toBe("SPONGE");
		});

		it("should return CONNECTOR for 500-1499 XP", () => {
			expect(getLevelForXp(500)).toBe("CONNECTOR");
			expect(getLevelForXp(1000)).toBe("CONNECTOR");
			expect(getLevelForXp(1499)).toBe("CONNECTOR");
		});

		it("should return GUIDE for 1500-4999 XP", () => {
			expect(getLevelForXp(1500)).toBe("GUIDE");
			expect(getLevelForXp(3000)).toBe("GUIDE");
			expect(getLevelForXp(4999)).toBe("GUIDE");
		});

		it("should return ALCHEMIST for 5000+ XP", () => {
			expect(getLevelForXp(5000)).toBe("ALCHEMIST");
			expect(getLevelForXp(10000)).toBe("ALCHEMIST");
			expect(getLevelForXp(999999)).toBe("ALCHEMIST");
		});

		it("should handle edge cases", () => {
			expect(getLevelForXp(-10)).toBe("SPONGE"); // Negative XP defaults to SPONGE
		});
	});

	describe("calculateProgress", () => {
		it("should calculate progress for SPONGE at 250 XP", () => {
			const result = calculateProgress(250, "SPONGE");

			expect(result.currentLevel).toBe("SPONGE");
			expect(result.currentXp).toBe(250);
			expect(result.xpInCurrentLevel).toBe(250);
			expect(result.xpRequiredForNextLevel).toBe(500);
			expect(result.progressPercentage).toBe(50);
			expect(result.isMaxLevel).toBe(false);
			expect(result.nextLevel).toBe("CONNECTOR");
		});

		it("should calculate progress for CONNECTOR at 1000 XP", () => {
			const result = calculateProgress(1000, "CONNECTOR");

			expect(result.currentLevel).toBe("CONNECTOR");
			expect(result.xpInCurrentLevel).toBe(500); // 1000 - 500 = 500
			expect(result.xpRequiredForNextLevel).toBe(1000); // 1500 - 500 = 1000
			expect(result.progressPercentage).toBe(50);
		});

		it("should handle max level (ALCHEMIST)", () => {
			const result = calculateProgress(6500, "ALCHEMIST");

			expect(result.currentLevel).toBe("ALCHEMIST");
			expect(result.isMaxLevel).toBe(true);
			expect(result.nextLevel).toBeNull();
		});

		it("should detect level mismatch and return actual level", () => {
			// User says they're SPONGE but have 600 XP (should be CONNECTOR)
			const result = calculateProgress(600, "SPONGE");

			expect(result.currentLevel).toBe("CONNECTOR");
		});
	});

	describe("shouldLevelUp", () => {
		it("should detect level-up from SPONGE to CONNECTOR", () => {
			const result = shouldLevelUp(450, "SPONGE", 100);

			expect(result.shouldLevelUp).toBe(true);
			expect(result.newLevel).toBe("CONNECTOR");
			expect(result.levelsGained).toBe(1);
			expect(result.xpOverflow).toBe(50); // 550 - 500 = 50
		});

		it("should not trigger level-up when within same level", () => {
			const result = shouldLevelUp(100, "SPONGE", 50);

			expect(result.shouldLevelUp).toBe(false);
			expect(result.newLevel).toBeNull();
			expect(result.levelsGained).toBe(0);
		});

		it("should handle multiple level jumps", () => {
			const result = shouldLevelUp(400, "SPONGE", 1200);

			expect(result.shouldLevelUp).toBe(true);
			expect(result.newLevel).toBe("GUIDE"); // 1600 XP = GUIDE
			expect(result.levelsGained).toBe(2); // SPONGE -> CONNECTOR -> GUIDE
		});

		it("should handle exact threshold XP", () => {
			const result = shouldLevelUp(0, "SPONGE", 500);

			expect(result.shouldLevelUp).toBe(true);
			expect(result.newLevel).toBe("CONNECTOR");
			expect(result.xpOverflow).toBe(0);
		});
	});

	describe("getXpToNextLevel", () => {
		it("should calculate XP needed to reach next level", () => {
			expect(getXpToNextLevel(300, "SPONGE")).toBe(200); // Need 500, have 300
			expect(getXpToNextLevel(1000, "CONNECTOR")).toBe(500); // Need 1500, have 1000
		});

		it("should return null for max level", () => {
			expect(getXpToNextLevel(6000, "ALCHEMIST")).toBeNull();
		});

		it("should return 0 when already at threshold", () => {
			expect(getXpToNextLevel(500, "SPONGE")).toBe(0);
		});
	});

	describe("formatXpDisplay", () => {
		it("should format small numbers normally", () => {
			expect(formatXpDisplay(500)).toBe("500");
			expect(formatXpDisplay(1500)).toBe("1,500");
		});

		it("should format large numbers with K suffix", () => {
			expect(formatXpDisplay(10000)).toBe("10.0K");
			expect(formatXpDisplay(15500)).toBe("15.5K");
		});
	});

	describe("calculateOverallMastery", () => {
		it("should calculate mastery percentage", () => {
			expect(calculateOverallMastery(0)).toBe(0);
			expect(calculateOverallMastery(2500)).toBe(50);
			expect(calculateOverallMastery(5000)).toBe(100);
			expect(calculateOverallMastery(10000)).toBe(100); // Cap at 100%
		});
	});

	describe("XP Thresholds consistency", () => {
		it("should have no gaps between levels", () => {
			for (let i = 0; i < LEVEL_ORDER.length - 1; i++) {
				const currentLevel = LEVEL_ORDER[i];
				const nextLevel = LEVEL_ORDER[i + 1];

				const currentMax = XP_THRESHOLDS[currentLevel].max;
				const nextMin = XP_THRESHOLDS[nextLevel].min;

				if (currentMax !== null) {
					expect(nextMin).toBe(currentMax + 1);
				}
			}
		});

		it("should have increasing thresholds", () => {
			let lastMin = -1;

			for (const level of LEVEL_ORDER) {
				const currentMin = XP_THRESHOLDS[level].min;
				expect(currentMin).toBeGreaterThan(lastMin);
				lastMin = currentMin;
			}
		});
	});
});
