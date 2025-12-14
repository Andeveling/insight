# Quickstart Guide: Sub-Team Builder & Match Analyzer

**Feature**: 003-subteam-builder  
**Date**: 13 de diciembre de 2025  
**For**: Developers implementing this feature

---

## Prerequisites

- Node.js/Bun installed and configured
- Next.js 16 project initialized
- Prisma configured with Turso/libSQL
- BetterAuth authentication working
- Existing Team and User models in database

---

## Implementation Checklist

### Phase 1: Database Setup

- [ ] **1.1** Add new models to `prisma/schema.prisma`
- [ ] **1.2** Create and run migration
- [ ] **1.3** Create seed data for ProjectTypeProfile
- [ ] **1.4** Run seed script
- [ ] **1.5** Verify in Prisma Studio

### Phase 2: Core Types & Contracts

- [ ] **2.1** Copy contract files to `lib/types/`
- [ ] **2.2** Install new dependencies
- [ ] **2.3** Create utility types barrel export
- [ ] **2.4** Verify TypeScript compilation

### Phase 3: Business Logic

- [ ] **3.1** Implement match score calculator
- [ ] **3.2** Implement gap analyzer
- [ ] **3.3** Create SubTeam service layer
- [ ] **3.4** Write unit tests for business logic

### Phase 4: Server Actions

- [ ] **4.1** Implement create-subteam action
- [ ] **4.2** Implement update-subteam action
- [ ] **4.3** Implement delete-subteam action
- [ ] **4.4** Implement calculate-match-score action
- [ ] **4.5** Add authorization checks

### Phase 5: UI Components

- [ ] **5.1** Create sub-team list page
- [ ] **5.2** Create sub-team form wizard
- [ ] **5.3** Implement member selector with drag-and-drop
- [ ] **5.4** Create match score display component
- [ ] **5.5** Create gap analysis component

### Phase 6: Advanced Features

- [ ] **6.1** Implement What-If simulation
- [ ] **6.2** Create report generation
- [ ] **6.3** Add filters and sorting
- [ ] **6.4** Implement archiving

### Phase 7: Testing & Polish

- [ ] **7.1** Write E2E tests with Playwright
- [ ] **7.2** Test with real user data
- [ ] **7.3** Accessibility audit
- [ ] **7.4** Performance optimization
- [ ] **7.5** Documentation updates

---

## Step-by-Step Implementation

### Phase 1: Database Setup

#### 1.1 Add Models to Prisma Schema

**File**: `prisma/schema.prisma`

```prisma
// Add to existing schema.prisma

model SubTeam {
  id                    String   @id @default(uuid())
  parentTeamId          String
  projectTypeProfileId  String
  name                  String
  description           String?
  members               String   // JSON: array of userIds
  matchScore            Float?   // 0-100, calculated
  analysis              String?  // JSON: detailed match breakdown
  status                String   @default("active") // "active" | "archived"
  createdBy             String
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  deletedAt             DateTime? // Soft delete

  parentTeam          Team                @relation("TeamSubTeams", fields: [parentTeamId], references: [id], onDelete: Cascade)
  projectTypeProfile  ProjectTypeProfile  @relation("ProjectType", fields: [projectTypeProfileId], references: [id])
  creator             User                @relation("SubTeamCreator", fields: [createdBy], references: [id])

  @@index([parentTeamId, deletedAt])
  @@index([createdBy])
  @@index([projectTypeProfileId])
  @@index([status])
}

model ProjectTypeProfile {
  id                 String   @id @default(uuid())
  type               String   @unique
  name               String
  nameEs             String
  idealStrengths     String   // JSON: array of strength names
  criticalDomains    String   // JSON: domain weights
  cultureFit         String   // JSON: culture preferences
  description        String
  descriptionEs      String
  icon               String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  subTeams SubTeam[] @relation("ProjectType")

  @@index([type])
}

// Update User model - add relation
model User {
  // ... existing fields
  
  createdSubTeams SubTeam[] @relation("SubTeamCreator")
}

// Update Team model - add relation
model Team {
  // ... existing fields
  
  subTeams SubTeam[] @relation("TeamSubTeams")
}
```

#### 1.2 Create Migration

```bash
cd /home/andres/Proyectos/insight
bun prisma migrate dev --name add_subteam_models
```

#### 1.3 Create Seed Data

**File**: `prisma/data/project-types.data.ts`

```typescript
import { PROJECT_TYPE_SEED_DATA } from '@/specs/003-subteam-builder/contracts/project-type.types';

export const projectTypesData = PROJECT_TYPE_SEED_DATA.map((profile, index) => ({
  ...profile,
  // Convert arrays/objects to JSON strings for SQLite
  idealStrengths: JSON.stringify(profile.idealStrengths),
  criticalDomains: JSON.stringify(profile.criticalDomains),
  cultureFit: JSON.stringify(profile.cultureFit)
}));
```

**File**: `prisma/seeders/seed-project-types.ts`

```typescript
import { prisma } from '@/lib/prisma.db';
import { projectTypesData } from '../data/project-types.data';

export async function seedProjectTypes() {
  console.log('🌱 Seeding project types...');
  
  for (const projectType of projectTypesData) {
    await prisma.projectTypeProfile.upsert({
      where: { type: projectType.type },
      update: projectType,
      create: projectType
    });
  }
  
  console.log('✅ Project types seeded');
}
```

#### 1.4 Run Seed

**Update**: `prisma/seed.ts`

```typescript
import { seedProjectTypes } from './seeders/seed-project-types';

async function main() {
  // ... existing seeders
  
  await seedProjectTypes();
  
  // ... rest of seeders
}
```

```bash
bun prisma db seed
```

#### 1.5 Verify

```bash
bun prisma studio
```

Check:
- ProjectTypeProfile table has 4 rows
- SubTeam table exists and is empty
- Foreign keys are properly linked

---

### Phase 2: Core Types & Contracts

#### 2.1 Copy Contracts

```bash
# Copy contract files from specs to lib
cp specs/003-subteam-builder/contracts/subteam.types.ts lib/types/
cp specs/003-subteam-builder/contracts/match-score.types.ts lib/types/
cp specs/003-subteam-builder/contracts/project-type.types.ts lib/types/
```

#### 2.2 Install Dependencies

```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
bun add @react-pdf/renderer
bun add -D @types/react-pdf
```

#### 2.3 Create Barrel Export

**File**: `lib/types/index.ts`

```typescript
// Add to existing barrel export
export * from './subteam.types';
export * from './match-score.types';
export * from './project-type.types';
```

#### 2.4 Verify

```bash
bun run type-check
```

---

### Phase 3: Business Logic

#### 3.1 Match Score Calculator

**File**: `lib/utils/subteam/match-score-calculator.ts`

```typescript
import type { 
  MatchScoreInput, 
  MatchScoreResult,
  MatchScoreWeights 
} from '@/lib/types/match-score.types';
import { DEFAULT_MATCH_SCORE_WEIGHTS } from '@/lib/types/match-score.types';

export async function calculateMatchScore(
  input: MatchScoreInput,
  weights: MatchScoreWeights = DEFAULT_MATCH_SCORE_WEIGHTS
): Promise<MatchScoreResult> {
  // 1. Fetch member data
  const members = await fetchMemberStrengths(input.members);
  const projectType = await fetchProjectTypeProfile(input.projectTypeProfileId);
  
  // 2. Calculate each factor
  const strengthCoverage = calculateStrengthCoverage(members);
  const domainBalance = calculateDomainBalance(members, projectType);
  const cultureFit = calculateCultureFit(members, projectType);
  const teamSize = calculateTeamSize(members.length);
  const redundancyPenalty = calculateRedundancyPenalty(members);
  
  // 3. Calculate total score
  const totalScore = (
    strengthCoverage.score * weights.strengthCoverage +
    domainBalance.score * weights.domainBalance +
    cultureFit.score * weights.cultureFit +
    teamSize.score * weights.teamSize
  ) - (redundancyPenalty.score * weights.redundancyPenalty);
  
  // 4. Identify gaps
  const gaps = identifyStrengthGaps(members, projectType);
  
  // 5. Generate recommendations
  const recommendations = generateRecommendations(
    totalScore,
    gaps,
    projectType
  );
  
  return {
    totalScore: Math.round(totalScore),
    factors: {
      strengthCoverage,
      domainBalance,
      cultureFit,
      teamSize,
      redundancyPenalty
    },
    gaps,
    recommendations,
    metadata: {
      calculatedAt: new Date(),
      version: '1.0.0',
      weights,
      projectType: projectType.type,
      memberCount: members.length
    }
  };
}

// Helper functions...
```

**File**: `lib/utils/subteam/gap-analyzer.ts`

```typescript
import type { StrengthGap } from '@/lib/types/match-score.types';

export function identifyStrengthGaps(
  members: MemberWithStrengths[],
  projectType: ProjectTypeProfile
): StrengthGap[] {
  const gaps: StrengthGap[] = [];
  const teamStrengths = new Set(
    members.flatMap(m => m.strengths.map(s => s.name))
  );
  
  // Check ideal strengths
  for (const idealStrength of projectType.idealStrengths) {
    if (!teamStrengths.has(idealStrength)) {
      gaps.push({
        strengthName: idealStrength,
        strengthNameEs: getStrengthNameEs(idealStrength),
        domainName: getStrengthDomain(idealStrength),
        domainNameEs: getDomainNameEs(idealStrength),
        priority: 'recommended',
        reason: `Ideal for ${projectType.name} projects`,
        impact: 'May lack specific capabilities for project type'
      });
    }
  }
  
  return gaps;
}
```

#### 3.2 SubTeam Service

**File**: `lib/services/subteam.service.ts`

```typescript
import { prisma } from '@/lib/prisma.db';
import type { SubTeam, SubTeamDetail, SubTeamListItem } from '@/lib/types';

export class SubTeamService {
  /**
   * Get all sub-teams for a parent team
   */
  static async getSubTeamsList(
    teamId: string,
    options?: {
      includeArchived?: boolean;
      status?: 'active' | 'archived';
    }
  ): Promise<SubTeamListItem[]> {
    const subTeams = await prisma.subTeam.findMany({
      where: {
        parentTeamId: teamId,
        deletedAt: null,
        ...(options?.status && { status: options.status })
      },
      select: {
        id: true,
        name: true,
        projectTypeProfile: {
          select: {
            id: true,
            name: true,
            nameEs: true,
            icon: true
          }
        },
        matchScore: true,
        members: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return subTeams.map(st => ({
      ...st,
      projectType: st.projectTypeProfile,
      memberCount: JSON.parse(st.members).length
    }));
  }
  
  /**
   * Get detailed sub-team information
   */
  static async getSubTeamDetail(subTeamId: string): Promise<SubTeamDetail | null> {
    const subTeam = await prisma.subTeam.findUnique({
      where: { id: subTeamId, deletedAt: null },
      include: {
        parentTeam: {
          select: { id: true, name: true }
        },
        projectTypeProfile: true,
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    if (!subTeam) return null;
    
    // Fetch member details
    const memberIds = JSON.parse(subTeam.members);
    const membersDetails = await this.fetchMemberDetails(memberIds);
    
    return {
      ...subTeam,
      members: memberIds,
      analysis: subTeam.analysis ? JSON.parse(subTeam.analysis) : null,
      membersDetails
    };
  }
  
  // More methods...
}
```

---

### Phase 4: Server Actions

#### 4.1 Create SubTeam Action

**File**: `app/dashboard/team/[teamId]/sub-teams/_actions/create-subteam.ts`

```typescript
"use server"

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma.db';
import { createSubTeamSchema, type ActionResponse, type SubTeam } from '@/lib/types';
import { calculateMatchScore } from '@/lib/utils/subteam/match-score-calculator';

export async function createSubTeam(
  formData: z.infer<typeof createSubTeamSchema>
): Promise<ActionResponse<SubTeam>> {
  try {
    // 1. Validate input
    const validated = createSubTeamSchema.parse(formData);
    
    // 2. Check authentication
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'No autenticado' };
    }
    
    // 3. Verify user is member of parent team
    const isMember = await prisma.teamMember.findFirst({
      where: {
        teamId: validated.parentTeamId,
        userId: session.user.id
      }
    });
    
    if (!isMember) {
      return { success: false, error: 'No tienes permisos para este equipo' };
    }
    
    // 4. Calculate match score
    const matchScoreResult = await calculateMatchScore({
      members: validated.members,
      projectTypeProfileId: validated.projectTypeProfileId
    });
    
    // 5. Create sub-team
    const subTeam = await prisma.subTeam.create({
      data: {
        name: validated.name,
        description: validated.description,
        parentTeamId: validated.parentTeamId,
        projectTypeProfileId: validated.projectTypeProfileId,
        members: JSON.stringify(validated.members),
        matchScore: matchScoreResult.totalScore,
        analysis: JSON.stringify(matchScoreResult),
        createdBy: session.user.id
      }
    });
    
    // 6. Revalidate cache
    revalidatePath(`/dashboard/team/${validated.parentTeamId}/sub-teams`);
    
    return { 
      success: true, 
      data: {
        ...subTeam,
        members: validated.members,
        analysis: matchScoreResult
      }
    };
    
  } catch (error) {
    console.error('Error creating sub-team:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}
```

---

### Phase 5: UI Components

#### 5.1 Sub-Team List Page

**File**: `app/dashboard/team/[teamId]/sub-teams/page.tsx`

```typescript
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { SubTeamService } from '@/lib/services/subteam.service';
import { SubTeamsList } from './_components/subteams-list';
import { SubTeamsListSkeleton } from './_components/subteams-list-skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    teamId: string;
  }>;
}

/**
 * Static shell - prerendered with PPR
 */
export default async function SubTeamsPage({ params }: PageProps) {
  const { teamId } = await params;
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sub-Equipos</h1>
          <p className="text-muted-foreground">
            Crea y gestiona sub-equipos para proyectos específicos
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/team/${teamId}/sub-teams/new`}>
            Crear Sub-Equipo
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<SubTeamsListSkeleton />}>
        <SubTeamsListContent teamId={teamId} />
      </Suspense>
    </div>
  );
}

/**
 * Dynamic content - rendered at request time
 */
async function SubTeamsListContent({ teamId }: { teamId: string }) {
  const session = await getSession();
  
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  const subTeams = await SubTeamService.getSubTeamsList(teamId);
  
  if (!subTeams) {
    notFound();
  }
  
  return <SubTeamsList subTeams={subTeams} teamId={teamId} />;
}
```

#### 5.2 Member Selector with Drag-and-Drop

**File**: `app/dashboard/team/[teamId]/sub-teams/_components/member-selector.tsx`

```typescript
"use client"

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MemberCard } from './member-card';
import { SortableMemberCard } from './sortable-member-card';

interface MemberSelectorProps {
  availableMembers: TeamMember[];
  selectedMembers: string[];
  onSelectionChange: (members: string[]) => void;
  maxMembers?: number;
}

export function MemberSelector({
  availableMembers,
  selectedMembers,
  onSelectionChange,
  maxMembers = 10
}: MemberSelectorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      const oldIndex = selectedMembers.indexOf(active.id as string);
      const newIndex = selectedMembers.indexOf(over.id as string);
      
      const newOrder = arrayMove(selectedMembers, oldIndex, newIndex);
      onSelectionChange(newOrder);
    }
    
    setActiveId(null);
  };
  
  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      onSelectionChange(selectedMembers.filter(id => id !== memberId));
    } else if (selectedMembers.length < maxMembers) {
      onSelectionChange([...selectedMembers, memberId]);
    }
  };
  
  const selected = availableMembers.filter(m => selectedMembers.includes(m.id));
  const available = availableMembers.filter(m => !selectedMembers.includes(m.id));
  
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Available members */}
        <div>
          <h3 className="font-semibold mb-4">Miembros Disponibles</h3>
          <div className="space-y-2">
            {available.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                onSelect={() => toggleMember(member.id)}
                selectable
              />
            ))}
          </div>
        </div>
        
        {/* Selected members (sortable) */}
        <div>
          <h3 className="font-semibold mb-4">
            Sub-Equipo ({selectedMembers.length}/{maxMembers})
          </h3>
          <SortableContext
            items={selectedMembers}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {selected.map(member => (
                <SortableMemberCard
                  key={member.id}
                  member={member}
                  onRemove={() => toggleMember(member.id)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
      
      <DragOverlay>
        {activeId ? (
          <MemberCard
            member={selected.find(m => m.id === activeId)!}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## Testing

### Unit Tests

**File**: `tests/unit/match-score-calculator.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '@/lib/utils/subteam/match-score-calculator';

describe('Match Score Calculator', () => {
  it('should calculate score for ideal team', async () => {
    const result = await calculateMatchScore({
      members: ['user1', 'user2', 'user3', 'user4', 'user5'],
      projectTypeProfileId: 'innovation-profile-id'
    });
    
    expect(result.totalScore).toBeGreaterThan(80);
    expect(result.gaps).toHaveLength(0);
  });
  
  it('should penalize team with duplicate strengths', async () => {
    // Test implementation
  });
});
```

### E2E Tests

**File**: `tests/e2e/subteam-builder.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Sub-Team Builder', () => {
  test('should create sub-team successfully', async ({ page }) => {
    await page.goto('/dashboard/team/test-team-id/sub-teams');
    await page.click('text=Crear Sub-Equipo');
    
    await page.fill('[name="name"]', 'Equipo de Prueba');
    await page.selectOption('[name="projectType"]', 'innovation');
    
    // Select members
    await page.click('[data-member-id="user1"]');
    await page.click('[data-member-id="user2"]');
    
    await page.click('text=Guardar');
    
    await expect(page).toHaveURL(/\/dashboard\/team\/.*\/sub-teams$/);
    await expect(page.locator('text=Equipo de Prueba')).toBeVisible();
  });
});
```

---

## Deployment Checklist

- [ ] Run migrations on production database
- [ ] Seed project types in production
- [ ] Verify environment variables
- [ ] Test with real user data
- [ ] Monitor for errors
- [ ] Update documentation

---

## Troubleshooting

### Issue: Migration fails

**Solution**: Check that User and Team models exist first. Run `bun prisma migrate reset` in development if needed.

### Issue: Match score always returns null

**Solution**: Verify that members have strengths assigned. Check Prisma query includes strength relations.

### Issue: Drag-and-drop not working

**Solution**: Ensure component is marked with `"use client"`. Check that @dnd-kit dependencies are installed.

---

## Next Steps

After completing this quickstart:

1. Move to `/speckit.tasks` to break down into implementation tasks
2. Create feature branch for development
3. Implement MVP (P1 user stories first)
4. Test with real users
5. Iterate based on feedback

---

**Questions?** Refer to:
- [spec.md](./spec.md) - Feature requirements
- [research.md](./research.md) - Technical decisions
- [data-model.md](./data-model.md) - Database schema
- [contracts/](./contracts/) - Type definitions
