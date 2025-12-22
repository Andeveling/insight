/**
 * Feedback Questions Coverage Validation Test
 *
 * Valida que todas las fortalezas tengan cobertura adecuada en las preguntas de feedback.
 * Este test falla si alguna fortaleza tiene menos de 15 menciones (crítico).
 */

import { describe, expect, it } from "vitest";
import feedbackQuestions from "@/prisma/data/feedback-questions.data";

// Umbrales de cobertura
const CRITICAL_THRESHOLD = 15; // Por debajo de este número, test falla
const WARNING_THRESHOLD = 18; // Por debajo de este número, se reporta warning

// Todas las fortalezas que deben estar cubiertas
const ALL_STRENGTHS = [
	// DOING
	"deliverer",
	"time-keeper",
	"focus-expert",
	"problem-solver",
	"believer",
	// THINKING
	"thinker",
	"analyst",
	"brainstormer",
	"strategist",
	"philomath",
	// FEELING
	"peace-keeper",
	"optimist",
	"chameleon",
	"empathizer",
	"coach",
	// MOTIVATING
	"self-believer",
	"catalyst",
	"winner",
	"commander",
	"storyteller",
] as const;

describe("Feedback Questions Coverage", () => {
	// Calcular cobertura una sola vez para todos los tests
	const strengthCounts = new Map<string, number>();

	const DOMAINS = {
		DOING: [
			"deliverer",
			"time-keeper",
			"focus-expert",
			"problem-solver",
			"believer",
		],
		THINKING: ["thinker", "analyst", "brainstormer", "strategist", "philomath"],
		FEELING: ["peace-keeper", "optimist", "chameleon", "empathizer", "coach"],
		MOTIVATING: [
			"self-believer",
			"catalyst",
			"winner",
			"commander",
			"storyteller",
		],
	} as const;

	for (const question of feedbackQuestions) {
		for (const weights of Object.values(question.strengthMapping)) {
			for (const strength of Object.keys(weights)) {
				strengthCounts.set(strength, (strengthCounts.get(strength) || 0) + 1);
			}
		}
	}

	describe("Cobertura individual por fortaleza", () => {
		it("todas las fortalezas deben aparecer al menos 1 vez", () => {
			const missingStrengths = ALL_STRENGTHS.filter(
				(strength) => !strengthCounts.has(strength),
			);

			expect(missingStrengths).toEqual([]);
		});

		it("ninguna fortaleza debe tener cobertura crítica (< 15 menciones)", () => {
			const criticalStrengths: Array<{ strength: string; count: number }> = [];

			for (const strength of ALL_STRENGTHS) {
				const count = strengthCounts.get(strength) || 0;
				if (count < CRITICAL_THRESHOLD) {
					criticalStrengths.push({ strength, count });
				}
			}

			if (criticalStrengths.length > 0) {
				const details = criticalStrengths
					.map((s) => `  - ${s.strength}: ${s.count} menciones`)
					.join("\n");
				throw new Error(
					`❌ Fortalezas con cobertura crítica (< ${CRITICAL_THRESHOLD}):\n${details}`,
				);
			}
		});

		it("debe reportar warnings para fortalezas con cobertura baja (< 18 menciones)", () => {
			const warningStrengths: Array<{ strength: string; count: number }> = [];

			for (const strength of ALL_STRENGTHS) {
				const count = strengthCounts.get(strength) || 0;
				if (count >= CRITICAL_THRESHOLD && count < WARNING_THRESHOLD) {
					warningStrengths.push({ strength, count });
				}
			}

			// Este test no falla, solo reporta warnings
			if (warningStrengths.length > 0) {
				const details = warningStrengths
					.map((s) => `  ⚠️  ${s.strength}: ${s.count} menciones`)
					.join("\n");
				console.warn(
					`\n⚠️  Fortalezas con cobertura baja (< ${WARNING_THRESHOLD}):\n${details}\n`,
				);
			}
		});
	});

	describe("Estadísticas generales", () => {
		it("debe tener al menos 40 preguntas", () => {
			expect(feedbackQuestions.length).toBeGreaterThanOrEqual(40);
		});

		it("la cobertura promedio debe ser >= 20 menciones", () => {
			const total = Array.from(strengthCounts.values()).reduce(
				(sum, count) => sum + count,
				0,
			);
			const average = total / ALL_STRENGTHS.length;

			expect(average).toBeGreaterThanOrEqual(20);
		});

		it("la desviación estándar debe ser < 8 (buena distribución)", () => {
			const counts = Array.from(strengthCounts.values());
			const average = counts.reduce((sum, c) => sum + c, 0) / counts.length;
			const variance =
				counts.reduce((sum, c) => sum + Math.pow(c - average, 2), 0) /
				counts.length;
			const stdDev = Math.sqrt(variance);

			if (stdDev >= 8) {
				console.warn(
					`⚠️  Desviación estándar alta: ${stdDev.toFixed(2)} (target: < 8)`,
				);
			}

			expect(stdDev).toBeLessThan(8);
		});
	});

	describe("Balance por dominio", () => {
		it("cada dominio debe tener cobertura balanceada (±30%)", () => {
			const domainTotals = new Map<string, number>();

			for (const [domainName, strengths] of Object.entries(DOMAINS)) {
				const total = strengths.reduce(
					(sum, strength) => sum + (strengthCounts.get(strength) || 0),
					0,
				);
				domainTotals.set(domainName, total);
			}

			const totals = Array.from(domainTotals.values());
			const average = totals.reduce((sum, t) => sum + t, 0) / totals.length;

			const imbalances: Array<{ domain: string; total: number; diff: number }> =
				[];

			for (const [domainName, total] of domainTotals) {
				const diffPercent = Math.abs((total - average) / average) * 100;
				if (diffPercent > 30) {
					imbalances.push({ domain: domainName, total, diff: diffPercent });
				}
			}

			if (imbalances.length > 0) {
				const details = imbalances
					.map(
						(d) =>
							`  - ${d.domain}: ${d.total} menciones (${d.diff.toFixed(1)}% de desbalance)`,
					)
					.join("\n");
				throw new Error(
					`❌ Dominios desbalanceados (> 30% de diferencia con la media):\n${details}\nMedia: ${average.toFixed(1)} menciones`,
				);
			}
		});

		it("debe reportar estadísticas por dominio", () => {
			const domainStats: Record<string, { total: number; avg: number }> = {};

			for (const [domainName, strengths] of Object.entries(DOMAINS)) {
				const total = strengths.reduce(
					(sum, strength) => sum + (strengthCounts.get(strength) || 0),
					0,
				);
				domainStats[domainName] = {
					total,
					avg: total / strengths.length,
				};
			}

			console.log("\n📊 Estadísticas por dominio:");
			for (const [domain, stats] of Object.entries(domainStats)) {
				console.log(
					`  ${domain}: ${stats.total} total (avg ${stats.avg.toFixed(1)})`,
				);
			}
		});
	});

	describe("Reporte de cobertura completo", () => {
		it("debe generar reporte legible de todas las fortalezas", () => {
			const sortedCounts = Array.from(strengthCounts.entries())
				.sort((a, b) => b[1] - a[1])
				.map(([strength, count]) => {
					const status =
						count < CRITICAL_THRESHOLD
							? "❌"
							: count < WARNING_THRESHOLD
								? "⚠️ "
								: "✅";
					return { strength, count, status };
				});

			console.log("\n📈 Cobertura completa (ordenado por frecuencia):");
			console.log("Rank | Fortaleza         | Menciones | Estado");
			console.log("-----|-------------------|-----------|-------");

			sortedCounts.forEach((item, index) => {
				const rank = String(index + 1).padStart(2);
				const name = item.strength.padEnd(17);
				const count = String(item.count).padStart(2);
				console.log(`  ${rank} | ${name} | ${count}        | ${item.status}`);
			});

			const total = sortedCounts.reduce((sum, item) => sum + item.count, 0);
			const avg = total / sortedCounts.length;
			const median = sortedCounts[Math.floor(sortedCounts.length / 2)].count;

			console.log("\n📊 Estadísticas:");
			console.log(`  Total menciones: ${total}`);
			console.log(`  Promedio: ${avg.toFixed(1)}`);
			console.log(`  Mediana: ${median}`);
			console.log(
				`  Rango: ${sortedCounts[sortedCounts.length - 1].count}-${sortedCounts[0].count}`,
			);
			console.log(`  Total preguntas: ${feedbackQuestions.length}\n`);
		});
	});
});
