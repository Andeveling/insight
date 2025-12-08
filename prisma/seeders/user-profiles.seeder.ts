import type { PrismaClient } from '../../generated/prisma/client'
import { usersData } from '../../data/users.data'

export async function seedUserProfiles(prisma: PrismaClient) {
  console.log('🌱 Seeding user profiles...')

  // Get the nojau team
  const nojauTeam = await prisma.team.findUnique({
    where: { name: 'nojau' },
  })

  if (!nojauTeam) {
    console.error('❌ Team "nojau" not found. Please run teams seeder first.')
    return
  }

  // BetterAuth bcrypt hash for "password123"
  const defaultPasswordHash = '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u'

  for (const userData of usersData) {
    // Create or update user with BetterAuth account
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
      },
      create: {
        name: userData.name,
        email: userData.email,
        emailVerified: true,
        image: userData.profileImageUrl || null,
      },
    })

    // Create account for password authentication
    await prisma.account.upsert({
      where: {
        providerId_accountId: {
          providerId: 'credential',
          accountId: user.id,
        },
      },
      update: {
        password: defaultPasswordHash,
      },
      create: {
        userId: user.id,
        accountId: user.id,
        providerId: 'credential',
        password: defaultPasswordHash,
      },
    })

    // Create or update user profile
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        career: userData.career || null,
        age: userData.age || null,
        gender: userData.gender || null,
        description: userData.description || null,
        hobbies: userData.hobbies ? JSON.stringify(userData.hobbies) : null,
        profileImageUrl: userData.profileImageUrl || null,
      },
      create: {
        userId: user.id,
        career: userData.career || null,
        age: userData.age || null,
        gender: userData.gender || null,
        description: userData.description || null,
        hobbies: userData.hobbies ? JSON.stringify(userData.hobbies) : null,
        profileImageUrl: userData.profileImageUrl || null,
      },
    })

    // Add user to team
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: nojauTeam.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        teamId: nojauTeam.id,
        role: userData.career || 'Team Member',
      },
    })

    // Assign strengths
    if (userData.strengths && userData.strengths.length > 0) {
      // Delete existing strengths for this user
      await prisma.userStrength.deleteMany({
        where: { userId: user.id },
      })

      // Add new strengths
      for (let i = 0; i < userData.strengths.length; i++) {
        const strengthName = userData.strengths[i]
        const strength = await prisma.strength.findUnique({
          where: { name: strengthName },
        })

        if (strength) {
          await prisma.userStrength.create({
            data: {
              userId: user.id,
              strengthId: strength.id,
              rank: i + 1, // Rank from 1 to 5
            },
          })
        } else {
          console.warn(`⚠️  Strength not found: ${strengthName} for user ${userData.name}`)
        }
      }
    }

    console.log(`✅ Seeded user profile: ${userData.name} with ${userData.strengths?.length || 0} strengths`)
  }

  console.log(`\n✅ Seeded ${usersData.length} user profiles`)
  console.log('\n📝 Test credentials:')
  console.log('  All users have password: password123')
}
