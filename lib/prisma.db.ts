import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates a Prisma client configured for the current environment
 */
function createPrismaClient(): PrismaClient {
  const isProduction = process.env.NODE_ENV === "production";

  // Determine database URL
  let databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;

  // Default to local SQLite for development
  if (!databaseUrl || databaseUrl.startsWith("file:")) {
    const dbPath = databaseUrl?.replace("file:", "") || "./prisma/dev.db";
    databaseUrl = `file:${dbPath}`;
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;

  const adapter = new PrismaLibSql({
    url: databaseUrl,
    authToken,
  });

  return new PrismaClient({
    adapter,
    log: isProduction ? [ "error" ] : [ "error", "warn" ],
  });
}

/**
 * Singleton Prisma client instance
 * Uses globalThis to persist across hot reloads in development
 */
export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
