# Quickstart Guide: Sistema de Niveles de Madurez para Fortalezas

**Feature**: strength-levels | **For**: Developers implementing this feature

## Prerequisites

- Node.js 22+ with Bun installed
- Turso database connection configured
- Existing Insight project cloned with branch `012-strength-levels` checked out
- User authentication working (BetterAuth)
- At least one user with HIGH5 strengths identified (from feature 002-strength-quiz)

## 1. Database Setup (10 min)

### Step 1.1: Update Prisma Schema

Add new models to `prisma/schema.prisma`:

```prisma
enum MaturityLevel {
  SPONGE
  CONNECTOR
  GUIDE
  ALCHEMIST
}

enum QuestType {
  DAILY
  BOSS_BATTLE
  COMBO_BREAKER
  COOPERATIVE
}

enum QuestStatus {
  AVAILABLE
  IN_PROGRESS
  COMPLETED
  EXPIRED
}

model StrengthMaturityLevel {
  id              String        @id @default(uuid())
  userId          String
  strengthId      String
  maturityLevel   MaturityLevel @default(SPONGE)
  xpCurrent       Int           @default(0)
  xpTotal         Int           @default(0)
  levelReachedAt  DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  strength Strength @relation(fields: [strengthId], references: [id], onDelete: Cascade)

  @@unique([userId, strengthId])
  @@index([userId])
  @@index([maturityLevel])
}

model MaturityLevelDefinition {
  id             String        @id @default(uuid())
  level          MaturityLevel @unique
  name           String
  nameEs         String
  description    String
  descriptionEs  String
  xpThreshold    Int
  iconUrl        String?
  order          Int
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@index([order])
}

model ComboBreaker {
  id                    String        @id @default(uuid())
  name                  String        @unique
  nameEs                String
  description           String
  descriptionEs         String
  xpReward              Int           @default(100)
  cooldownHours         Int           @default(72)
  minMaturityLevel      MaturityLevel @default(CONNECTOR)
  requiredStrengthCount Int           @default(2)
  isActive              Boolean       @default(true)
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  comboStrengths ComboStrength[]
  quests         Quest[]

  @@index([isActive])
}

model ComboStrength {
  id             String @id @default(uuid())
  comboBreakerId String
  strengthId     String
  order          Int    @default(0)

  comboBreaker ComboBreaker @relation(fields: [comboBreakerId], references: [id], onDelete: Cascade)
  strength     Strength     @relation(fields: [strengthId], references: [id], onDelete: Cascade)

  @@unique([comboBreakerId, strengthId])
  @@index([comboBreakerId])
  @@index([strengthId])
}

model Quest {
  id              String      @id @default(uuid())
  userId          String?
  type            QuestType
  strengthId      String
  comboBreakerId  String?
  title           String
  description     String
  xpReward        Int
  status          QuestStatus @default(AVAILABLE)
  expiresAt       DateTime?
  cooldownUntil   DateTime?
  isTemplate      Boolean     @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user             User?              @relation(fields: [userId], references: [id], onDelete: Cascade)
  strength         Strength           @relation(fields: [strengthId], references: [id], onDelete: Cascade)
  comboBreaker     ComboBreaker?      @relation(fields: [comboBreakerId], references: [id], onDelete: Cascade)
  questCompletions QuestCompletion[]

  @@index([userId, status, expiresAt])
  @@index([type, isTemplate])
  @@index([strengthId])
}

model QuestCompletion {
  id             String    @id @default(uuid())
  questId        String
  userId         String
  xpAwarded      Int
  completedAt    DateTime  @default(now())
  confirmedBy    String?
  confirmedAt    DateTime?
  reflectionNote String?
  metadata       String?

  quest       Quest @relation(fields: [questId], references: [id], onDelete: Restrict)
  user        User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  confirmedByUser User? @relation("ConfirmedQuests", fields: [confirmedBy], references: [id])

  @@unique([userId, questId])
  @@index([userId, completedAt])
  @@index([questId])
}
```

**También agregar a modelo `User`**:

```prisma
model User {
  // ... existing fields
  
  // Strength Levels relations
  strengthMaturityLevels StrengthMaturityLevel[]
  quests                 Quest[]
  questCompletions       QuestCompletion[]
  confirmedQuests        QuestCompletion[]       @relation("ConfirmedQuests")
}
```

**También agregar a modelo `Strength`**:

```prisma
model Strength {
  // ... existing fields
  
  // Strength Levels relations
  maturityLevels StrengthMaturityLevel[]
  quests         Quest[]
  comboStrengths ComboStrength[]
}
```

### Step 1.2: Generate Migration

```bash
bun prisma migrate dev --name add_strength_levels
```

### Step 1.3: Seed Initial Data

Create `prisma/seeders/strength-levels.seeder.ts`:

```typescript
import { prisma } from '@/lib/prisma.db';
import maturityLevelsData from '../data/strength-levels/maturity-levels.json';
import questTemplatesData from '../data/strength-levels/quest-templates.json';
import comboBreakersData from '../data/strength-levels/combo-breakers.json';

export async function seedStrengthLevels() {
  console.log('🌱 Seeding strength levels data...');

  // 1. Seed MaturityLevelDefinition
  for (const level of maturityLevelsData) {
    await prisma.maturityLevelDefinition.upsert({
      where: { level: level.level },
      update: level,
      create: level,
    });
  }
  console.log('✅ Maturity levels seeded');

  // 2. Seed Quest templates
  for (const template of questTemplatesData) {
    const strength = await prisma.strength.findUnique({
      where: { name: template.strengthName },
    });
    if (!strength) {
      console.warn(`⚠️  Strength not found: ${template.strengthName}`);
      continue;
    }

    await prisma.quest.upsert({
      where: { 
        userId_type_strengthId: { 
          userId: null, 
          type: template.type, 
          strengthId: strength.id 
        } 
      },
      update: {
        title: template.title,
        description: template.description,
        xpReward: template.xpReward,
      },
      create: {
        strengthId: strength.id,
        type: template.type,
        title: template.title,
        description: template.description,
        xpReward: template.xpReward,
        isTemplate: true,
        status: 'AVAILABLE',
      },
    });
  }
  console.log('✅ Quest templates seeded');

  // 3. Seed ComboBreakers
  for (const combo of comboBreakersData) {
    const createdCombo = await prisma.comboBreaker.upsert({
      where: { name: combo.name },
      update: {
        nameEs: combo.nameEs,
        description: combo.description,
        descriptionEs: combo.descriptionEs,
        xpReward: combo.xpReward,
        cooldownHours: combo.cooldownHours,
        minMaturityLevel: combo.minMaturityLevel,
        requiredStrengthCount: combo.requiredStrengths.length,
      },
      create: {
        name: combo.name,
        nameEs: combo.nameEs,
        description: combo.description,
        descriptionEs: combo.descriptionEs,
        xpReward: combo.xpReward,
        cooldownHours: combo.cooldownHours,
        minMaturityLevel: combo.minMaturityLevel,
        requiredStrengthCount: combo.requiredStrengths.length,
      },
    });

    // Create ComboStrength relations
    for (const [index, strengthName] of combo.requiredStrengths.entries()) {
      const strength = await prisma.strength.findUnique({
        where: { name: strengthName },
      });
      if (!strength) {
        console.warn(`⚠️  Strength not found for combo: ${strengthName}`);
        continue;
      }

      await prisma.comboStrength.upsert({
        where: {
          comboBreakerId_strengthId: {
            comboBreakerId: createdCombo.id,
            strengthId: strength.id,
          },
        },
        update: { order: index },
        create: {
          comboBreakerId: createdCombo.id,
          strengthId: strength.id,
          order: index,
        },
      });
    }
  }
  console.log('✅ Combo breakers seeded');

  // 4. Backfill existing UserStrengths
  const existingUserStrengths = await prisma.userStrength.findMany();
  for (const us of existingUserStrengths) {
    await prisma.strengthMaturityLevel.upsert({
      where: {
        userId_strengthId: {
          userId: us.userId,
          strengthId: us.strengthId,
        },
      },
      update: {},
      create: {
        userId: us.userId,
        strengthId: us.strengthId,
        maturityLevel: 'SPONGE',
        xpCurrent: 0,
        xpTotal: 0,
      },
    });
  }
  console.log('✅ Backfilled strength maturity levels for existing users');
}
```

Run seeder:

```bash
bun prisma db seed
```

---

## 2. Create Core Services (20 min)

### Step 2.1: XP Calculator Service

Create `lib/services/strength-levels/xp-calculator.ts`:

```typescript
import { MaturityLevel } from '@/lib/types/strength-levels.types';

const XP_THRESHOLDS: Record<MaturityLevel, number> = {
  [MaturityLevel.SPONGE]: 0,
  [MaturityLevel.CONNECTOR]: 500,
  [MaturityLevel.GUIDE]: 1500,
  [MaturityLevel.ALCHEMIST]: 5000,
};

const LEVEL_ORDER: MaturityLevel[] = [
  MaturityLevel.SPONGE,
  MaturityLevel.CONNECTOR,
  MaturityLevel.GUIDE,
  MaturityLevel.ALCHEMIST,
];

export function getNextLevel(currentLevel: MaturityLevel): MaturityLevel | null {
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel);
  return currentIndex < LEVEL_ORDER.length - 1 
    ? LEVEL_ORDER[currentIndex + 1] 
    : null;
}

export function getXpForNextLevel(currentLevel: MaturityLevel): number | null {
  const nextLevel = getNextLevel(currentLevel);
  return nextLevel ? XP_THRESHOLDS[nextLevel] : null;
}

export function calculateProgress(
  currentLevel: MaturityLevel,
  xpCurrent: number
): {
  progressPercent: number;
  xpForNextLevel: number | null;
  isMaxLevel: boolean;
} {
  const xpForNextLevel = getXpForNextLevel(currentLevel);
  
  if (xpForNextLevel === null) {
    return {
      progressPercent: 100,
      xpForNextLevel: null,
      isMaxLevel: true,
    };
  }

  const progressPercent = Math.min(100, (xpCurrent / xpForNextLevel) * 100);
  
  return {
    progressPercent,
    xpForNextLevel,
    isMaxLevel: false,
  };
}

export function shouldLevelUp(
  currentLevel: MaturityLevel,
  xpCurrent: number
): { shouldLevelUp: boolean; newLevel?: MaturityLevel } {
  const xpForNextLevel = getXpForNextLevel(currentLevel);
  
  if (xpForNextLevel === null) {
    return { shouldLevelUp: false };
  }

  if (xpCurrent >= xpForNextLevel) {
    return {
      shouldLevelUp: true,
      newLevel: getNextLevel(currentLevel)!,
    };
  }

  return { shouldLevelUp: false };
}
```

### Step 2.2: Quest Generator Service

Create `app/dashboard/strength-levels/_services/quest-generator.service.ts`:

```typescript
import { prisma } from '@/lib/prisma.db';
import { QuestType, QuestStatus } from '@/lib/types/strength-levels.types';

export async function generateDailyQuestsForUser(userId: string) {
  // Get user's strengths
  const userStrengths = await prisma.userStrength.findMany({
    where: { userId },
    include: { strength: true },
  });

  const quests = [];

  for (const us of userStrengths) {
    // Check if already has active daily quest for this strength
    const existingQuest = await prisma.quest.findFirst({
      where: {
        userId,
        strengthId: us.strengthId,
        type: QuestType.DAILY,
        status: { in: [QuestStatus.AVAILABLE, QuestStatus.IN_PROGRESS] },
        expiresAt: { gt: new Date() },
      },
    });

    if (existingQuest) continue; // Skip if already has active quest

    // Get random template for this strength
    const templates = await prisma.quest.findMany({
      where: {
        strengthId: us.strengthId,
        type: QuestType.DAILY,
        isTemplate: true,
      },
    });

    if (templates.length === 0) continue;

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Create quest instance
    const quest = await prisma.quest.create({
      data: {
        userId,
        strengthId: us.strengthId,
        type: QuestType.DAILY,
        title: randomTemplate.title,
        description: randomTemplate.description,
        xpReward: randomTemplate.xpReward,
        status: QuestStatus.AVAILABLE,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isTemplate: false,
      },
    });

    quests.push(quest);
  }

  return quests;
}
```

---

## 3. Create Server Actions (15 min)

### Step 3.1: Complete Quest Action

Create `app/dashboard/strength-levels/_actions/complete-quest.ts`:

```typescript
'use server';

import { prisma } from '@/lib/prisma.db';
import { getSession } from '@/lib/auth';
import { completeQuestSchema } from '../contracts/complete-quest.schema';
import { QuestStatus } from '@/lib/types/strength-levels.types';
import { shouldLevelUp } from '@/lib/services/strength-levels/xp-calculator';

export async function completeQuest(input: unknown) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: 'Unauthorized' };
  }

  const validated = completeQuestSchema.parse(input);

  return await prisma.$transaction(async (tx) => {
    // 1. Get quest
    const quest = await tx.quest.findUnique({
      where: { id: validated.questId },
      include: { strength: true },
    });

    if (!quest || quest.userId !== session.user.id) {
      throw new Error('Quest not found or unauthorized');
    }

    if (quest.status !== QuestStatus.AVAILABLE && quest.status !== QuestStatus.IN_PROGRESS) {
      throw new Error('Quest already completed or expired');
    }

    // 2. Create QuestCompletion (idempotency check via unique constraint)
    const completion = await tx.questCompletion.create({
      data: {
        questId: quest.id,
        userId: session.user.id,
        xpAwarded: quest.xpReward,
        reflectionNote: validated.reflectionNote,
        confirmedBy: validated.confirmedBy,
      },
    });

    // 3. Update quest status
    await tx.quest.update({
      where: { id: quest.id },
      data: { status: QuestStatus.COMPLETED },
    });

    // 4. Update StrengthMaturityLevel
    const maturityLevel = await tx.strengthMaturityLevel.findUnique({
      where: {
        userId_strengthId: {
          userId: session.user.id,
          strengthId: quest.strengthId,
        },
      },
    });

    if (!maturityLevel) {
      throw new Error('Maturity level not found');
    }

    const newXpCurrent = maturityLevel.xpCurrent + quest.xpReward;
    const newXpTotal = maturityLevel.xpTotal + quest.xpReward;

    const levelUpCheck = shouldLevelUp(maturityLevel.maturityLevel, newXpCurrent);

    if (levelUpCheck.shouldLevelUp && levelUpCheck.newLevel) {
      // Level up!
      await tx.strengthMaturityLevel.update({
        where: { id: maturityLevel.id },
        data: {
          maturityLevel: levelUpCheck.newLevel,
          xpCurrent: 0, // Reset current XP
          xpTotal: newXpTotal,
          levelReachedAt: new Date(),
        },
      });

      return {
        success: true,
        xpAwarded: quest.xpReward,
        leveledUp: true,
        newLevel: levelUpCheck.newLevel,
        newXpCurrent: 0,
      };
    } else {
      // No level up
      await tx.strengthMaturityLevel.update({
        where: { id: maturityLevel.id },
        data: {
          xpCurrent: newXpCurrent,
          xpTotal: newXpTotal,
        },
      });

      return {
        success: true,
        xpAwarded: quest.xpReward,
        leveledUp: false,
        newXpCurrent,
      };
    }
  });
}
```

---

## 4. Create UI Components (30 min)

### Step 4.1: XP Progress Bar

Create `app/dashboard/strength-levels/_components/xp-progress-bar.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface XpProgressBarProps {
  xpCurrent: number;
  xpForNextLevel: number;
  progressPercent: number;
  isMaxLevel?: boolean;
}

export function XpProgressBar({
  xpCurrent,
  xpForNextLevel,
  progressPercent,
  isMaxLevel = false,
}: XpProgressBarProps) {
  const clipPath8 = 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)';

  if (isMaxLevel) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono text-primary uppercase tracking-wider">
            [MAESTRO]
          </span>
          <span className="font-mono text-muted-foreground">
            {xpCurrent} XP TOTAL
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-muted-foreground uppercase tracking-wider">
          XP PROGRESO
        </span>
        <span className="font-mono text-primary">
          {xpCurrent}/{xpForNextLevel}
        </span>
      </div>

      {/* Progress bar container */}
      <div 
        className="relative h-3 bg-primary/10" 
        style={{ clipPath: clipPath8 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ clipPath: clipPath8 }}
        />

        {/* Pulse effect when near level up */}
        {progressPercent > 80 && (
          <div 
            className="absolute inset-0 bg-primary/20 animate-pulse"
            style={{ clipPath: clipPath8 }}
          />
        )}
      </div>
    </div>
  );
}
```

### Step 4.2: Main Dashboard Page

Create `app/dashboard/strength-levels/page.tsx`:

```typescript
import { Suspense } from 'react';
import { Container } from '@/app/_shared/components';
import { Skeleton } from '@/components/ui/skeleton';

export default function StrengthLevelsPage() {
  return (
    <Container 
      title="Niveles de Madurez" 
      description="Cultiva tus fortalezas a través de misiones y desafíos"
    >
      <Suspense fallback={<PageSkeleton />}>
        <StrengthLevelsContent />
      </Suspense>
    </Container>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

async function StrengthLevelsContent() {
  const session = await getSession();
  if (!session?.user?.id) redirect('/login');

  const maturityLevels = await getMaturityLevels({ userId: session.user.id });
  const dailyQuests = await getDailyQuests({ userId: session.user.id });

  return (
    <div className="space-y-8">
      {/* Maturity Levels Grid */}
      <section>
        <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-4">
          [TUS FORTALEZAS]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {maturityLevels.map((ml) => (
            <MaturityLevelCard key={ml.id} maturityLevel={ml} />
          ))}
        </div>
      </section>

      {/* Daily Quests */}
      <section>
        <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-4">
          [MISIONES DIARIAS]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

## 5. Testing (20 min)

### Unit Test Example

Create `tests/unit/strength-levels/xp-calculator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { shouldLevelUp, calculateProgress } from '@/lib/services/strength-levels/xp-calculator';
import { MaturityLevel } from '@/lib/types/strength-levels.types';

describe('XP Calculator', () => {
  it('should trigger level up when reaching threshold', () => {
    const result = shouldLevelUp(MaturityLevel.SPONGE, 500);
    expect(result.shouldLevelUp).toBe(true);
    expect(result.newLevel).toBe(MaturityLevel.CONNECTOR);
  });

  it('should calculate progress percentage correctly', () => {
    const result = calculateProgress(MaturityLevel.SPONGE, 250);
    expect(result.progressPercent).toBe(50);
    expect(result.xpForNextLevel).toBe(500);
    expect(result.isMaxLevel).toBe(false);
  });

  it('should recognize max level', () => {
    const result = calculateProgress(MaturityLevel.ALCHEMIST, 10000);
    expect(result.isMaxLevel).toBe(true);
    expect(result.progressPercent).toBe(100);
  });
});
```

Run tests:

```bash
bun test
```

---

## 6. Deploy & Verify (5 min)

```bash
# Push migration to production (Turso)
bun prisma migrate deploy

# Run production seed
bun prisma db seed --preview-feature

# Build and deploy
bun run build
vercel --prod
```

---

## Troubleshooting

### Issue: Migration fails with "column already exists"
**Solution**: Check if you have pending migrations. Run `bun prisma migrate status` and resolve conflicts.

### Issue: Seed data not loading
**Solution**: Verify JSON files exist in `prisma/data/strength-levels/`. Check Strength names match exactly (case-sensitive).

### Issue: Level up not triggering
**Solution**: Verify `xpCurrent` is correctly updated in transaction. Check XP thresholds in constants.

### Issue: Quest templates not generating
**Solution**: Ensure `isTemplate=true` in templates. Check `strengthId` foreign key is valid.

---

## Next Steps

- Implement Boss Battles (Priority P3)
- Implement Combo Breakers (Priority P3)
- Implement Cooperative Quests (Priority P4)
- Add E2E tests with Playwright
- Add cron job for daily quest generation (`app/api/cron/generate-daily-quests/route.ts`)
- Add level-up notification toast with animation

## Success Checklist

- [ ] Database migration applied successfully
- [ ] Seed data loaded (4 maturity levels, ~750 quest templates)
- [ ] User can view their strength maturity levels with XP progress bars
- [ ] User can complete a daily quest and see XP increase
- [ ] User levels up when reaching XP threshold
- [ ] Unit tests pass for XP calculator
- [ ] UI follows CyberPunk design system (clip-paths, uppercase labels, progress bars)
