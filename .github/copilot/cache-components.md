# Cache Components Guidelines

## Overview

Este proyecto usa **Next.js 16 con Cache Components (Partial Pre-Rendering)** habilitado. Este patrón permite mezclar contenido estático, cacheado y dinámico en una misma ruta.

### Configuración
- `next.config.ts`: `cacheComponents: true`
- Framework: Next.js 16.0.7
- React: 19.2.0
- TypeScript: ES2017

## Core Pattern: Static Shell + Dynamic Content with Suspense

### Template Base

```typescript
/**
 * page.tsx - Cache Components Pattern
 */

import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Static shell - prerendered automatically
 * Contains ONLY static content (layout, navigation, static text)
 * NO async operations that access headers(), cookies(), or params
 */
export default function Page() {
  return (
    <Container title="Page Title" description="Page description">
      {/* Static header, navigation, etc. */}
      <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>
    </Container>
  );
}

/**
 * Loading skeleton - part of static shell
 * Shows immediately while dynamic content loads
 * Must be fast and provide layout hints
 */
function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

/**
 * Dynamic content - renders at request time
 * Contains ALL runtime data access:
 * - getSession() (accesses headers internally)
 * - cookies()
 * - searchParams
 * - params (for dynamic routes)
 * - Database queries
 * - Server-side computations
 */
async function PageContent() {
  // Runtime data access MUST be here, not in the main component
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Database queries
  const data = await fetchUserData(session.user.id);

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </div>
  );
}
```

## Critical Rules

### ✅ DO

1. **Keep main component synchronous** - Only static content
2. **Wrap dynamic content in Suspense** - Required for Cache Components
3. **Extract dynamic logic to separate components** - Inside Suspense
4. **Access runtime APIs in dynamic components** - Inside Suspense boundary
5. **Provide fallback UI** - Skeleton that matches layout
6. **Await params in dynamic routes** - `const { id } = await params;`

### ❌ DON'T

1. **Never access headers()/cookies() in main component** - Will cause prerender errors
2. **Never use `export const dynamic = "force-dynamic"`** - Incompatible with Cache Components
3. **Never skip Suspense for runtime data** - Causes hanging promise errors
4. **Never put getSession() outside Suspense** - Will prerender indefinitely
5. **Never await promises without Suspense** - Will error during build

## Dynamic Routes Pattern

Para rutas dinámicas (`[id]`, etc.), `params` es una Promise:

```typescript
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Static shell for dynamic route
 * Main component stays synchronous
 */
export default async function DynamicPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Container>
      <Suspense fallback={<PageSkeleton />}>
        <DynamicPageContent id={id} />
      </Suspense>
    </Container>
  );
}

/**
 * Dynamic content receiving params as props
 * Runtime operations go here
 */
async function DynamicPageContent({ id }: { id: string }) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const data = await fetchDataById(id);
  return <div>{/* render data */}</div>;
}
```

## Error Handling During Prerendering

### Common Error Pattern

```
Error: During prerendering, `headers()` rejects when the prerender is complete.
This occurred at route "/api/gamification/progress".
```

### Root Causes

1. ❌ `getSession()` called in main component → needs Suspense
2. ❌ `cookies()` accessed without Suspense → needs wrapping
3. ❌ Runtime data fetched outside Suspense → needs boundary
4. ❌ Async operation without Suspense → needs fallback UI

### Solutions

**For pages:**
```typescript
// ❌ WRONG - Will error during prerendering
export default async function Page() {
  const session = await getSession(); // ERROR
  return <div>{session.user.name}</div>;
}

// ✅ CORRECT - Uses Suspense
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  const session = await getSession(); // OK - inside Suspense
  return <div>{session.user.name}</div>;
}
```

**For layouts with shared runtime data:**
```typescript
// dashboard/layout.tsx - Pattern
export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

async function DashboardLayoutContent({ children }) {
  const session = await getSession(); // OK - inside Suspense
  if (!session) redirect("/login");
  
  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <main>{children}</main>
    </SidebarProvider>
  );
}
```

**For API routes accessing headers:**
```typescript
// app/api/my-route/route.ts
// ✅ API routes with headers() automatically skip prerendering
export async function GET() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  
  // This API route will NOT be prerendered because it accesses headers()
  return Response.json({ userAgent });
}

// ✅ API routes with static data are prerendered
export async function GET() {
  return Response.json({ 
    projectName: 'Next.js',
    version: '16.0.7'
  });
}
```

## Build Output Symbols

After `bun run build`, rutas se marcan como:

- **○ (Static)** - Completely static, prerendered at build time
- **◐ (Partial Prerender)** - Static shell + dynamic streamed content (THIS IS NORMAL)
- **ƒ (Dynamic)** - Server-rendered on demand

**Expected for dashboard routes:**
```
├ ◐ /dashboard
├ ◐ /dashboard/reports
├ ◐ /dashboard/reports/individual
└ ◐ /dashboard/team
```

Warnings about `headers()` during build are **EXPECTED** and harmless - Next.js is detecting runtime APIs correctly.

## Testing Cache Components

Para verificar que el patrón funciona:

```bash
# Build debe completar exitosamente (con warnings)
bun run build

# Debe ver "◐ (Partial Prerender)" para dashboard routes
# Warnings sobre headers() son normales y esperados
```

## Migration Checklist

Al crear/refactorizar páginas:

- [ ] Componente principal es síncrono (puede ser default export)
- [ ] Todas las operaciones async están en componentes separados
- [ ] Componentes con `getSession()`, `cookies()`, queries están en Suspense
- [ ] `Suspense` tiene fallback (Skeleton)
- [ ] Para rutas dinámicas: `params` está awaited
- [ ] Redirecciones están dentro del componente dinámico
- [ ] Confirmado en build que la ruta es "◐" o "○"

## Performance Tips

1. **Skeleton UI**: Debe ser rápido y replicar el layout
2. **Granular Suspense**: Pequeños componentes = mejor UX
3. **Cache dinámico**: Usa `use cache` para datos que no cambian
4. **Streaming**: Next.js automáticamente streamea Suspense

Ejemplo con múltiples Suspense:

```typescript
export default function Page() {
  return (
    <div className="space-y-6">
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
  );
}
```

## References

- [Next.js Cache Components Docs](https://nextjs.org/docs/app/getting-started/cache-components)
- [Route Handlers with Cache Components](https://nextjs.org/docs/app/getting-started/route-handlers#with-cache-components)
- [Partial Prerendering (PPR)](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
