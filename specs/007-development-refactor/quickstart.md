# Quickstart Guide: Development Module Refactor

**Feature**: 007-development-refactor  
**Date**: 2025-12-15  
**Status**: Ready for Implementation

## Prerequisites

Before starting implementation, ensure:

1. ✅ Branch `007-development-refactor` is checked out
2. ✅ Dependencies are installed (`bun install`)
3. ✅ Database is accessible (`bun run db:studio`)
4. ✅ You've read `spec.md`, `research.md`, and `data-model.md`

---

## Implementation Order

### Phase 1: Database Schema (30 min)

**Goal**: Add new fields and tables to support module types and professional profiles.

#### Step 1.1: Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
// 1. Extend DevelopmentModule model
model DevelopmentModule {
  // ... existing fields ...
  
  // ADD these fields:
  moduleType       String   @default("general") // "general" | "personalized"
  userId           String?  // Only for personalized modules
  isArchived       Boolean  @default(false)
  generatedBy      String?  // AI model used
  
  user             User?    @relation("PersonalizedModules", fields: [userId], references: [id], onDelete: Cascade)
  
  // ADD these indexes:
  @@index([moduleType, strengthKey])
  @@index([userId, moduleType])
  @@index([isArchived])
}

// 2. Add new model
model UserProfessionalProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  roleStatus      String    @default("neutral")
  currentRole     String?
  industryContext String?
  careerGoals     String?
  completedAt     DateTime?
  skippedAt       DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([roleStatus])
}

// 3. Update User model - add relation
model User {
  // ... existing fields and relations ...
  
  // ADD:
  professionalProfile  UserProfessionalProfile?
  personalizedModules  DevelopmentModule[] @relation("PersonalizedModules")
}
```

#### Step 1.2: Create Migration

```bash
bun run db:migrate --name add_module_types_and_professional_profile
```

#### Step 1.3: Archive Domain Modules

Create `prisma/migrations/YYYYMMDD_archive_domain_modules.sql`:

```sql
UPDATE DevelopmentModule 
SET isArchived = 1 
WHERE strengthKey IS NULL AND domainKey IS NOT NULL;
```

---

### Phase 2: Schemas (15 min)

**Goal**: Create Zod schemas for new data types.

#### Step 2.1: Create Professional Profile Schema

Create `app/dashboard/development/_schemas/professional-profile.schema.ts`:

```typescript
import { z } from "zod";

export const RoleStatusSchema = z.enum([
  "satisfied",
  "partially_satisfied",
  "unsatisfied",
  "neutral"
]);

export const CareerGoalSchema = z.enum([
  "improve_current_role",
  "explore_new_responsibilities",
  "change_area",
  "lead_team",
  "other"
]);

export const ProfessionalProfileSchema = z.object({
  roleStatus: RoleStatusSchema,
  currentRole: z.string().max(100).optional(),
  industryContext: z.string().max(100).optional(),
  careerGoals: z.array(CareerGoalSchema).max(5).optional(),
});

export const SaveProfileInputSchema = ProfessionalProfileSchema.extend({
  skip: z.boolean().optional(),
});

export type RoleStatus = z.infer<typeof RoleStatusSchema>;
export type CareerGoal = z.infer<typeof CareerGoalSchema>;
export type ProfessionalProfile = z.infer<typeof ProfessionalProfileSchema>;
```

#### Step 2.2: Extend Module Schema

Add to `app/dashboard/development/_schemas/module.schema.ts`:

```typescript
export const ModuleTypeSchema = z.enum(["general", "personalized"]);
export type ModuleType = z.infer<typeof ModuleTypeSchema>;

// Update ModuleCardSchema to include moduleType
export const ModuleCardSchema = z.object({
  // ... existing fields ...
  moduleType: ModuleTypeSchema,
});
```

---

### Phase 3: Server Actions (45 min)

**Goal**: Implement new actions and modify existing ones.

#### Step 3.1: Create Strength Gate Action

Create `app/dashboard/development/_actions/get-user-strengths.ts`:

```typescript
"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";

export async function getUserStrengthsForDevelopment() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const strengths = await prisma.userStrength.findMany({
    where: { userId: session.user.id },
    include: {
      strength: {
        include: { domain: true }
      }
    },
    orderBy: { rank: "asc" }
  });

  return {
    hasTop5: strengths.length >= 5,
    strengths: strengths.map(s => ({
      rank: s.rank,
      key: s.strength.name,
      nameEs: s.strength.nameEs,
      domainKey: s.strength.domain.name,
      domainNameEs: s.strength.domain.nameEs,
    }))
  };
}
```

#### Step 3.2: Create Check Can Generate Action

Create `app/dashboard/development/_actions/check-can-generate.ts`:

```typescript
"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";

export async function checkCanGenerateModule() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const pendingModules = await prisma.userModuleProgress.findMany({
    where: {
      userId: session.user.id,
      status: { not: "completed" },
      module: { isArchived: false }
    },
    include: {
      module: { select: { id: true, titleEs: true } }
    }
  });

  return {
    canGenerate: pendingModules.length === 0,
    reason: pendingModules.length > 0 ? "pending_modules" : undefined,
    pendingModules: pendingModules.map(p => ({
      id: p.module.id,
      titleEs: p.module.titleEs,
      percentComplete: Math.round((p.completedChallenges / p.totalChallenges) * 100)
    })),
    message: pendingModules.length > 0 
      ? `Completa ${pendingModules.length} módulo(s) pendiente(s) para generar nuevos`
      : undefined
  };
}
```

#### Step 3.3: Modify getModules Action

Update `app/dashboard/development/_actions/get-modules.ts` to:
1. Filter by user's Top 5 strengths only
2. Exclude archived modules
3. Separate general and personalized modules

---

### Phase 4: Components (60 min)

**Goal**: Create new UI components with Gaming Fluent Design.

#### Step 4.1: Create Strength Gate Component

Create `app/dashboard/development/_components/strength-gate.tsx`:

```tsx
import { redirect } from "next/navigation";
import { getUserStrengthsForDevelopment } from "../_actions";
import { StrengthsRequiredMessage } from "./strengths-required-message";

interface StrengthGateProps {
  children: React.ReactNode;
}

export async function StrengthGate({ children }: StrengthGateProps) {
  const { hasTop5 } = await getUserStrengthsForDevelopment();

  if (!hasTop5) {
    return <StrengthsRequiredMessage />;
  }

  return <>{children}</>;
}
```

#### Step 4.2: Create Module Type Badge

Create `app/dashboard/development/_components/module-type-badge.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

interface ModuleTypeBadgeProps {
  type: "general" | "personalized";
  size?: "sm" | "md";
  animated?: boolean;
}

export function ModuleTypeBadge({ 
  type, 
  size = "sm",
  animated = true 
}: ModuleTypeBadgeProps) {
  const isPersonalized = type === "personalized";
  
  const content = (
    <Badge
      variant={isPersonalized ? "default" : "secondary"}
      className={cn(
        "gap-1",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-3 py-1"
      )}
    >
      {isPersonalized ? (
        <Sparkles className="h-3 w-3" />
      ) : (
        <Shield className="h-3 w-3" />
      )}
      {isPersonalized ? "Personalizado" : "General"}
    </Badge>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {content}
    </motion.div>
  );
}
```

#### Step 4.3: Create Professional Profile Form

Create `app/dashboard/development/_components/professional-profile-form.tsx` with:
- React Hook Form integration
- Zod validation
- motion/react animations
- Multi-step or single-page form

---

### Phase 5: Page Integration (30 min)

**Goal**: Wire everything together in the main page.

#### Step 5.1: Update Main Page

Update `app/dashboard/development/page.tsx`:

```tsx
import { Suspense } from "react";
import { StrengthGate } from "./_components/strength-gate";
import { ProfessionalProfileCheck } from "./_components/professional-profile-check";

export default function DevelopmentPage() {
  return (
    <StrengthGate>
      <ProfessionalProfileCheck>
        <div className="container mx-auto space-y-8 p-6">
          {/* Header */}
          <Suspense fallback={<ProgressSkeleton />}>
            <UserProgressSection />
          </Suspense>
          
          {/* Modules - Now split by type */}
          <Suspense fallback={<ModulesSkeleton />}>
            <ModulesSection />
          </Suspense>
        </div>
      </ProfessionalProfileCheck>
    </StrengthGate>
  );
}
```

---

## Testing Checklist

### Manual Testing

- [ ] User without Top 5 sees strength gate message
- [ ] User with Top 5 sees only modules for their strengths
- [ ] No domain-based modules appear
- [ ] General modules show "General" badge
- [ ] Personalized modules show "Personalizado" badge
- [ ] User with pending modules cannot generate new ones
- [ ] User with all completed can generate new module
- [ ] Professional profile form appears on first visit
- [ ] Profile can be skipped
- [ ] Animations work smoothly

### Edge Cases

- [ ] User updates Top 5 - old modules archived, new shown
- [ ] AI generation fails gracefully
- [ ] Empty state when no modules available
- [ ] Profile defaults work when skipped

---

## Files to Create/Modify Summary

### New Files
- `_schemas/professional-profile.schema.ts`
- `_actions/get-user-strengths.ts`
- `_actions/check-can-generate.ts`
- `_actions/generate-personalized.ts`
- `_actions/get-professional-profile.ts`
- `_actions/save-professional-profile.ts`
- `_components/strength-gate.tsx`
- `_components/strengths-required-message.tsx`
- `_components/professional-profile-form.tsx`
- `_components/professional-profile-check.tsx`
- `_components/module-type-badge.tsx`
- `_components/generate-module-button.tsx`
- `lib/services/module-generator.service.ts`

### Modified Files
- `prisma/schema.prisma`
- `_schemas/module.schema.ts`
- `_schemas/index.ts`
- `_actions/get-modules.ts`
- `_actions/index.ts`
- `_components/module-list.tsx`
- `_components/module-card.tsx`
- `_components/index.ts`
- `page.tsx`

---

## Next Steps

After implementation:

1. Run migrations: `bun run db:migrate`
2. Regenerate Prisma client: `bun run db:generate`
3. Test locally: `bun run dev`
4. Create seed data for general modules (one per strength)
5. Proceed to `/speckit.tasks` for detailed task breakdown
