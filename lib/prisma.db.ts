import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import "dotenv/config"
import { env } from 'prisma/config'

// Create the Prisma adapter with the database URL
const adapter = new PrismaBetterSqlite3({ url: env('DATABASE_URL') })

// Singleton pattern for PrismaClient in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
