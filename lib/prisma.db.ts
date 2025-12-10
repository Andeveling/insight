import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Always use the libSQL adapter (works for both Turso remote and local SQLite)
  const adapter = new PrismaLibSql({
    url:
      process.env.TURSO_DATABASE_URL ||
      process.env.DATABASE_URL ||
      "file:./prisma/dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? [ "query", "error", "warn" ]
        : [ "error" ],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
