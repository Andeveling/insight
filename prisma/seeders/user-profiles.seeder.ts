import { usersData } from "../data/users.data";
import type { PrismaClient } from "../../generated/prisma/client";
import { auth } from "../../lib/auth";

export async function seedUserProfiles(prisma: PrismaClient) {
  console.log("🌱 Seeding user profiles...");

  // Get the nojau team
  const nojauTeam = await prisma.team.findUnique({
    where: { name: "nojau" },
  });

  if (!nojauTeam) {
    console.error('❌ Team "nojau" not found. Please run teams seeder first.');
    return;
  }

  for (const userData of usersData) {
    // Use BetterAuth API to create users with proper password hashing (scrypt by default)
    // This ensures compatibility with BetterAuth's authentication flow
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        console.log(`⚠️  User already exists: ${userData.email}`);
      } else {
        // Create user using BetterAuth API which handles password hashing with scrypt
        const result = await auth.api.signUpEmail({
          body: {
            email: userData.email,
            password: userData.password,
            name: userData.name,
          },
        });

        userId = result.user.id;
      }

      // Create or update user profile
      await prisma.userProfile.upsert({
        where: { userId },
        update: {
          career: userData.career || null,
          age: userData.age || null,
          gender: userData.gender || null,
          description: userData.description || null,
          hobbies: userData.hobbies ? JSON.stringify(userData.hobbies) : null,
          profileImageUrl: userData.profileImageUrl || null,
        },
        create: {
          userId,
          career: userData.career || null,
          age: userData.age || null,
          gender: userData.gender || null,
          description: userData.description || null,
          hobbies: userData.hobbies ? JSON.stringify(userData.hobbies) : null,
          profileImageUrl: userData.profileImageUrl || null,
        },
      });

      // Add user to team
      await prisma.teamMember.upsert({
        where: {
          userId_teamId: {
            userId,
            teamId: nojauTeam.id,
          },
        },
        update: {},
        create: {
          userId,
          teamId: nojauTeam.id,
          role: userData.career || "Team Member",
        },
      });

      // Assign strengths
      if (userData.strengths && userData.strengths.length > 0) {
        // Delete existing strengths for this user
        await prisma.userStrength.deleteMany({
          where: { userId },
        });

        // Add new strengths
        for (let i = 0; i < userData.strengths.length; i++) {
          const strengthName = userData.strengths[ i ];
          const strength = await prisma.strength.findUnique({
            where: { name: strengthName },
          });

          if (strength) {
            await prisma.userStrength.create({
              data: {
                userId,
                strengthId: strength.id,
                rank: i + 1, // Rank from 1 to 5
              },
            });
          } else {
            console.warn(
              `⚠️  Strength not found: ${strengthName} for user ${userData.name}`,
            );
          }
        }
      }

      console.log(
        `✅ Seeded user profile: ${userData.name} (${userData.email}) with ${userData.strengths?.length || 0} strengths`,
      );
    } catch (error) {
      console.error(`❌ Error seeding user ${userData.email}:`, error);
    }
  }

  console.log(`\n✅ Seeded ${usersData.length} user profiles`);
  console.log("\n📝 Test credentials:");
  console.log("  andres@nojau.co - Password: andres-123");
  console.log("  Other users - Password: password123");
}
