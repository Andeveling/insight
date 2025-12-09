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

const schemaSql = `
-- User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Session table
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Account table
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    UNIQUE("providerId", "accountId")
);

-- Verification table
CREATE TABLE IF NOT EXISTS "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("identifier", "value")
);

-- UserProfile table
CREATE TABLE IF NOT EXISTS "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "career" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "description" TEXT,
    "hobbies" TEXT,
    "profileImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Team table
CREATE TABLE IF NOT EXISTS "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TeamMember table
CREATE TABLE IF NOT EXISTS "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
    UNIQUE("userId", "teamId")
);

-- Domain table
CREATE TABLE IF NOT EXISTS "Domain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "nameEs" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metaphor" TEXT NOT NULL,
    "keyQuestion" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contributionToTeam" TEXT NOT NULL,
    "potentialPitfall" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Strength table
CREATE TABLE IF NOT EXISTS "Strength" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "nameEs" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "briefDefinition" TEXT NOT NULL,
    "fullDefinition" TEXT NOT NULL,
    "howToUseMoreEffectively" TEXT,
    "watchOuts" TEXT,
    "strengthsDynamics" TEXT,
    "bestPartners" TEXT,
    "careerApplications" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE
);

-- UserStrength table
CREATE TABLE IF NOT EXISTS "UserStrength" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "strengthId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("strengthId") REFERENCES "Strength"("id") ON DELETE CASCADE,
    UNIQUE("userId", "strengthId"),
    UNIQUE("userId", "rank")
);

-- Focus table
CREATE TABLE IF NOT EXISTS "Focus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "nameEs" TEXT NOT NULL,
    "axis" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DomainFocus table
CREATE TABLE IF NOT EXISTS "DomainFocus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "focusId" TEXT NOT NULL,
    "weight" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE,
    FOREIGN KEY ("focusId") REFERENCES "Focus"("id") ON DELETE CASCADE,
    UNIQUE("domainId", "focusId")
);

-- Culture table
CREATE TABLE IF NOT EXISTS "Culture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "nameEs" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "focusEnergyId" TEXT NOT NULL,
    "focusOrientationId" TEXT NOT NULL,
    "attributes" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("focusEnergyId") REFERENCES "Focus"("id"),
    FOREIGN KEY ("focusOrientationId") REFERENCES "Focus"("id"),
    UNIQUE("focusEnergyId", "focusOrientationId")
);

-- Report table
CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT,
    "error" TEXT,
    "modelUsed" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "teamId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
    UNIQUE("type", "userId"),
    UNIQUE("type", "teamId")
);
`;

async function main() {
  console.log('🚀 Applying schema to Turso...')
  console.log('')

  try {
    // Create tables one by one
    console.log('[1/13] Creating User table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "emailVerified" INTEGER NOT NULL DEFAULT 0,
      "image" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('   ✅ Success')

    console.log('[2/13] Creating Session table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Session" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "expiresAt" DATETIME NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    )`)
    console.log('   ✅ Success')

    console.log('[3/13] Creating Account table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Account" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" DATETIME,
      "refreshTokenExpiresAt" DATETIME,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      UNIQUE("providerId", "accountId")
    )`)
    console.log('   ✅ Success')

    console.log('[4/13] Creating Verification table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Verification" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expiresAt" DATETIME NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("identifier", "value")
    )`)
    console.log('   ✅ Success')

    console.log('[5/13] Creating UserProfile table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "UserProfile" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL UNIQUE,
      "career" TEXT,
      "age" INTEGER,
      "gender" TEXT,
      "description" TEXT,
      "hobbies" TEXT,
      "profileImageUrl" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    )`)
    console.log('   ✅ Success')

    console.log('[6/13] Creating Team table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Team" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL UNIQUE,
      "description" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('   ✅ Success')

    console.log('[7/13] Creating TeamMember table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "TeamMember" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "teamId" TEXT NOT NULL,
      "role" TEXT,
      "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
      UNIQUE("userId", "teamId")
    )`)
    console.log('   ✅ Success')

    console.log('[8/13] Creating Domain table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Domain" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL UNIQUE,
      "nameEs" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "metaphor" TEXT NOT NULL,
      "keyQuestion" TEXT NOT NULL,
      "summary" TEXT NOT NULL,
      "contributionToTeam" TEXT NOT NULL,
      "potentialPitfall" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('   ✅ Success')

    console.log('[9/13] Creating Strength table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Strength" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL UNIQUE,
      "nameEs" TEXT NOT NULL,
      "domainId" TEXT NOT NULL,
      "briefDefinition" TEXT NOT NULL,
      "fullDefinition" TEXT NOT NULL,
      "howToUseMoreEffectively" TEXT,
      "watchOuts" TEXT,
      "strengthsDynamics" TEXT,
      "bestPartners" TEXT,
      "careerApplications" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE
    )`)
    console.log('   ✅ Success')

    console.log('[10/13] Creating UserStrength table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "UserStrength" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "strengthId" TEXT NOT NULL,
      "rank" INTEGER NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      FOREIGN KEY ("strengthId") REFERENCES "Strength"("id") ON DELETE CASCADE,
      UNIQUE("userId", "strengthId"),
      UNIQUE("userId", "rank")
    )`)
    console.log('   ✅ Success')

    console.log('[11/13] Creating Focus table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Focus" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL UNIQUE,
      "nameEs" TEXT NOT NULL,
      "axis" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "icon" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('   ✅ Success')

    console.log('[12/13] Creating DomainFocus table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "DomainFocus" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "domainId" TEXT NOT NULL,
      "focusId" TEXT NOT NULL,
      "weight" REAL NOT NULL DEFAULT 1.0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE,
      FOREIGN KEY ("focusId") REFERENCES "Focus"("id") ON DELETE CASCADE,
      UNIQUE("domainId", "focusId")
    )`)
    console.log('   ✅ Success')

    console.log('[13/13] Creating Culture table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Culture" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL UNIQUE,
      "nameEs" TEXT NOT NULL,
      "subtitle" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "focusEnergyId" TEXT NOT NULL,
      "focusOrientationId" TEXT NOT NULL,
      "attributes" TEXT NOT NULL,
      "icon" TEXT,
      "color" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("focusEnergyId") REFERENCES "Focus"("id"),
      FOREIGN KEY ("focusOrientationId") REFERENCES "Focus"("id"),
      UNIQUE("focusEnergyId", "focusOrientationId")
    )`)
    console.log('   ✅ Success')

    console.log('[14/14] Creating Report table...')
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Report" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "type" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "version" INTEGER NOT NULL DEFAULT 1,
      "content" TEXT,
      "error" TEXT,
      "modelUsed" TEXT,
      "metadata" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "userId" TEXT,
      "teamId" TEXT,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE,
      UNIQUE("type", "userId"),
      UNIQUE("type", "teamId")
    )`)
    console.log('   ✅ Success')

    console.log('')
    console.log('✅ All 14 tables created successfully!')
    console.log('')
    console.log('💡 Now run the seeders:')
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
