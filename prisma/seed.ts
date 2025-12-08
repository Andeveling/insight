import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client'
import { seedUsers } from './seeders'

// Create the Prisma adapter with the database URL
// Path is relative to project root since seed is run from there
const adapter = new PrismaBetterSqlite3({ url: 'file:./data/dev.db' })

const prisma = new PrismaClient({ adapter })

export async function seed() {
  console.log('🌱 Seeding database...')

  // Run all seeders
  await seedUsers(prisma)
  // await seedTasks(prisma) // Comentado: modelo Task no existe

  console.log('✅ Seeding completed!')
}

// Run the seeder when executed directly
seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Disconnected from database')
  })