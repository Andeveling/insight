import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

/**
 * Creates a Prisma client configured for the current environment
 */
function createPrismaClient(): PrismaClient {
	const isProduction = process.env.NODE_ENV === "production";

	// Determine database URL
	const databaseUrl =
		process.env.TURSO_DATABASE_URL ||
		process.env.DATABASE_URL ||
		"file:./dev.db";

	// For local SQLite, ensure proper file path
	const finalUrl = databaseUrl.startsWith("file:")
		? databaseUrl
		: databaseUrl.startsWith("libsql://")
			? databaseUrl
			: `file:${databaseUrl}`;

	const authToken = process.env.TURSO_AUTH_TOKEN;

	const adapter = new PrismaLibSql({
		url: finalUrl,
		authToken,
	});

	return new PrismaClient({
		adapter,
		log: isProduction ? ["error"] : ["error", "warn"],
	});
}

/**
 * Singleton Prisma client instance
 * Uses global variable to persist across hot reloads in development
 */
export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}
