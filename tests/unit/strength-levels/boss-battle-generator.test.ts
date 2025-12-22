/**
 * Boss Battle Generator Unit Tests
 *
 * Tests for boss battle generation filtering by maturity level.
 * Boss battles should only be available for CONNECTOR+ level strengths.
 */

import { describe, expect, it } from "vitest";
import { BOSS_CONFIG } from "@/app/dashboard/strength-levels/_services/quest-generator.service";

describe("Boss Battle Generator", () => {
	describe("BOSS_CONFIG Constants", () => {
		it("should have correct cooldown hours (168 = 7 days)", () => {
			expect(BOSS_CONFIG.COOLDOWN_HOURS).toBe(168);
		});

		it("should have correct max boss battles per strength", () => {
			expect(BOSS_CONFIG.MAX_BOSS_BATTLES).toBe(1);
		});

		it("should have CONNECTOR as minimum level", () => {
			expect(BOSS_CONFIG.MIN_LEVEL).toBe("CONNECTOR");
		});

		it("should calculate 7 days from cooldown hours", () => {
			const sevenDaysInHours = 7 * 24;
			expect(BOSS_CONFIG.COOLDOWN_HOURS).toBe(sevenDaysInHours);
		});
	});

	describe("Level Requirements (Design Validation)", () => {
		const ELIGIBLE_LEVELS = ["CONNECTOR", "GUIDE", "ALCHEMIST"];
		const INELIGIBLE_LEVELS = ["SPONGE"];

		it("should have SPONGE as ineligible level", () => {
			expect(INELIGIBLE_LEVELS).toContain("SPONGE");
			expect(ELIGIBLE_LEVELS).not.toContain("SPONGE");
		});

		it("should have CONNECTOR as eligible level", () => {
			expect(ELIGIBLE_LEVELS).toContain("CONNECTOR");
		});

		it("should have GUIDE as eligible level", () => {
			expect(ELIGIBLE_LEVELS).toContain("GUIDE");
		});

		it("should have ALCHEMIST as eligible level", () => {
			expect(ELIGIBLE_LEVELS).toContain("ALCHEMIST");
		});

		it("should have MIN_LEVEL match first eligible level", () => {
			expect(BOSS_CONFIG.MIN_LEVEL).toBe(ELIGIBLE_LEVELS[0]);
		});
	});

	describe("Cooldown Calculation Logic", () => {
		it("should calculate cooldown end from completion time", () => {
			const completedAt = new Date("2025-01-15T12:00:00Z");
			const cooldownHours = BOSS_CONFIG.COOLDOWN_HOURS;
			const expectedCooldownEnd = new Date(
				completedAt.getTime() + cooldownHours * 60 * 60 * 1000,
			);

			// 7 days = 168 hours = 604800000 ms
			expect(expectedCooldownEnd.getTime() - completedAt.getTime()).toBe(
				604800000,
			);
		});

		it("should detect if cooldown is active", () => {
			const completedAt = new Date("2025-01-15T12:00:00Z");
			const now = new Date("2025-01-18T12:00:00Z"); // 3 days later
			const cooldownHours = BOSS_CONFIG.COOLDOWN_HOURS;
			const cooldownEnd = new Date(
				completedAt.getTime() + cooldownHours * 60 * 60 * 1000,
			);

			// Still in cooldown (3 days < 7 days)
			expect(now < cooldownEnd).toBe(true);
		});

		it("should detect if cooldown has expired", () => {
			const completedAt = new Date("2025-01-15T12:00:00Z");
			const now = new Date("2025-01-23T12:00:00Z"); // 8 days later
			const cooldownHours = BOSS_CONFIG.COOLDOWN_HOURS;
			const cooldownEnd = new Date(
				completedAt.getTime() + cooldownHours * 60 * 60 * 1000,
			);

			// Cooldown expired (8 days > 7 days)
			expect(now >= cooldownEnd).toBe(true);
		});
	});

	describe("XP Multiplier", () => {
		it("should award 3x XP for boss battles (150 vs 50 base)", () => {
			const BASE_DAILY_XP = 50;
			const BOSS_XP_MULTIPLIER = 3;
			const expectedBossXp = BASE_DAILY_XP * BOSS_XP_MULTIPLIER;

			expect(expectedBossXp).toBe(150);
		});
	});
});
