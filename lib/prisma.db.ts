import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates a Prisma client configured for the current environment:
 * - Development: Uses local SQLite file via libSQL adapter
 * - Preview/Production: Uses Turso cloud database
 */
function createPrismaClient() {
  // Determine database URL based on environment
  const databaseUrl =
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    "file:./prisma/dev.db";

  const authToken = process.env.TURSO_AUTH_TOKEN;
  const isProduction = process.env.NODE_ENV === "production";
  const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development'

  // Log database configuration in development
  if (!isProduction) {
    const dbType = databaseUrl.startsWith("libsql://") ? "Turso" : "SQLite";
    console.log(`🗄️  Prisma: Using ${dbType} database`);
    if (vercelEnv) {
      console.log(`   Environment: ${vercelEnv}`);
    }
  }

  // Validate production configuration
  if (isProduction && !process.env.TURSO_DATABASE_URL) {
    console.warn(
      "⚠️  Warning: TURSO_DATABASE_URL not set in production. Using fallback."
    );
  }

  const adapter = new PrismaLibSql({
    url: databaseUrl,
    authToken,
  });

  return new PrismaClient({
    adapter,
    log: isProduction ? [ "error" ] : [ "query", "error", "warn" ],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
