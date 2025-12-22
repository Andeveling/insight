# 🚀 Insight Project - Resumen Ejecutivo

## El Problema que se Documentó

Durante `bun run build`, recibías errores como:
```
Error: During prerendering, `headers()` rejects when the prerender is complete.
This occurred at route "/dashboard/reports".
```

## La Solución: Cache Components Pattern

Next.js 16 con Cache Components requiere separar contenido **estático** de contenido **dinámico** usando **Suspense**:

```typescript
// ❌ PROBLEMA
export default async function Page() {
  const session = await getSession(); // Falla durante prerendering
}

// ✅ SOLUCIÓN
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  const session = await getSession(); // OK - dentro de Suspense
}
```

## Archivos Documentados

| Archivo | Propósito | Cuándo Leerlo |
|---------|-----------|---------------|
| **README.md** | Índice y guía de lectura | Primero |
| **copilot-instructions.md** | Referencia completa del proyecto | Tema general |
| **cache-components.md** | Patrones core de Cache Components | Cada vez que crees una página |
| **cache-components-build-errors.md** | Troubleshooting de errores | Cuando recibas errores |
| **cache-components-examples.md** | Ejemplos reales del proyecto | Necesitas ver código |
| **quick-reference.md** | Templates listos para copiar | Desarrollo rápido |

## Lo Crítico (Lee Esto)

### Regla de Oro #1: Suspense Boundary
```typescript
// La función MAIN debe ser synchronous
export default function Page() { // ← sync
  return (
    <Suspense fallback={<Skeleton />}>
      <Content /> {/* ← esta es async */}
    </Suspense>
  );
}
```

### Regla de Oro #2: Runtime APIs dentro de Suspense
```typescript
// ✅ getSession() SIEMPRE dentro de Suspense
async function Content() {
  const session = await getSession(); // OK
  const data = await fetchData(); // OK
  return <div>...</div>;
}

// ❌ getSession() NUNCA afuera de Suspense
export default async function Page() {
  const session = await getSession(); // ERROR
}
```

### Regla de Oro #3: Los warnings de build son normales
```
[getIndividualReadiness] Error: During prerendering, `headers()` rejects...
```
**= OK, NORMAL. Next.js está detectando correctamente que esto es dinámico.**

Build output correcto:
```
✓ Generating static pages (38/38)
✓ Finalizing page optimization

├ ◐ /dashboard           ← Partial Prerender (correcto)
├ ◐ /dashboard/reports   ← Partial Prerender (correcto)
└ ◐ /dashboard/team      ← Partial Prerender (correcto)
```

## Stack Tecnológico (Exacto)

```
Next.js 16.0.7          ← App Router + Cache Components
├─ React 19.2.0         ← Framework UI
├─ TypeScript            ← Lenguaje (strict)
├─ Prisma 7.1.0         ← ORM (libSQL para Turso)
├─ Tailwind CSS          ← Estilos (tema CyberPunk)
├─ React Hook Form       ← Manejo de formularios
├─ Zod                   ← Validación
└─ BetterAuth            ← Autenticación
```

## Patrones Encontrados en el Proyecto

### ✅ Dashboard Layout (Correcto)
Ubicación: `app/dashboard/layout.tsx`

Patrón:
1. Main component es **sync**
2. Wraps en **Suspense** con fallback
3. Dynamic component hace `getSession()`
4. Dynamic component tiene acceso a `cookies()`
5. Build muestra `◐ (Partial Prerender)`

### ✅ Server Actions (Correcto)
Ubicación: `app/dashboard/_actions/`

Patrón:
1. `'use server'` at top
2. Acceso seguro a `getSession()`
3. Acceso a Prisma database
4. `revalidatePath()` después de mutations

### ✅ Forms (Correcto)
Ubicación: `app/dashboard/_components/`

Patrón:
1. Client component (`'use client'`)
2. React Hook Form + Zod
3. Llama server action on submit
4. Usa `toast` para feedback

### ✅ API Routes (Automático)
Ubicación: `app/api/`

Patrón:
1. Acceso a `headers()` previene prerendering automáticamente
2. NO necesita `export const dynamic = "force-dynamic"`
3. Será `ƒ (Dynamic)` en build output

## Checklist para Nueva Página

```
[ ] Main component es SYNC (no async)
[ ] Todo lo async está en componente separado
[ ] Componente async wrapped en <Suspense>
[ ] Suspense tiene fallback={<Skeleton />}
[ ] getSession() dentro del componente async
[ ] cookies() dentro del componente async
[ ] Database queries dentro del componente async
[ ] Para [id] rutas: const { id } = await params;
[ ] Build completa sin errores (warnings OK)
[ ] Ruta es ◐ o ○ en build output
```

## Comandos Comunes

```bash
# Build y verificar output
bun run build

# Desarrollo local
bun run dev

# Type checking
bun run typecheck

# Linting
bun run lint
bun run format
bun run check
```

## Convenciones Clave

```
app/
  ├─ [layout.tsx]          - Suspense + async content
  ├─ [page.tsx]            - Main sync, Suspense wrapper
  ├─ _components/          - Components usados en la ruta
  ├─ _actions/             - Server actions (createXyz.ts)
  └─ api/                  - API routes (auto dynamic)

lib/
  ├─ auth.ts               - getSession() function
  ├─ prisma.db.ts          - Prisma client singleton
  ├─ cn.ts                 - classNames utility
  ├─ actions/              - Server actions compartidas
  ├─ services/             - Lógica de negocio
  └─ types/                - Tipos TypeScript

components/
  ├─ cyber-ui/             - Componentes CyberPunk
  └─ ui/                   - shadcn/ui
```

## Nombres

```
Files:        kebab-case      (user-profile.tsx)
Components:   PascalCase      (UserCard)
Functions:    camelCase       (getUserData)
Constants:    UPPER_SNAKE     (MAX_RETRIES)
Booleans:     verb-based      (isLoading, hasPermission)
```

## Colores & Estilos

```
❌ NO: <div className="text-red-500 bg-blue-400">
✅ SÍ: <div className="text-error bg-primary">

Use: cn() para condicionales
❌ className={`base ${active ? 'active' : ''}`}
✅ className={cn('base', active && 'active')}
```

## Cuando Recibas Errores

| Error | Significa | Solución |
|-------|-----------|----------|
| `headers() rejects during prerendering` | Runtime API fuera de Suspense | Lee: cache-components-build-errors.md |
| `dynamic not compatible with cacheComponents` | Removiste el `export const dynamic` | Usa Suspense en lugar de eso |
| `Session undefined` | Component no está dentro de Suspense | Wrap en `<Suspense>` |
| TypeScript error | Tipo implicit any o incorrecto | Declara type explícitamente |

## Quick Links

- **Documentación completa**: `.github/copilot/README.md`
- **Patrones Cache Components**: `.github/copilot/cache-components.md`
- **Ejemplos reales**: `.github/copilot/cache-components-examples.md`
- **Troubleshooting**: `.github/copilot/cache-components-build-errors.md`
- **Templates**: `.github/copilot/quick-reference.md`

## El Punto Principal

**Cache Components en Next.js 16 = separar static (rápido) de dynamic (streaming)**

```
┌─────────────────────────────────┐
│  Static Shell (prerendered)     │ ← RÁPIDO ⚡
├─────────────────────────────────┤
│  Loading Skeleton (fallback)    │ ← VISIBLE ✨
├─────────────────────────────────┤
│  Dynamic Content (streaming)    │ ← DATOS REALES 🔄
└─────────────────────────────────┘
```

**Resultado**: Usuarios ven estructura inmediatamente, contenido carga al fondo.

---

## Próximos Pasos

1. **Lee**: `.github/copilot/README.md` (5 min)
2. **Entiende**: El patrón de Suspense (10 min)
3. **Practica**: Copia un template de `quick-reference.md` (5 min)
4. **Verifica**: Tu nueva página hace `bun run build` sin errores (2 min)

**Total: ~22 minutos para dominar el patrón.**

---

## Preguntas Frecuentes

**P: ¿Por qué Suspense es obligatorio?**
R: Next.js 16 pre-renderiza rutas. Si usas `getSession()` en el main component, Next.js intenta ejecutarlo durante build y falla. Suspense separa esto correctamente.

**P: ¿Estos warnings en build son un problema?**
R: NO. Son Next.js informándote que detectó correctamente qué es dinámico.

**P: ¿Debo cambiar `export const dynamic = "force-dynamic"`?**
R: SÍ. Es incompatible con Cache Components. Usa Suspense en su lugar.

**P: ¿Qué es `◐ (Partial Prerender)`?**
R: HTML estático (shell) + contenido dinámico (streaming). Exactamente lo que queremos.

**P: ¿Mi API route necesita cambios?**
R: NO. API routes con `headers()` automáticamente saltan prerendering.

---

**Documentación finalizada**: 22 de diciembre de 2025

Toda la información necesaria para evitar problemas de Cache Components está documentada.
