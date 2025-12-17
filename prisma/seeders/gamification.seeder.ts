import type { PrismaClient } from "../../generated/prisma/client";
import { badgesData } from "../data/badges.data";
import { challengesData } from "../data/challenges.data";
import { developmentModulesData } from "../data/development-modules.data";

/**
 * Seeds development modules into the database
 */
export async function seedDevelopmentModules(prisma: PrismaClient) {
  console.log("🌱 Seeding development modules...");

  for (const devModule of developmentModulesData) {
    await prisma.developmentModule.upsert({
      where: { key: devModule.key },
      update: {
        titleEs: devModule.titleEs,
        descriptionEs: devModule.descriptionEs,
        content: devModule.content,
        estimatedMinutes: devModule.estimatedMinutes,
        xpReward: devModule.xpReward,
        level: devModule.level,
        strengthKey: devModule.strengthKey ?? null,
        domainKey: devModule.domainKey ?? null,
        order: devModule.order,
        isActive: true,
        moduleType: "general", // Ensure all seeded modules are general type
      },
      create: {
        key: devModule.key,
        titleEs: devModule.titleEs,
        descriptionEs: devModule.descriptionEs,
        content: devModule.content,
        estimatedMinutes: devModule.estimatedMinutes,
        xpReward: devModule.xpReward,
        level: devModule.level,
        strengthKey: devModule.strengthKey ?? null,
        domainKey: devModule.domainKey ?? null,
        order: devModule.order,
        isActive: true,
        moduleType: "general", // All seeded modules are general type
      },
    });
  }

  console.log(`✅ Seeded ${developmentModulesData.length} development modules`);
}

/**
 * Seeds challenges for each development module
 */
export async function seedChallenges(prisma: PrismaClient) {
  console.log("🌱 Seeding challenges...");

  let seededCount = 0;

  for (const challenge of challengesData) {
    // Find the development module by key
    const devModule = await prisma.developmentModule.findUnique({
      where: { key: challenge.moduleKey },
    });

    if (!devModule) {
      console.warn(
        `⚠️ Module not found for challenge: ${challenge.moduleKey}`
      );
      continue;
    }

    // Check if challenge already exists for this module and order
    const existing = await prisma.challenge.findFirst({
      where: {
        moduleId: devModule.id,
        order: challenge.order,
      },
    });

    if (existing) {
      await prisma.challenge.update({
        where: { id: existing.id },
        data: {
          titleEs: challenge.titleEs,
          descriptionEs: challenge.descriptionEs,
          type: challenge.type,
          xpReward: challenge.xpReward,
        },
      });
    } else {
      await prisma.challenge.create({
        data: {
          moduleId: devModule.id,
          titleEs: challenge.titleEs,
          descriptionEs: challenge.descriptionEs,
          type: challenge.type,
          xpReward: challenge.xpReward,
          order: challenge.order,
        },
      });
    }

    seededCount++;
  }

  console.log(`✅ Seeded ${seededCount} challenges`);
}

/**
 * Seeds badges for the gamification system
 */
export async function seedBadges(prisma: PrismaClient) {
  console.log("🌱 Seeding badges...");

  for (const badge of badgesData) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: {
        nameEs: badge.nameEs,
        descriptionEs: badge.descriptionEs,
        iconUrl: badge.iconUrl,
        tier: badge.tier,
        unlockCriteria: JSON.stringify(badge.unlockCriteria),
        xpReward: badge.xpReward,
        isActive: true,
      },
      create: {
        key: badge.key,
        nameEs: badge.nameEs,
        descriptionEs: badge.descriptionEs,
        iconUrl: badge.iconUrl,
        tier: badge.tier,
        unlockCriteria: JSON.stringify(badge.unlockCriteria),
        xpReward: badge.xpReward,
        isActive: true,
      },
    });
  }

  console.log(`✅ Seeded ${badgesData.length} badges`);
}

/**
 * Seeds all gamification data: modules, challenges, and badges
 */
export async function seedGamification(prisma: PrismaClient) {
  console.log("\n📚 Starting gamification seeding...\n");

  // Seed in order of dependencies
  await seedDevelopmentModules(prisma);
  await seedChallenges(prisma);
  await seedBadges(prisma);

  console.log("\n✅ Gamification seeding completed!\n");
}
