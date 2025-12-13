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
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development'
    
    // Determine database URL based on environment
    let databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    
    // Convert file: URLs to libsql: format for the adapter
    if (!databaseUrl || databaseUrl.startsWith("file:")) {
      const dbPath = databaseUrl?.replace("file:", "") || "./prisma/dev.db";
      databaseUrl = `file:${dbPath}`;
    }

    const authToken = process.env.TURSO_AUTH_TOKEN;

    // Log database configuration in development
    if (!isProduction) {
      const dbType = databaseUrl.startsWith("libsql://") ? "Turso" : "SQLite";
      console.log(`🗄️  Prisma: Using ${dbType} database`);
      console.log(`   URL: ${databaseUrl}`);
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

    const client = new PrismaClient({
      adapter,
      log: isProduction ? ["error"] : ["query", "error", "warn"],
    });
    
    // Test connection
    if (!isProduction) {
      console.log("🔍 Testing Prisma connection...");
    }

    return client;
  } catch (error) {
    console.error("❌ Failed to create Prisma client:", error);
    throw new Error(`Prisma client initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get or create the Prisma client instance
 * Uses lazy initialization to avoid issues with Edge Runtime
 */
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Export a Proxy that lazily initializes the client
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];
    
    // If it's a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  },
});
