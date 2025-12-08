import culturesData from "../../data/cultures.data";
import type { PrismaClient } from "../../generated/prisma/client";

/**
 * Seeds Culture data
 *
 * Cultures emerge from the combination of two focuses:
 * - Energy Focus (Action or Reflection)
 * - Orientation Focus (Results or People)
 *
 * Matrix:
 *                    Results         People
 *           ┌────────────────┬────────────────┐
 *   Action  │   Execution    │   Influence    │
 *           ├────────────────┼────────────────┤
 * Reflection│   Strategy     │   Cohesion     │
 *           └────────────────┴────────────────┘
 */
export async function seedCultures(prisma: PrismaClient) {
  console.log("🌱 Seeding cultures...");

  // Get focus IDs
  const focuses = await prisma.focus.findMany();
  const focusMap: Record<string, string> = {};
  for (const focus of focuses) {
    focusMap[ focus.name ] = focus.id;
  }

  for (const culture of culturesData) {
    const energyFocusId = focusMap[ culture.focusEnergy ];
    const orientationFocusId = focusMap[ culture.focusOrientation ];

    if (!energyFocusId || !orientationFocusId) {
      console.warn(
        `⚠️ Missing focus for culture ${culture.name}: energy=${culture.focusEnergy}, orientation=${culture.focusOrientation}`,
      );
      continue;
    }

    await prisma.culture.upsert({
      where: { name: culture.name },
      update: {
        nameEs: culture.nameEs,
        subtitle: culture.subtitle,
        description: culture.description,
        focusEnergyId: energyFocusId,
        focusOrientationId: orientationFocusId,
        attributes: JSON.stringify(culture.attributes),
        icon: culture.icon,
        color: culture.color,
      },
      create: {
        name: culture.name,
        nameEs: culture.nameEs,
        subtitle: culture.subtitle,
        description: culture.description,
        focusEnergyId: energyFocusId,
        focusOrientationId: orientationFocusId,
        attributes: JSON.stringify(culture.attributes),
        icon: culture.icon,
        color: culture.color,
      },
    });
  }

  console.log(`✅ Seeded ${culturesData.length} cultures`);
}
