# Quickstart: Contextual Reports System

**Feature**: 009-contextual-reports  
**Date**: 17 de diciembre de 2025  
**Estimated Time**: ~13 hours

---

## Prerequisites

- [x] Branch `009-contextual-reports` checked out
- [x] Spec reviewed and approved
- [x] Research complete (see `research.md`)
- [x] Data model defined (see `data-model.md`)
- [x] Contracts defined (see `contracts/readiness.schema.ts`)

---

## Implementation Order

### Step 1: Constants & Types (30 min)

**Create threshold constants:**

```bash
# Create file
touch lib/constants/report-thresholds.ts
```

```typescript
// lib/constants/report-thresholds.ts
export const INDIVIDUAL_REPORT_THRESHOLDS = {
  MODULES_COMPLETED: 3,
  XP_TOTAL: 100,
  CHALLENGES_COMPLETED: 5,
  HAS_STRENGTHS: true,
} as const;

export const TEAM_REPORT_THRESHOLDS = {
  MEMBER_READINESS_PERCENT: 60,
  MIN_ACTIVE_MEMBERS: 3,
} as const;

export const REPORT_XP_REWARDS = {
  FIRST_INDIVIDUAL_REPORT: 50,
  FIRST_TEAM_REPORT_GENERATOR: 75,
  FIRST_TEAM_REPORT_CONTRIBUTOR: 25,
} as const;

export const READINESS_WEIGHTS = {
  modules: 30,
  xp: 25,
  challenges: 25,
  strengths: 20,
} as const;
```

**Copy schemas from contracts:**

```bash
# Copy the contract schema
cp specs/009-contextual-reports/contracts/readiness.schema.ts \
   app/dashboard/reports/_schemas/readiness.schema.ts
```

**Update barrel export:**

```typescript
// app/dashboard/reports/_schemas/index.ts
export * from "./individual-report.schema";
export * from "./team-report.schema";
export * from "./team-tips.schema";
export * from "./readiness.schema"; // ADD THIS
```

---

### Step 2: Readiness Calculator (1 hour)

**Create pure calculation functions:**

```bash
touch app/dashboard/reports/_lib/readiness-calculator.ts
```

Key functions to implement:

```typescript
// _lib/readiness-calculator.ts

import {
  INDIVIDUAL_REPORT_THRESHOLDS,
  READINESS_WEIGHTS,
} from "@/lib/constants/report-thresholds";
import type { Requirement, IndividualReadiness } from "../_schemas/readiness.schema";

interface ProgressData {
  modulesCompleted: number;
  xpTotal: number;
  challengesCompleted: number;
  hasStrengths: boolean;
}

/**
 * Calculate individual readiness score (0-100)
 */
export function calculateIndividualScore(progress: ProgressData): number {
  const T = INDIVIDUAL_REPORT_THRESHOLDS;
  const W = READINESS_WEIGHTS;
  
  const moduleScore = Math.min(progress.modulesCompleted / T.MODULES_COMPLETED, 1) * W.modules;
  const xpScore = Math.min(progress.xpTotal / T.XP_TOTAL, 1) * W.xp;
  const challengeScore = Math.min(progress.challengesCompleted / T.CHALLENGES_COMPLETED, 1) * W.challenges;
  const strengthScore = progress.hasStrengths ? W.strengths : 0;
  
  return Math.round(moduleScore + xpScore + challengeScore + strengthScore);
}

/**
 * Build requirements list with status
 */
export function buildRequirements(progress: ProgressData): Requirement[] {
  const T = INDIVIDUAL_REPORT_THRESHOLDS;
  
  return [
    {
      id: "strengths",
      label: "Fortalezas identificadas",
      current: progress.hasStrengths ? 1 : 0,
      target: 1,
      met: progress.hasStrengths,
      priority: "required",
      icon: "strengths",
      actionUrl: "/dashboard/assessment",
    },
    {
      id: "modules",
      label: "Módulos completados",
      current: progress.modulesCompleted,
      target: T.MODULES_COMPLETED,
      met: progress.modulesCompleted >= T.MODULES_COMPLETED,
      priority: "required",
      icon: "modules",
      actionUrl: "/dashboard/development",
    },
    {
      id: "challenges",
      label: "Challenges completados",
      current: progress.challengesCompleted,
      target: T.CHALLENGES_COMPLETED,
      met: progress.challengesCompleted >= T.CHALLENGES_COMPLETED,
      priority: "required",
      icon: "challenges",
      actionUrl: "/dashboard/development",
    },
    {
      id: "xp",
      label: "XP acumulada",
      current: progress.xpTotal,
      target: T.XP_TOTAL,
      met: progress.xpTotal >= T.XP_TOTAL,
      priority: "required",
      icon: "xp",
      actionUrl: "/dashboard/development",
    },
  ];
}

/**
 * Check if all required thresholds are met
 */
export function isIndividualReady(requirements: Requirement[]): boolean {
  return requirements
    .filter(r => r.priority === "required")
    .every(r => r.met);
}
```

---

### Step 3: Server Actions (2 hours)

**Create individual readiness action:**

```bash
touch app/dashboard/reports/_actions/get-individual-readiness.ts
```

```typescript
// _actions/get-individual-readiness.ts
"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { getUserProgress } from "@/app/dashboard/development/_actions";
import {
  calculateIndividualScore,
  buildRequirements,
  isIndividualReady,
} from "../_lib/readiness-calculator";
import type { IndividualReadiness } from "../_schemas/readiness.schema";

export async function getIndividualReadiness(): Promise<{
  success: boolean;
  readiness?: IndividualReadiness;
  error?: string;
}> {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }
  
  try {
    // Get progress from development feature
    const progress = await getUserProgress();
    
    // Check if user has strengths
    const strengthsCount = await prisma.userStrength.count({
      where: { userId: session.user.id },
    });
    
    const progressData = {
      modulesCompleted: progress.modulesCompleted,
      xpTotal: progress.xpTotal,
      challengesCompleted: progress.challengesCompleted,
      hasStrengths: strengthsCount > 0,
    };
    
    const requirements = buildRequirements(progressData);
    const score = calculateIndividualScore(progressData);
    const ready = isIndividualReady(requirements);
    
    return {
      success: true,
      readiness: {
        type: "individual",
        score,
        isReady: ready,
        requirements,
        calculatedAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Error calculating readiness:", error);
    return { success: false, error: "Error calculando readiness" };
  }
}
```

**Create team readiness action:**

```bash
touch app/dashboard/reports/_actions/get-team-readiness.ts
```

(Similar pattern but iterates over team members)

**Update barrel export:**

```typescript
// _actions/index.ts
export { getIndividualReadiness } from "./get-individual-readiness";
export { getTeamReadiness } from "./get-team-readiness";
// ... existing exports
```

---

### Step 4: UI Components (3 hours)

**Create readiness dashboard component:**

```bash
touch app/dashboard/reports/_components/readiness-dashboard.tsx
touch app/dashboard/reports/_components/readiness-requirement.tsx
touch app/dashboard/reports/_components/report-readiness-card.tsx
```

Key component structure:

```tsx
// _components/readiness-dashboard.tsx
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { ReadinessRequirement } from "./readiness-requirement";
import type { Requirement } from "../_schemas/readiness.schema";

interface ReadinessDashboardProps {
  score: number;
  isReady: boolean;
  requirements: Requirement[];
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export function ReadinessDashboard({
  score,
  isReady,
  requirements,
  onGenerate,
  isGenerating,
}: ReadinessDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Circular Progress */}
      <div className="flex justify-center">
        <CircularProgress score={score} isReady={isReady} />
      </div>
      
      {/* Requirements List */}
      <div className="space-y-3">
        {requirements.map((req) => (
          <ReadinessRequirement key={req.id} requirement={req} />
        ))}
      </div>
      
      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!isReady || isGenerating}
        className={cn(
          "w-full",
          isReady && "bg-primary animate-pulse"
        )}
      >
        {isReady ? "Generar Reporte" : "Completa los requisitos"}
      </Button>
    </div>
  );
}
```

---

### Step 5: Page Integration (2 hours)

**Modify individual report page:**

```tsx
// reports/individual/page.tsx
import { Suspense } from "react";
import { getIndividualReadiness } from "../_actions";
import { ReadinessDashboard } from "../_components/readiness-dashboard";

export default function IndividualReportPage() {
  return (
    <DashboardContainer title="Mi Reporte Individual">
      <Suspense fallback={<ReadinessSkeleton />}>
        <IndividualReportContent />
      </Suspense>
    </DashboardContainer>
  );
}

async function IndividualReportContent() {
  const { success, readiness } = await getIndividualReadiness();
  
  if (!success || !readiness) {
    return <ErrorState />;
  }
  
  if (!readiness.isReady) {
    return (
      <ReadinessDashboard
        score={readiness.score}
        isReady={false}
        requirements={readiness.requirements}
      />
    );
  }
  
  // User is ready - show existing report flow
  return <IndividualReportView />;
}
```

---

### Step 6: AI Prompt Enrichment (2 hours)

**Extend prompt builder:**

```typescript
// _lib/ai-prompts.ts

// Add new context section
export function buildDevelopmentContextSection(
  context: DevelopmentContext
): string {
  return `
## Contexto de Desarrollo del Usuario

El usuario ha demostrado compromiso activo con su desarrollo:

- **Nivel actual**: ${context.level} (${context.levelName})
- **XP acumulada**: ${context.xpTotal} puntos
- **Racha actual**: ${context.currentStreak} días
- **Racha más larga**: ${context.longestStreak} días

### Módulos Completados (${context.modulesCompleted.length})

${context.modulesCompleted.map(m => 
  `- **${m.name}** (Fortaleza: ${m.strengthName}) - ${m.challengesCompleted} challenges`
).join('\n')}

### Logros Desbloqueados

${context.badgesUnlocked.map(b => `- ${b}`).join('\n')}

Usa este contexto para personalizar las recomendaciones basándote en el progreso real del usuario.
`;
}
```

**Modify report generation:**

```typescript
// _actions/generate-individual-report.action.ts

// In the generation flow, after building base context:
if (readiness.isReady) {
  const developmentContext = await buildDevelopmentContext(userId);
  promptContext.developmentProgress = developmentContext;
}

// Update metadata with v2 marker
const metadata: ReportMetadataV2 = {
  strengthsHash: currentStrengthsHash,
  generatedAt: new Date().toISOString(),
  schemaVersion: 2,
  hasContext: true,
  contextSnapshot: {
    level: developmentContext.level,
    xpTotal: developmentContext.xpTotal,
    modulesCount: developmentContext.modulesCompleted.length,
    challengesCount: developmentContext.challengesCompletedCount,
    badgesCount: developmentContext.badgesUnlocked.length,
  },
};
```

---

### Step 7: Gamification (1 hour)

**Add badge seed data:**

```typescript
// prisma/data/badges.data.ts

// Add to existing badges array:
{
  id: "INSIGHT_INDIVIDUAL",
  name: "Insight Desbloqueado",
  description: "Generaste tu primer reporte individual con contexto de desarrollo",
  imageUrl: "/badges/insight-individual.svg",
  tier: "SILVER",
  category: "ACHIEVEMENT",
  xpReward: 50,
  isActive: true,
},
{
  id: "INSIGHT_TEAM",
  name: "Insight de Equipo",
  description: "Contribuiste al primer reporte de equipo contextualizado",
  imageUrl: "/badges/insight-team.svg",
  tier: "BRONZE",
  category: "COLLABORATION",
  xpReward: 25,
  isActive: true,
},
```

**Run seed:**

```bash
bunx prisma db seed
```

**Add XP reward on generation:**

```typescript
// After successful report generation:
import { awardXP } from "@/lib/services/xp-calculator.service";
import { checkBadgeUnlock } from "@/app/dashboard/development/_actions";

// Award XP for first contextual report
const existingV2Reports = await prisma.report.count({
  where: {
    userId,
    type: "INDIVIDUAL_FULL",
    metadata: { contains: '"schemaVersion":2' },
  },
});

if (existingV2Reports === 1) {
  await awardXP(userId, REPORT_XP_REWARDS.FIRST_INDIVIDUAL_REPORT, "first_contextual_report");
  await checkBadgeUnlock(userId);
}
```

---

### Step 8: Testing (2 hours)

**Unit tests for calculator:**

```typescript
// __tests__/readiness-calculator.test.ts
import { calculateIndividualScore, buildRequirements, isIndividualReady } from "../readiness-calculator";

describe("calculateIndividualScore", () => {
  it("returns 0 for user with no progress", () => {
    const score = calculateIndividualScore({
      modulesCompleted: 0,
      xpTotal: 0,
      challengesCompleted: 0,
      hasStrengths: false,
    });
    expect(score).toBe(0);
  });
  
  it("returns 100 for user meeting all thresholds", () => {
    const score = calculateIndividualScore({
      modulesCompleted: 3,
      xpTotal: 100,
      challengesCompleted: 5,
      hasStrengths: true,
    });
    expect(score).toBe(100);
  });
  
  it("returns 20 for user with only strengths", () => {
    const score = calculateIndividualScore({
      modulesCompleted: 0,
      xpTotal: 0,
      challengesCompleted: 0,
      hasStrengths: true,
    });
    expect(score).toBe(20);
  });
});
```

---

## Verification Checklist

- [ ] Threshold constants defined and exported
- [ ] Zod schemas copied and exported
- [ ] Readiness calculator with unit tests
- [ ] `getIndividualReadiness` action working
- [ ] `getTeamReadiness` action working
- [ ] `ReadinessDashboard` component rendering
- [ ] Individual report page shows readiness gate
- [ ] Team report page shows readiness gate
- [ ] AI prompts include development context
- [ ] XP awarded on first contextual report
- [ ] Badges created and unlockable
- [ ] Reports/page.tsx shows readiness cards
- [ ] TypeScript builds without errors
- [ ] ESLint passes

---

## Commands Reference

```bash
# Type check
bun run typecheck

# Lint
bun run lint

# Test
bun run test

# Build
bun run build

# Seed new badges
bunx prisma db seed
```
