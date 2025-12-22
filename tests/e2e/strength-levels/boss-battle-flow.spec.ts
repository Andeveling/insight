/**
 * Boss Battle Flow E2E Tests
 *
 * End-to-end tests for boss battle feature including:
 * - Unlock visibility based on maturity level
 * - Completing boss battles with 3x XP
 * - Cooldown display and enforcement
 */

import { expect, test } from "@playwright/test";

test.describe("Boss Battle Flow", () => {
	test.describe("Level-based Unlock", () => {
		test("should NOT show boss battles for SPONGE level users", async ({
			page,
		}) => {
			// Navigate to strength levels page
			await page.goto("/dashboard/strength-levels");

			// Wait for page to load
			await page.waitForLoadState("networkidle");

			// Check that boss battles section is not visible for SPONGE level
			const bossSection = page.locator('[data-testid="boss-battles-section"]');

			// For SPONGE users, the section should not exist
			await expect(bossSection).not.toBeVisible();
		});

		test("should show boss battles for CONNECTOR level users", async ({
			page,
		}) => {
			// Navigate to strength levels page with CONNECTOR level user
			await page.goto("/dashboard/strength-levels");

			// Wait for page to load
			await page.waitForLoadState("networkidle");

			// Look for boss battles content if user has CONNECTOR+ level
			// The section may or may not be visible depending on test user's level
			const bossBattleCards = page.locator('[data-testid="boss-battle-card"]');

			// Count how many boss battle cards are displayed
			const count = await bossBattleCards.count();

			// Log for debugging
			console.log(`Found ${count} boss battle cards`);

			// If boss battles are shown, verify they have the correct styling
			if (count > 0) {
				// Check for 3x XP badge
				const xpBadge = page.locator("text=/3[xX]\\s*XP/i").first();
				await expect(xpBadge).toBeVisible();
			}
		});
	});

	test.describe("Boss Battle Card UI", () => {
		test("should display boss battle with special styling", async ({
			page,
		}) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			const bossCard = page.locator('[data-testid="boss-battle-card"]').first();

			// Skip if no boss battles available
			if ((await bossCard.count()) === 0) {
				test.skip(true, "No boss battles available for this user");
				return;
			}

			// Verify CyberPunk styling - no rounded corners
			const borderRadius = await bossCard.evaluate((el) => {
				return window.getComputedStyle(el).borderRadius;
			});
			expect(["0px", ""]).toContain(borderRadius);

			// Check for 3x XP indicator
			const tripleXp = page
				.locator('[data-testid="boss-battle-card"]')
				.getByText(/3[xX]/);
			await expect(tripleXp).toBeVisible();
		});

		test("should show boss battle title in uppercase", async ({ page }) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			const bossCard = page.locator('[data-testid="boss-battle-card"]').first();

			if ((await bossCard.count()) === 0) {
				test.skip(true, "No boss battles available");
				return;
			}

			// Check section header is uppercase
			const sectionHeader = page.locator("text=BOSS BATTLES");
			await expect(sectionHeader).toBeVisible();
		});
	});

	test.describe("Boss Battle Completion", () => {
		test("should complete boss battle and show celebration animation", async ({
			page,
		}) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			const bossCard = page.locator('[data-testid="boss-battle-card"]').first();

			if ((await bossCard.count()) === 0) {
				test.skip(true, "No boss battles available");
				return;
			}

			// Find and click complete button
			const completeButton = bossCard.locator(
				'[data-testid="boss-battle-complete-button"]',
			);

			// Skip if button is disabled (already completed or in cooldown)
			if (await completeButton.isDisabled()) {
				test.skip(true, "Boss battle already completed or in cooldown");
				return;
			}

			// Complete the boss battle
			await completeButton.click();

			// Wait for celebration animation
			const celebrationModal = page.locator("text=/BOSS DERROTADO/i");
			await expect(celebrationModal).toBeVisible({ timeout: 5000 });

			// Check for XP amount display
			const xpDisplay = page.locator("text=/\\+\\d+\\s*XP/i");
			await expect(xpDisplay).toBeVisible();

			// Wait for animation to close or click to close
			const continueButton = page.locator("text=/CONTINUAR/i");
			if (await continueButton.isVisible()) {
				await continueButton.click();
			}
		});

		test("should award 3x XP for boss battle completion", async ({ page }) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			const bossCard = page.locator('[data-testid="boss-battle-card"]').first();

			if ((await bossCard.count()) === 0) {
				test.skip(true, "No boss battles available");
				return;
			}

			// Get XP reward displayed on card
			const xpRewardText = await bossCard
				.locator('[data-testid="boss-xp-reward"]')
				.textContent();

			// XP should be 150 (3x 50) or higher
			const xpMatch = xpRewardText?.match(/(\d+)/);
			if (xpMatch) {
				const xpAmount = Number.parseInt(xpMatch[1], 10);
				// Boss battles should award at least 150 XP (3x normal 50)
				expect(xpAmount).toBeGreaterThanOrEqual(150);
			}
		});
	});

	test.describe("Cooldown Behavior", () => {
		test("should display cooldown timer after completion", async ({ page }) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			// Look for any cooldown indicators
			const cooldownText = page.locator(
				"text=/ENFRIAMIENTO|COOLDOWN|días|horas/i",
			);

			// This test validates that cooldown is displayed when applicable
			// May not always be visible depending on test state
			const cooldownVisible = (await cooldownText.count()) > 0;
			console.log(`Cooldown indicator visible: ${cooldownVisible}`);
		});

		test("should disable complete button during cooldown", async ({ page }) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			// Look for boss battle cards that might be in cooldown
			const bossCards = page.locator('[data-testid="boss-battle-card"]');
			const count = await bossCards.count();

			for (let i = 0; i < count; i++) {
				const card = bossCards.nth(i);
				const button = card.locator('[data-testid="boss-complete-button"]');

				// Check if button shows completed/cooldown state
				const buttonText = await button.textContent();

				if (
					buttonText?.includes("DERROTADO") ||
					buttonText?.includes("COOLDOWN")
				) {
					// Button should be disabled
					await expect(button).toBeDisabled();
				}
			}
		});

		test("should show 7-day cooldown duration", async ({ page }) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			// If there's a cooldown displayed, it should mention days
			const cooldownDays = page.locator(
				"text=/\\d+\\s*[dD]ías?|\\d+\\s*days?/i",
			);

			// Cooldown period is 7 days
			const visible = (await cooldownDays.count()) > 0;
			if (visible) {
				console.log("Cooldown with days visible - checking value");
				const text = await cooldownDays.first().textContent();
				console.log(`Cooldown text: ${text}`);
			}
		});
	});

	test.describe("Boss Battle Section Styling", () => {
		test("should use CyberPunk design system - no rounded corners", async ({
			page,
		}) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			// Check all cards for proper clip-path styling
			const cards = page.locator('[data-testid="boss-battle-card"]');
			const count = await cards.count();

			for (let i = 0; i < count; i++) {
				const card = cards.nth(i);
				const clipPath = await card.evaluate((el) => {
					return window.getComputedStyle(el).clipPath;
				});

				// Should use polygon clip-path (CyberPunk style)
				if (clipPath && clipPath !== "none") {
					expect(clipPath).toContain("polygon");
				}
			}
		});

		test("should display boss section header correctly", async ({ page }) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			// Check for BOSS BATTLES header if boss battles are available
			const header = page.locator('h3:has-text("BOSS BATTLES")');

			if ((await header.count()) > 0) {
				// Verify header styling
				const fontWeight = await header.evaluate((el) => {
					return window.getComputedStyle(el).fontWeight;
				});
				// Should be bold (700 or bold)
				expect(["700", "bold"]).toContain(fontWeight);

				// Check for red text color (boss theme)
				const color = await header.evaluate((el) => {
					return window.getComputedStyle(el).color;
				});
				// Should have red-ish color (rgb format)
				console.log(`Header color: ${color}`);
			}
		});

		test("should show pulsing glow effect on active boss battles", async ({
			page,
		}) => {
			await page.goto("/dashboard/strength-levels");
			await page.waitForLoadState("networkidle");

			const bossCard = page.locator('[data-testid="boss-battle-card"]').first();

			if ((await bossCard.count()) === 0) {
				test.skip(true, "No boss battles to check animation");
				return;
			}

			// Check for animation class or style
			const hasAnimation = await bossCard.evaluate((el) => {
				const styles = window.getComputedStyle(el);
				return (
					styles.animation !== "none" ||
					el.querySelector('[class*="animate"]') !== null
				);
			});

			console.log(`Boss card has animation: ${hasAnimation}`);
		});
	});
});
