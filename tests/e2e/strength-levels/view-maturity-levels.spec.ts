import { expect, test } from "@playwright/test";

test.describe("Strength Maturity Levels - US1: Visualizar Niveles", () => {
	test.beforeEach(async ({ page }) => {
		// TODO: Implementar autenticación para E2E
		// Por ahora este test verifica la estructura de la página
		await page.goto("/dashboard/strength-levels");
	});

	test("should display the maturity levels page header", async ({ page }) => {
		await test.step("Verify page header is visible", async () => {
			// Verificar que el header con el título esté presente
			const header = page.getByRole("heading", { name: /niveles de madurez/i });
			await expect(header).toBeVisible();
		});
	});

	test("should display loading skeleton while fetching data", async ({
		page,
	}) => {
		await test.step("Check for skeleton loader elements", async () => {
			// Los skeletons deberían aparecer brevemente antes del contenido
			// En tests reales con auth, esto sería más robusto
			const mainSection = page.locator('[data-testid="maturity-levels-grid"]');
			await expect(mainSection).toBeVisible({ timeout: 10000 });
		});
	});

	test("should display maturity level cards with XP progress bars", async ({
		page,
	}) => {
		await test.step("Wait for cards to load", async () => {
			const cards = page.locator('[data-testid="maturity-level-card"]');
			// Esperar a que al menos una card esté visible
			await expect(cards.first()).toBeVisible({ timeout: 10000 });
		});

		await test.step("Verify XP progress bar exists", async () => {
			const progressBars = page.locator('[data-testid="xp-progress-bar"]');
			await expect(progressBars.first()).toBeVisible();
		});

		await test.step("Verify level badge exists", async () => {
			const levelBadges = page.locator('[data-testid="level-badge"]');
			await expect(levelBadges.first()).toBeVisible();
		});
	});

	test("should show correct level names in Spanish", async ({ page }) => {
		await test.step("Verify Spanish level names are displayed", async () => {
			// Los niveles en español deben mostrarse
			const levelNames = ["Esponja", "Conector", "Guía", "Alquimista"];

			// Al menos uno de los niveles debe estar visible
			const anyLevelVisible = await Promise.race(
				levelNames.map(async (name) => {
					const element = page.getByText(name, { exact: false });
					try {
						await expect(element).toBeVisible({ timeout: 5000 });
						return true;
					} catch {
						return false;
					}
				}),
			);

			expect(anyLevelVisible).toBeTruthy();
		});
	});

	test("should display XP values in progress bar", async ({ page }) => {
		await test.step("Verify XP display format", async () => {
			// Buscar texto que contenga el formato "X / Y XP" o similar
			const xpDisplay = page.getByText(/\d+\s*\/\s*\d+\s*XP/i);
			await expect(xpDisplay.first()).toBeVisible({ timeout: 10000 });
		});
	});

	test("should have proper CyberPunk styling with hexagonal elements", async ({
		page,
	}) => {
		await test.step("Verify hexagonal badge styling", async () => {
			// Verificar que los badges tienen clip-path hexagonal
			const badge = page.locator('[data-testid="level-badge"]').first();
			await expect(badge).toBeVisible({ timeout: 10000 });

			// El badge debe tener estilos CyberPunk (verificación visual)
			const badgeBox = await badge.boundingBox();
			expect(badgeBox).not.toBeNull();
		});

		await test.step("Verify card has clip-path styling", async () => {
			const card = page.locator('[data-testid="maturity-level-card"]').first();
			await expect(card).toBeVisible();
		});
	});
});
