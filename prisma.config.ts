import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "bun prisma/seed.ts",
	},
	// Prisma CLI uses LOCAL_DATABASE_URL for local migrations
	// Runtime uses TURSO_DATABASE_URL via the adapter in prisma.db.ts
	// In production (Vercel), we just need to generate the client, no DB connection required
	datasource: {
		url: process.env.LOCAL_DATABASE_URL || "file:./dev.db",
	},
});
