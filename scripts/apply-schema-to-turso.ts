import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../generated/prisma/client'

const databaseUrl = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!databaseUrl) {
  console.error('❌ TURSO_DATABASE_URL is required')
  process.exit(1)
}

console.log(`📦 Connecting to Turso: ${databaseUrl}`)

const adapter = new PrismaLibSql({
  url: databaseUrl,
  authToken: authToken
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Applying schema to Turso...')
  console.log('')

  try {
    // Use $executeRawUnsafe to run the schema SQL
    // You need to generate this SQL from your schema
    console.log('✅ To apply your schema to Turso, you have two options:')
    console.log('')
    console.log('Option 1: Use Turso CLI (Recommended)')
    console.log('-------------------------------------------')
    console.log('1. Generate migration SQL:')
    console.log('   prisma migrate dev --name init --create-only')
    console.log('')
    console.log('2. Apply to Turso:')
    console.log('   turso db shell insights-vercel-icfg-uwi8w2qjh0fyicqca7jqbzxj < prisma/migrations/[YOUR_MIGRATION]/migration.sql')
    console.log('')
    console.log('Option 2: Use Prisma db push (if it supports libSQL with auth)')
    console.log('-------------------------------------------')
    console.log('   This may not work with Turso auth tokens')
    console.log('')
    console.log('💡 After applying the schema, run:')
    console.log('   pnpm db:seed:turso')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
