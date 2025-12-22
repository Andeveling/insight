# Next.js 16 Cache Components - Build Errors Guide

## Problem Summary

Durante `bun run build` con **Cache Components habilitado**, se observan errores como:

```
Error: During prerendering, `headers()` rejects when the prerender is complete.
This occurred at route "/dashboard/reports".
```

## Why This Happens

Con Next.js 16 y `cacheComponents: true`:

1. **Prerendering intenta ejecutar TODAS las rutas** al momento del build
2. **Algunas rutas usan `headers()`** (a través de `getSession()`) para datos dinámicos
3. **Next.js detecta la operación dinámica** y cancela el prerendering
4. **Pero la Promise de `headers()`** continúa ejecutándose después de que se cancela
5. **Esto causa un "hanging promise rejection"** → error en logs

## The Solution: Cache Components Pattern

### Root Cause
```typescript
// ❌ WRONG - getSession() is called outside Suspense
export default async function DashboardLayout({ children }) {
  const session = await getSession(); // This tries to run during prerendering
  // ...
}
```

Durante prerendering:
1. Next.js ejecuta `getSession()`
2. `getSession()` intenta acceder a `headers()`
3. Durante prerendering, `headers()` rechaza la promise
4. La promise rechazada causa el error

### The Fix: Wrap in Suspense
```typescript
// ✅ CORRECT - Dynamic content inside Suspense
export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

// This only runs at request time, NOT during prerendering
async function DashboardLayoutContent({ children }) {
  const session = await getSession();
  // ...
}
```

Durante prerendering:
1. Next.js renderiza el Suspense boundary con fallback
2. NO ejecuta el componente dinámico (DashboardLayoutContent)
3. Esto se marca como `◐ (Partial Prerender)`
4. En request time, el componente dinámico se ejecuta y carga la sesión

## Build Output Interpretation

### Warnings are Expected
```
[getIndividualReadiness] Error: During prerendering, `headers()` rejects...
prisma:error During prerendering, fetch() rejects...
```

**Esto es CORRECTO y esperado.** Next.js está:
- Detectando que el componente accede a runtime APIs
- Cancelando el prerendering
- Marcando la ruta como `◐ (Partial Prerender)`

### Success Indicators
Build completes with:
```
 ✓ Compiled successfully
 ✓ Generating static pages using 11 workers (38/38)
 ✓ Finalizing page optimization
```

Routes marked as:
```
├ ◐ /dashboard              # Partial - Shell static, content dynamic
├ ◐ /dashboard/reports      # Partial - Same pattern
└ ◐ /dashboard/team         # Partial - Same pattern
```

## Implementation Checklist

### For Pages
```typescript
// Step 1: Main component stays synchronous
export default function Page() {
  // Step 2: Wrap any async content in Suspense
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

// Step 3: Move ALL runtime data fetching here
async function PageContent() {
  const session = await getSession();
  const data = await fetchData();
  return <div>...</div>;
}

// Step 4: Provide quick loading UI
function PageSkeleton() {
  return <Skeleton className="h-96 w-full" />;
}
```

### For Layouts
```typescript
// Same pattern for nested layouts
export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

async function DashboardLayoutContent({ children }) {
  const session = await getSession();
  if (!session) redirect('/login');
  
  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      {children}
    </SidebarProvider>
  );
}
```

### For Dynamic Routes
```typescript
interface PageProps {
  params: Promise<{ id: string }>;
}

// params is now a Promise - must await it
export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent id={id} />
    </Suspense>
  );
}

async function PageContent({ id }: { id: string }) {
  const data = await fetchById(id);
  return <div>...</div>;
}
```

### For API Routes
```typescript
// API routes with headers() automatically skip prerendering
// No changes needed - they work correctly
export async function GET() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  
  return Response.json({ userAgent });
  // This route will NOT be prerendered (automatic)
}

// API routes without headers() CAN be prerendered
export async function GET() {
  return Response.json({
    projectName: 'Next.js',
    version: '16.0.7'
  });
  // This route WILL be prerendered (static)
}
```

## Migration Path

### 1. Identify Affected Routes
Look for routes with errors in build output:
```
[functionName] Error: During prerendering...
```

### 2. Apply Pattern
For each route, identify:
- What is static content?
- What needs runtime data?
- Split into main + dynamic components

### 3. Verify Build
```bash
bun run build
```

Expected output:
```
✓ Generating static pages using 11 workers (38/38)
✓ Finalizing page optimization
```

Routes should show `◐ (Partial Prerender)` not errors.

### 4. Test Locally
```bash
bun run dev
# Navigate to routes - should load normally
# Session should work - user is logged in
```

## Why NOT to Use `export const dynamic = "force-dynamic"`

❌ **Incompatible with Cache Components:**
```typescript
// DON'T DO THIS
export const dynamic = 'force-dynamic'

export default async function Page() {
  const session = await getSession()
  return <div>...</div>
}
```

Error during build:
```
Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`
```

✅ **Use Suspense instead:**
```typescript
// DO THIS
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  const session = await getSession()
  return <div>...</div>
}
```

## Performance Impact

With Cache Components + Suspense:

| Metric | Before | After |
|--------|--------|-------|
| TTFB (Time to First Byte) | Slow (full render) | Fast (shell only) |
| First Paint | 3-5s | 100-200ms |
| Hydration | After content loads | Immediate |
| UX | Loading delay | Skeleton then content |

**Result**: Users see structure immediately, content streams in.

## Troubleshooting

### Still Getting Errors?

1. **Check all Suspense boundaries** - Every `await` needs Suspense
2. **Verify extraction** - Async code MUST be in separate component
3. **Check nesting** - Dynamic component inside Suspense boundary, not outside
4. **Rebuild clean** - Delete `.next` and rebuild: `rm -rf .next && bun run build`

### Performance Issues?

1. **Skeleton is too heavy** - Make it minimal (just layout hints)
2. **Too much in fallback** - Keep fallback UI fast
3. **Multiple nested Suspense** - Consider granular boundaries for better UX

### Specific Patterns That Work

**Page with multiple data sources:**
```typescript
export default function Page() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>

      <Suspense fallback={<ContentSkeleton />}>
        <MainContent />
      </Suspense>

      <Suspense fallback={<AsideSkeleton />}>
        <Aside />
      </Suspense>
    </div>
  );
}

async function Header() {
  const session = await getSession();
  return <header>{session.user.name}</header>;
}

async function MainContent() {
  const data = await fetchContent();
  return <main>{data}</main>;
}

async function Aside() {
  const sidebar = await fetchSidebar();
  return <aside>{sidebar}</aside>;
}
```

## References

- **Official Docs**: https://nextjs.org/docs/app/getting-started/cache-components
- **Route Handlers**: https://nextjs.org/docs/app/getting-started/route-handlers#with-cache-components
- **Suspense**: https://react.dev/reference/react/Suspense

---

## Key Takeaway

**Cache Components requires a mental model shift:**

- ❌ Old way: `export default async function Page() { ... }`
- ✅ New way: Split into sync shell + async content with Suspense

The build errors are **NOT failures** - they're **Next.js correctly detecting runtime APIs** and directing them to partial prerendering. Warnings during build are expected and harmless.
