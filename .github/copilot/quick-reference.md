# Quick Reference - Cache Components Patterns

Copiar y adaptar estos snippets para nuevas páginas.

## Template 1: Simple Page with Data Fetch

```typescript
import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

async function PageContent() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Fetch data here
  const data = await fetchData(session.user.id)

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </div>
  )
}
```

---

## Template 2: Layout with Nested Dynamic Content

```typescript
import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}

function LayoutSkeleton() {
  return (
    <div className="flex">
      <Skeleton className="w-64 h-screen" />
      <div className="flex-1">
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  )
}

async function LayoutContent({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div className="flex">
      <Sidebar user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

---

## Template 3: Dynamic Route with [id]

```typescript
import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent id={id} />
    </Suspense>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

async function PageContent({ id }: { id: string }) {
  const session = await getSession()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const item = await fetchItemById(id, session.user.id)
  
  if (!item) {
    redirect('/items')
  }

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
    </div>
  )
}
```

---

## Template 4: Page with Multiple Suspense Sections

```typescript
import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>

      <Suspense fallback={<ContentSkeleton />}>
        <MainContent />
      </Suspense>

      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </div>
  )
}

function HeaderSkeleton() {
  return <Skeleton className="h-16 w-full" />
}

async function Header() {
  const session = await getSession()
  if (!session) redirect('/login')
  
  return <header>Welcome, {session.user.name}</header>
}

function ContentSkeleton() {
  return <Skeleton className="h-96 w-full" />
}

async function MainContent() {
  const data = await fetchMainContent()
  return <main>{/* render data */}</main>
}

function SidebarSkeleton() {
  return <Skeleton className="h-96 w-64" />
}

async function Sidebar() {
  const sidebarData = await fetchSidebarData()
  return <aside>{/* render sidebar */}</aside>
}
```

---

## Template 5: Server Action (for forms)

```typescript
'use server'

import { prisma } from '@/lib/prisma.db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Input schema for validation
const inputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

type Input = z.infer<typeof inputSchema>

export async function createItem(input: Input) {
  try {
    // Validate input
    const validatedInput = inputSchema.parse(input)
    
    // Get authenticated user
    const session = await getSession()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Create in database
    const item = await prisma.item.create({
      data: {
        ...validatedInput,
        userId: session.user.id,
      },
    })

    // Revalidate affected routes
    revalidatePath('/items')

    return { success: true, itemId: item.id }
  } catch (error) {
    console.error('Failed to create item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
```

---

## Template 6: Client Component with Server Action

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createItem } from './create-item.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CreateItemForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      const result = await createItem(data)
      
      if (result.success) {
        toast.success('Item created!')
        reset()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Input
          id="description"
          {...register('description')}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </Button>
    </form>
  )
}
```

---

## Template 7: API Route (GET)

```typescript
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma.db'

/**
 * GET /api/items
 * Returns user's items
 * 
 * Note: getSession() uses headers(), so this route
 * automatically skips prerendering (no need for dynamic export)
 */
export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const items = await prisma.item.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Template 8: Prisma Query Pattern

```typescript
// lib/services/item.service.ts

import { prisma } from '@/lib/prisma.db'

/**
 * Get items for user (efficient query)
 */
export async function getUserItems(userId: string) {
  return prisma.item.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10, // Limit results
  })
}

/**
 * Get single item with validation
 */
export async function getItemById(id: string, userId: string) {
  return prisma.item.findUnique({
    where: { id },
  }).then(item => {
    // Verify ownership
    if (item?.userId !== userId) return null
    return item
  })
}

/**
 * Create item (transaction pattern)
 */
export async function createItemWithTags(
  userId: string,
  name: string,
  tags: string[]
) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.item.create({
      data: {
        name,
        userId,
        tags: {
          connect: tags.map(tag => ({ id: tag })),
        },
      },
    })
    return item
  })
}
```

---

## Checklist antes de hacer commit

- [ ] Main component es **synchronous**
- [ ] Componentes async están **inside Suspense**
- [ ] Suspense tiene **fallback (Skeleton)**
- [ ] `getSession()` está **inside Suspense**
- [ ] `cookies()` está **inside Suspense**
- [ ] Database queries están **inside Suspense**
- [ ] Para rutas dinámicas: **`const { id } = await params;`**
- [ ] Types son **explícitos** (no `any`)
- [ ] Build completa **sin errores** (warnings OK)
- [ ] Ruta es **`◐` (Partial Prerender)** o **`○` (Static)**

---

## Common Mistakes to Avoid

```typescript
// ❌ WRONG - getSession outside Suspense
export default async function Page() {
  const session = await getSession()
  return <div>{session.user.name}</div>
}

// ✅ CORRECT
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content />
    </Suspense>
  )
}

async function Content() {
  const session = await getSession()
  return <div>{session.user.name}</div>
}
```

```typescript
// ❌ WRONG - export const dynamic (incompatible)
export const dynamic = 'force-dynamic'
export default async function Page() { }

// ✅ CORRECT - Use Suspense instead
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content />
    </Suspense>
  )
}
```

```typescript
// ❌ WRONG - Hardcoded colors
<div className="text-red-500 bg-blue-400">

// ✅ CORRECT - Theme variables
<div className="text-error bg-primary">
```

```typescript
// ❌ WRONG - concat classNames with template literal
className={`base-class ${isActive ? 'active' : ''}`}

// ✅ CORRECT - Use cn() utility
className={cn('base-class', isActive && 'active')}
```

---

## Debug Tips

1. **Build warnings about headers()?** → Normal, expected, harmless
2. **Route not prerendering?** → Check if marked as `◐` (Partial Prerender) → OK
3. **Session undefined?** → Make sure it's inside Suspense + child component
4. **Skeleton not showing?** → Make sure Suspense has fallback prop
5. **Type errors?** → Use explicit types, no `any`

---

Esta referencia rápida debe permitirte copiar & adaptar patrones correctos fácilmente.
