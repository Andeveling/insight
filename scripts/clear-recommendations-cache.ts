/**
 * Clear corrupted recommendation cache
 *
 * This script deletes all cached AI recommendations to force regeneration
 * with the fixed moduleId field.
 *
 * Run with: bun run scripts/clear-recommendations-cache.ts
 */

import { prisma } from "../lib/prisma.db";

async function clearCache() {
	console.log("🧹 Clearing recommendation cache...");

	const result = await prisma.userRecommendation.deleteMany({
		where: {
			recommendationType: "next-module",
		},
	});

	console.log(`✓ Deleted ${result.count} cached recommendations`);
	console.log("✓ Users will get fresh recommendations on next dashboard visit");

	await prisma.$disconnect();
}

clearCache().catch((error) => {
	console.error("❌ Error clearing cache:", error);
	process.exit(1);
});
