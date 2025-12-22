/**
 * Maturity Level Service Unit Tests
 *
 * Tests for maturity level progress calculations.
 * Uses mocked Prisma client for unit testing.
 */

import { describe, expect, it } from "vitest";
import {
	LEVEL_METADATA,
	LEVEL_ORDER,
	XP_THRESHOLDS,
} from "@/lib/constants/strength-levels.constants";
import {
	calculateProgress,
	getLevelForXp,
	shouldLevelUp,
} from "@/lib/services/strength-levels/xp-calculator";

describe("Maturity Level Service", () => {
	describe("Progress Calculation Logic", () => {
		it("should calculate 0% progress at level start", () => {
			const progress = calculateProgress(0, "SPONGE");

			expect(progress.currentLevel).toBe("SPONGE");
			expect(progress.progressPercentage).toBe(0);
			expect(progress.xpInCurrentLevel).toBe(0);
		});

		it("should calculate 50% progress at half XP for SPONGE", () => {
			// SPONGE is 0-499, so 250 should be ~50%
			const progress = calculateProgress(250, "SPONGE");

			expect(progress.currentLevel).toBe("SPONGE");
			expect(progress.progressPercentage).toBeCloseTo(50, 0);
			expect(progress.xpInCurrentLevel).toBe(250);
		});

		it("should calculate 100% progress when at threshold", () => {
			// At 500 XP, user should be CONNECTOR with 0% progress toward next
			const progress = calculateProgress(500, "CONNECTOR");

			expect(progress.currentLevel).toBe("CONNECTOR");
			expect(progress.progressPercentage).toBe(0); // Just started CONNECTOR
			expect(progress.xpInCurrentLevel).toBe(0);
		});

		it("should handle max level (ALCHEMIST) correctly", () => {
			const progress = calculateProgress(5000, "ALCHEMIST");

			expect(progress.currentLevel).toBe("ALCHEMIST");
			expect(progress.isMaxLevel).toBe(true);
			expect(progress.nextLevel).toBeNull();
		});

		it("should show progress in ALCHEMIST based on milestones", () => {
			// ALCHEMIST at 5500 XP (500 XP into level)
			const progress = calculateProgress(5500, "ALCHEMIST");

			expect(progress.isMaxLevel).toBe(true);
			expect(progress.progressPercentage).toBe(50); // 500/1000 milestone
		});

		it("should detect level mismatch and return actual level", () => {
			// User has 600 XP but is registered as SPONGE (should be CONNECTOR)
			const progress = calculateProgress(600, "SPONGE");

			// Should return actual level based on XP
			expect(progress.currentLevel).toBe("CONNECTOR");
		});
	});

	describe("Level Detection from XP", () => {
		it("should return SPONGE for XP 0-499", () => {
			expect(getLevelForXp(0)).toBe("SPONGE");
			expect(getLevelForXp(250)).toBe("SPONGE");
			expect(getLevelForXp(499)).toBe("SPONGE");
		});

		it("should return CONNECTOR for XP 500-1499", () => {
			expect(getLevelForXp(500)).toBe("CONNECTOR");
			expect(getLevelForXp(1000)).toBe("CONNECTOR");
			expect(getLevelForXp(1499)).toBe("CONNECTOR");
		});

		it("should return GUIDE for XP 1500-4999", () => {
			expect(getLevelForXp(1500)).toBe("GUIDE");
			expect(getLevelForXp(3000)).toBe("GUIDE");
			expect(getLevelForXp(4999)).toBe("GUIDE");
		});

		it("should return ALCHEMIST for XP 5000+", () => {
			expect(getLevelForXp(5000)).toBe("ALCHEMIST");
			expect(getLevelForXp(10000)).toBe("ALCHEMIST");
			expect(getLevelForXp(999999)).toBe("ALCHEMIST");
		});

		it("should handle edge cases", () => {
			expect(getLevelForXp(-10)).toBe("SPONGE"); // Negative
		});
	});

	describe("Level Up Detection", () => {
		it("should detect level up from SPONGE to CONNECTOR", () => {
			const result = shouldLevelUp(450, "SPONGE", 100); // 450 + 100 = 550 (CONNECTOR)

			expect(result.shouldLevelUp).toBe(true);
			expect(result.newLevel).toBe("CONNECTOR");
			expect(result.levelsGained).toBe(1);
		});

		it("should not level up when staying within same level", () => {
			const result = shouldLevelUp(100, "SPONGE", 50); // 100 + 50 = 150 (still SPONGE)

			expect(result.shouldLevelUp).toBe(false);
			expect(result.newLevel).toBeNull();
			expect(result.levelsGained).toBe(0);
		});

		it("should handle multiple level jumps", () => {
			const result = shouldLevelUp(0, "SPONGE", 5000); // 0 + 5000 = ALCHEMIST (3 levels)

			expect(result.shouldLevelUp).toBe(true);
			expect(result.newLevel).toBe("ALCHEMIST");
			expect(result.levelsGained).toBe(3);
		});

		it("should calculate XP overflow correctly", () => {
			const result = shouldLevelUp(400, "SPONGE", 150); // 400 + 150 = 550 (50 XP into CONNECTOR)

			expect(result.shouldLevelUp).toBe(true);
			expect(result.xpOverflow).toBe(50); // 550 - 500 = 50
		});
	});

	describe("Level Order and Thresholds Consistency", () => {
		it("should have LEVEL_ORDER match XP_THRESHOLDS keys", () => {
			for (const level of LEVEL_ORDER) {
				expect(XP_THRESHOLDS).toHaveProperty(level);
				expect(LEVEL_METADATA).toHaveProperty(level);
			}
		});

		it("should have increasing XP thresholds", () => {
			let previousMax = -1;

			for (const level of LEVEL_ORDER) {
				const threshold = XP_THRESHOLDS[level];
				expect(threshold.min).toBeGreaterThan(previousMax);
				previousMax = threshold.max ?? Infinity;
			}
		});

		it("should have 4 levels in correct order", () => {
			expect(LEVEL_ORDER).toEqual([
				"SPONGE",
				"CONNECTOR",
				"GUIDE",
				"ALCHEMIST",
			]);
			expect(LEVEL_ORDER.length).toBe(4);
		});

		it("should have ALCHEMIST as the only level with null max", () => {
			for (const level of LEVEL_ORDER) {
				if (level === "ALCHEMIST") {
					expect(XP_THRESHOLDS[level].max).toBeNull();
				} else {
					expect(XP_THRESHOLDS[level].max).not.toBeNull();
				}
			}
		});
	});

	describe("Level Metadata", () => {
		it("should have all required metadata fields", () => {
			for (const level of LEVEL_ORDER) {
				const metadata = LEVEL_METADATA[level];
				expect(metadata).toHaveProperty("name");
				expect(metadata).toHaveProperty("nameEs");
				expect(metadata).toHaveProperty("color");
				expect(metadata).toHaveProperty("bgGradient");
				expect(metadata).toHaveProperty("icon");
				expect(metadata).toHaveProperty("tagPrefix");
			}
		});

		it("should have Spanish names for all levels", () => {
			expect(LEVEL_METADATA.SPONGE.nameEs).toBe("Esponja");
			expect(LEVEL_METADATA.CONNECTOR.nameEs).toBe("Conector");
			expect(LEVEL_METADATA.GUIDE.nameEs).toBe("Guía");
			expect(LEVEL_METADATA.ALCHEMIST.nameEs).toBe("Alquimista");
		});

		it("should have valid hex colors", () => {
			const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

			for (const level of LEVEL_ORDER) {
				expect(LEVEL_METADATA[level].color).toMatch(hexColorRegex);
			}
		});
	});
});
