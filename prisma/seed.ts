import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client'
import { seedDomains } from './seeders/domains.seeder'
import { seedStrengths } from './seeders/strengths.seeder'
import { seedTeams } from './seeders/teams.seeder'
import { seedUserProfiles } from './seeders/user-profiles.seeder'

// Create the Prisma adapter with the database URL
const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Starting database seeding...\n')

  try {
    // Seed in order of dependencies
    await seedDomains(prisma)
    await seedStrengths(prisma)
    await seedTeams(prisma)
    await seedUserProfiles(prisma)

    console.log('\n✨ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Disconnected from database')
  })