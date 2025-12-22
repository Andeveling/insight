# Cache Components Examples - Real Patterns from Codebase

Este archivo documenta los patrones Cache Components implementados en el proyecto Insight.

## Example 1: Dashboard Layout (Working Implementation)

### Location
`app/dashboard/layout.tsx`

### Implementation
```typescript
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AppSidebar } from "./_components/app-sidebar";
import { getUserTeam } from "./team/_actions";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Static shell - renders immediately at build time
 * Contains ONLY static layout elements
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

/**
 * Loading skeleton shown while dynamic content loads
 * Must be fast and match layout structure
 */
function DashboardLayoutSkeleton() {
  return (
    <div className="flex h-screen w-full">
      <div className="w-64 border-r border-border bg-background/95">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex-1">
        <div className="h-14 border-b border-border bg-background/80">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="p-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Dynamic content - only runs at request time, NOT during prerendering
 * Safe to use getSession(), cookies(), and database queries here
 */
async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // Runtime data access is safe here - inside Suspense boundary
  const session = await getSession();

  // Redirect at layout level to prevent redirect loops
  if (!session) {
    redirect("/login");
  }

  // Get user's team and sidebar preference
  const userTeam = await getUserTeam();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? undefined,
        }}
        teamId={userTeam?.id}
      />
      <SidebarInset className="bg-blueprint-tech relative">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 h-8 w-8 hover:bg-muted transition-colors text-primary animate-pulse" />
            <div className="h-4 w-px bg-border mx-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/70 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-primary animate-pulse" />
              Panel de Control
            </span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Key Points
✅ Main component is synchronous (default export)
✅ All async operations in separate `DashboardLayoutContent`
✅ Suspense wraps async component with fallback
✅ Session check and database queries in dynamic component
✅ Redirects inside dynamic component to prevent issues

### Build Output
```
├ ◐ /dashboard
├ ◐ /dashboard/reports
├ ◐ /dashboard/assessment
└ ◐ /dashboard/team
```

**Warnings about `headers()` are expected and correct.**

---

## Example 2: Server Action with Revalidation

### Location
`app/dashboard/team/_actions/index.ts`

### Implementation
```typescript
'use server'

import { prisma } from '@/lib/prisma.db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Server action to create a new team
 * Called from a form in a Client Component
 */
export async function createTeam(name: string, description?: string) {
  // Server action runs on server - safe to access session
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  try {
    // Create team in database
    const team = await prisma.team.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: session.user.id,
            role: 'owner',
          },
        },
      },
    })

    // Revalidate dashboard to show new team
    revalidatePath('/dashboard/team')

    return { success: true, teamId: team.id }
  } catch (error) {
    return { success: false, error: 'Failed to create team' }
  }
}

/**
 * Server action to get user's team
 * Used in layouts and pages to fetch team context
 */
export async function getUserTeam() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return null
  }

  return prisma.teamMember.findFirst({
    where: {
      userId: session.user.id,
      role: 'owner',
    },
    include: {
      team: true,
    },
  }).then(member => member?.team ?? null)
}
```

### Key Points
✅ 'use server' at top of file
✅ Can access session safely (server action)
✅ Can access database directly via Prisma
✅ Revalidates correct paths after mutations
✅ Returns data to Client Component

### Usage in Client Component
```typescript
'use client'

import { useState } from 'react'
import { createTeam } from './create-team.action'

export function CreateTeamForm() {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createTeam(
      formData.get('name') as string,
      formData.get('description') as string
    )
    
    setIsPending(false)
    
    if (result.success) {
      // Team created, page revalidated
      console.log('Team created:', result.teamId)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <textarea name="description" />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  )
}
```

---

## Example 3: Dynamic Route with Parameters

### Location
`app/dashboard/team/[teamId]/page.tsx`

### Implementation
```typescript
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma.db'
import { TeamMembersSection } from './_components/team-members'
import { TeamDetailsSection } from './_components/team-details'
import { Skeleton } from '@/components/ui/skeleton'

interface TeamPageProps {
  params: Promise<{
    teamId: string
  }>
}

/**
 * Static shell for dynamic route
 * Receives teamId as prop from params
 */
export default async function TeamPage({ params }: TeamPageProps) {
  // Await params - they are now a Promise
  const { teamId } = await params

  return (
    <div className="space-y-8 py-4">
      <Suspense fallback={<TeamDetailsSkeleton />}>
        <TeamDetailsContent teamId={teamId} />
      </Suspense>

      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembersContent teamId={teamId} />
      </Suspense>
    </div>
  )
}

/**
 * Skeleton for team details section
 */
function TeamDetailsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

function TeamMembersSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

/**
 * Dynamic team details content
 * Runs at request time with teamId
 */
async function TeamDetailsContent({ teamId }: { teamId: string }) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        where: { userId: session.user.id },
      },
    },
  })

  if (!team) {
    redirect('/dashboard/team')
  }

  return <TeamDetailsSection team={team} />
}

/**
 * Dynamic team members content
 * Runs at request time with teamId
 */
async function TeamMembersContent({ teamId }: { teamId: string }) {
  const members = await prisma.teamMember.findMany({
    where: { teamId },
    include: { user: true },
  })

  return <TeamMembersSection members={members} />
}
```

### Key Points
✅ `params` is a Promise - must be awaited
✅ params awaited in main component (still async)
✅ Dynamic components receive teamId as prop
✅ Dynamic components wrapped in Suspense
✅ Each section has its own skeleton
✅ Multiple Suspense boundaries for granular loading

### Build Output
```
├ ◐ /dashboard/team/[teamId]
└─ /dashboard/team/[teamId]/sub-teams
```

---

## Example 4: API Route with headers()

### Location
`app/api/gamification/progress/route.ts`

### Implementation
```typescript
/**
 * GET /api/gamification/progress
 * Returns the current user's gamification progress
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  getLevelByXp,
  getLevelProgress,
  getStreakBonus,
  getXpForNextLevel,
} from '@/lib/constants/xp-levels'
import { getExtendedUserStats } from '@/lib/services/gamification.service'

/**
 * API route handler
 * getSession() internally calls headers()
 * This automatically skips prerendering for this route
 * (No `export const dynamic = "force-dynamic"` needed!)
 */
export async function GET() {
  try {
    // Accessing session (which uses headers internally)
    // automatically prevents prerendering
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Get gamification stats from database
    const stats = await getExtendedUserStats(session.user.id)

    if (!stats) {
      return NextResponse.json(
        { error: 'No se encontró progreso de gamificación' },
        { status: 404 }
      )
    }

    // Calculate levels and progress
    const streakMultiplier = getStreakBonus(stats.currentStreak)
    const levelInfo = getLevelByXp(stats.xpTotal)
    const xpInCurrentLevel = stats.xpTotal - levelInfo.minXp
    const xpForNextLevel = getXpForNextLevel(stats.xpTotal)
    const levelProgress = getLevelProgress(stats.xpTotal)

    return NextResponse.json({
      progress: {
        userId: session.user.id,
        xpTotal: stats.xpTotal,
        currentLevel: stats.currentLevel,
        currentLevelXp: xpInCurrentLevel,
        nextLevelXpRequired: xpForNextLevel,
        levelProgress,
        currentStreak: stats.currentStreak,
        streakMultiplier,
      },
    })
  } catch (error) {
    console.error('Gamification progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Key Points
✅ NO `export const dynamic = "force-dynamic"` (incompatible with Cache Components)
✅ Accessing `headers()` via `getSession()` prevents prerendering automatically
✅ API route is marked as `ƒ (Dynamic)` in build output
✅ No need for Suspense in API routes

### Build Output
```
ƒ /api/gamification/progress
ƒ /api/health
```

**These are correctly marked as Dynamic (ƒ) not Partial Prerender (◐)**

---

## Example 5: Form with Zod Validation

### Location
`app/dashboard/team/_components/create-team-form.tsx`

### Implementation
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTeam } from '../_actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Zod schema for validation
const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must be at most 50 characters'),
  description: z
    .string()
    .max(200, 'Description must be at most 200 characters')
    .optional(),
})

// Infer TypeScript type from Zod schema
type CreateTeamInput = z.infer<typeof createTeamSchema>

interface CreateTeamFormProps {
  onSuccess?: (teamId: string) => void
}

export function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
  })

  async function onSubmit(data: CreateTeamInput) {
    try {
      const result = await createTeam(data.name, data.description)

      if (result.success) {
        reset()
        onSuccess?.(result.teamId)
      }
    } catch (error) {
      console.error('Failed to create team:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Team Name
        </label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter team name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description (optional)
        </label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter team description"
          disabled={isSubmitting}
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Team'}
      </Button>
    </form>
  )
}
```

### Key Points
✅ 'use client' for form interactivity
✅ Zod schema defines validation rules
✅ `z.infer` creates TypeScript types
✅ React Hook Form with zodResolver
✅ Type-safe form data
✅ Error messages from Zod validation
✅ Server action called on submit

---

## Example 6: Prisma Query Pattern

### Location
`lib/services/gamification.service.ts`

### Implementation
```typescript
import { prisma } from '@/lib/prisma.db'

/**
 * Get extended user gamification statistics
 * Only selects necessary fields for performance
 */
export async function getExtendedUserStats(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      xpTotal: true,
      currentLevel: true,
      currentStreak: true,
      questsCompleted: true,
      achievementsUnlocked: {
        select: {
          achievement: {
            select: {
              id: true,
              name: true,
              rarity: true,
            },
          },
        },
        take: 5, // Limit for performance
      },
    },
  })
}

/**
 * Get user's active quests with type-safe filtering
 */
export async function getActiveQuests(userId: string) {
  return prisma.quest.findMany({
    where: {
      userId,
      status: 'IN_PROGRESS',
    },
    select: {
      id: true,
      title: true,
      description: true,
      xpReward: true,
      progress: true,
      targetValue: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })
}

/**
 * Update user XP and calculate level changes
 * Uses transaction for atomicity
 */
export async function addUserXp(userId: string, amount: number) {
  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        xpTotal: {
          increment: amount,
        },
      },
      select: {
        xpTotal: true,
        currentLevel: true,
      },
    }),
  ])

  return user
}
```

### Key Points
✅ Explicit `select` - no `SELECT *`
✅ Specific where clauses for filtering
✅ `take` to limit results
✅ `orderBy` for consistent ordering
✅ Transactions for multi-step operations
✅ Only select needed fields

---

## Pattern Checklist

When implementing Cache Components:

- [ ] Main component is synchronous (can be async for `page.tsx` with params)
- [ ] All `getSession()` calls are inside Suspense
- [ ] All `cookies()` calls are inside Suspense
- [ ] All database queries are in dynamic components
- [ ] Suspense has a fallback (Skeleton)
- [ ] Build completes with warnings (expected)
- [ ] Routes marked as `◐` (Partial Prerender) or `○` (Static)
- [ ] API routes with `headers()` are `ƒ` (Dynamic)

---

## Testing Cache Components

```bash
# Build and check output
bun run build

# Verify routes are marked correctly
# Look for ◐ next to /dashboard routes

# Test in development
bun run dev

# Navigate to routes - should load with skeleton first
# Session should be available after skeleton replaced
```

Success indicators:
✅ Build completes
✅ Dashboard routes marked as `◐`
✅ API routes with headers() marked as `ƒ`
✅ Pages load with skeleton first
✅ Content loads smoothly after
✅ Session is available after content loads
