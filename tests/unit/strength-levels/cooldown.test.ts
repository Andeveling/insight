/**
 * Cooldown Service Unit Tests
 *
 * Tests for quest cooldown calculations and time formatting.
 * Uses relative date calculations for Bun compatibility (no fake timers).
 */

import { describe, expect, it } from "vitest";
import {
	calculateCooldownRemaining,
	formatCooldownDisplay,
	formatRelativeTime,
	getCooldownDuration,
	getCooperativeConfirmationDeadline,
	getDailyQuestTimeRemaining,
	isCooperativeConfirmationExpired,
	isDailyQuestExpired,
	isInCooldown,
} from "@/lib/services/strength-levels/cooldown";

/**
 * Helper functions to create relative dates
 */
function hoursAgo(hours: number): Date {
	return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function daysAgo(days: number): Date {
	return hoursAgo(days * 24);
}

function secondsAgo(seconds: number): Date {
	return new Date(Date.now() - seconds * 1000);
}

function minutesAgo(minutes: number): Date {
	return new Date(Date.now() - minutes * 60 * 1000);
}

describe("Cooldown Service", () => {
	describe("isInCooldown", () => {
		it("should return false when lastCompletedAt is null", () => {
			expect(isInCooldown("BOSS_BATTLE", null)).toBe(false);
		});

		it("should return false for DAILY quests (no cooldown)", () => {
			const now = new Date();
			expect(isInCooldown("DAILY", now)).toBe(false);
		});

		it("should return true when BOSS_BATTLE is in cooldown", () => {
			const lastCompleted = daysAgo(3); // 3 days ago, cooldown is 7 days
			expect(isInCooldown("BOSS_BATTLE", lastCompleted)).toBe(true);
		});

		it("should return false when BOSS_BATTLE cooldown has expired", () => {
			const lastCompleted = daysAgo(10); // 10 days ago, cooldown is 7 days
			expect(isInCooldown("BOSS_BATTLE", lastCompleted)).toBe(false);
		});

		it("should handle COMBO_BREAKER 3-day cooldown", () => {
			const withinCooldown = daysAgo(1); // 1 day ago, cooldown is 3 days
			expect(isInCooldown("COMBO_BREAKER", withinCooldown)).toBe(true);

			const outsideCooldown = daysAgo(4); // 4 days ago
			expect(isInCooldown("COMBO_BREAKER", outsideCooldown)).toBe(false);
		});
	});

	describe("calculateCooldownRemaining", () => {
		it("should return zeroed status when no cooldown", () => {
			const result = calculateCooldownRemaining("DAILY", null);

			expect(result.isInCooldown).toBe(false);
			expect(result.remainingHours).toBe(0);
			expect(result.percentageComplete).toBe(100);
		});

		it("should calculate remaining time correctly", () => {
			const lastCompleted = daysAgo(1); // 1 day ago
			const result = calculateCooldownRemaining("BOSS_BATTLE", lastCompleted);

			expect(result.isInCooldown).toBe(true);
			// 7 days - 1 day = 6 days = 144 hours (allow for timing variance)
			expect(result.remainingHours).toBeGreaterThanOrEqual(143);
			expect(result.remainingHours).toBeLessThanOrEqual(144);
			expect(result.cooldownEndsAt).toBeDefined();
		});

		it("should show cooldown complete when expired", () => {
			const lastCompleted = daysAgo(10); // 10 days ago
			const result = calculateCooldownRemaining("BOSS_BATTLE", lastCompleted);

			expect(result.isInCooldown).toBe(false);
			expect(result.remainingHours).toBe(0);
			expect(result.percentageComplete).toBe(100);
		});
	});

	describe("formatCooldownDisplay", () => {
		it("should format days and hours correctly", () => {
			expect(formatCooldownDisplay(48, 30, 0)).toBe("2D 00H");
			expect(formatCooldownDisplay(25, 15, 30)).toBe("1D 01H");
		});

		it("should format hours and minutes", () => {
			expect(formatCooldownDisplay(5, 30, 0)).toBe("05H 30M");
			expect(formatCooldownDisplay(23, 59, 59)).toBe("23H 59M");
		});

		it("should format minutes and seconds", () => {
			expect(formatCooldownDisplay(0, 45, 30)).toBe("45M 30S");
			expect(formatCooldownDisplay(0, 5, 5)).toBe("05M 05S");
		});

		it("should format seconds only", () => {
			expect(formatCooldownDisplay(0, 0, 45)).toBe("45S");
			expect(formatCooldownDisplay(0, 0, 5)).toBe("05S");
		});
	});

	describe("getCooldownDuration", () => {
		it("should return correct durations for each quest type", () => {
			expect(getCooldownDuration("BOSS_BATTLE")).toBe(168); // 7 days
			expect(getCooldownDuration("COMBO_BREAKER")).toBe(72); // 3 days
			expect(getCooldownDuration("COOPERATIVE")).toBe(48); // 2 days
			expect(getCooldownDuration("DAILY")).toBeNull(); // No cooldown
		});
	});

	describe("isDailyQuestExpired", () => {
		it("should return false for recently started quest", () => {
			const startedAt = hoursAgo(2); // 2 hours ago
			expect(isDailyQuestExpired(startedAt)).toBe(false);
		});

		it("should return true for expired quest", () => {
			const startedAt = hoursAgo(28); // 28 hours ago (past 24h expiration)
			expect(isDailyQuestExpired(startedAt)).toBe(true);
		});

		it("should handle exact expiration boundary", () => {
			const startedAt = hoursAgo(24.1); // Just past 24h
			expect(isDailyQuestExpired(startedAt)).toBe(true);
		});
	});

	describe("getDailyQuestTimeRemaining", () => {
		it("should calculate time remaining for active quest", () => {
			const startedAt = hoursAgo(6); // 6 hours ago
			const result = getDailyQuestTimeRemaining(startedAt);

			expect(result.isInCooldown).toBe(true);
			// 24 - 6 = 18 hours remaining (allow for timing variance)
			expect(result.remainingHours).toBeGreaterThanOrEqual(17);
			expect(result.remainingHours).toBeLessThanOrEqual(18);
		});

		it("should show expired for old quests", () => {
			const startedAt = hoursAgo(48); // 48 hours ago
			const result = getDailyQuestTimeRemaining(startedAt);

			expect(result.isInCooldown).toBe(false);
			expect(result.formattedRemaining).toBe("[EXPIRED]");
		});
	});

	describe("getCooperativeConfirmationDeadline", () => {
		it("should calculate deadline correctly", () => {
			const requestedAt = new Date();
			const deadline = getCooperativeConfirmationDeadline(requestedAt);

			const expectedDeadline = new Date(
				requestedAt.getTime() + 48 * 60 * 60 * 1000,
			);
			expect(deadline.getTime()).toBeCloseTo(expectedDeadline.getTime(), -3);
		});
	});

	describe("isCooperativeConfirmationExpired", () => {
		it("should return false within confirmation window", () => {
			const requestedAt = daysAgo(1); // 1 day ago, 2 day window
			expect(isCooperativeConfirmationExpired(requestedAt)).toBe(false);
		});

		it("should return true after confirmation window", () => {
			const requestedAt = daysAgo(3); // 3 days ago, 2 day window expired
			expect(isCooperativeConfirmationExpired(requestedAt)).toBe(true);
		});
	});

	describe("formatRelativeTime", () => {
		it("should format seconds", () => {
			const date = secondsAgo(30);
			const result = formatRelativeTime(date);
			expect(result).toMatch(/^\d+S AGO$/);
		});

		it("should format minutes", () => {
			const date = minutesAgo(30);
			const result = formatRelativeTime(date);
			expect(result).toBe("30M AGO");
		});

		it("should format hours", () => {
			const date = hoursAgo(6);
			const result = formatRelativeTime(date);
			expect(result).toBe("6H AGO");
		});

		it("should format days", () => {
			const date = daysAgo(4);
			const result = formatRelativeTime(date);
			expect(result).toBe("4D AGO");
		});

		it("should format months", () => {
			const date = daysAgo(90); // ~3 months
			const result = formatRelativeTime(date);
			expect(result).toBe("3MO AGO");
		});
	});
});
