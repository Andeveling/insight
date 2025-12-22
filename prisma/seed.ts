import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";
import { seedAssessmentQuestions } from "./seeders/assessment-questions.seeder";
import { seedCultures } from "./seeders/cultures.seeder";
import { seedDomains } from "./seeders/domains.seeder";
import { seedFeedbackQuestions } from "./seeders/feedback-questions.seeder";
import { seedFocus } from "./seeders/focus.seeder";
import { seedGamification } from "./seeders/gamification.seeder";
import { seedProjectTypes } from "./seeders/seed-project-types";
import { seedStrengthLevels } from "./seeders/strength-levels.seeder";
import { seedStrengths } from "./seeders/strengths.seeder";
import { seedTeams } from "./seeders/teams.seeder";
import { seedUserProfiles } from "./seeders/user-profiles.seeder";

// Create the Prisma adapter with the database URL
// Use Turso if credentials are available, otherwise use local SQLite
const databaseUrl =
	process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log(
	`📦 Connecting to database: ${databaseUrl.includes("turso.io") ? "Turso (Remote)" : "Local SQLite"}`,
);

const adapter = new PrismaLibSql({
	url: databaseUrl,
	authToken: authToken,
});
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🚀 Starting database seeding...\n");

	try {
		// Seed in order of dependencies
		await seedDomains(prisma);
		await seedStrengths(prisma);
		await seedFocus(prisma); // After domains
		await seedCultures(prisma); // After focus
		await seedTeams(prisma);
		await seedUserProfiles(prisma);
		await seedAssessmentQuestions(prisma); // After domains and strengths
		await seedFeedbackQuestions(prisma); // After strengths (for strength mapping validation)
		await seedProjectTypes(); // Sub-team project types
		await seedGamification(prisma); // Development modules, challenges, and badges
		await seedStrengthLevels(prisma); // Strength maturity levels system

		console.log("\n✨ Database seeding completed successfully!");
	} catch (error) {
		console.error("❌ Error during seeding:", error);
		throw error;
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		console.log("🔌 Disconnected from database");
	});
