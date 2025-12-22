# GitHub Copilot Instructions for Prisma Workspace

## Project Overview

Este proyecto es una plataforma de evaluación y desarrollo de fortalezas personales y de equipo, diseñada para ayudar a individuos y organizaciones a identificar, comprender y potenciar sus habilidades únicas. Utilizando metodologías basadas en la psicología positiva y el análisis de datos, Insight ofrece evaluaciones personalizadas, informes detallados y recursos prácticos para fomentar el crecimiento personal y profesional.

Basados en el test de fortalezas de High5Test, los usuarios pueden configurar sus perfiles con sus fortalezas identificadas, unirse a equipos y generar informes que destacan tanto sus fortalezas individuales como las dinámicas de equipo.

## General Guidelines

1. **Language**: Spanish for UI and UX and English only for code and comments.
2. **Types**: Declare explicit types; avoid `any`.
3. **Comments**: Use JSDoc for public methods and classes.
4. **Exports**: One export per file.
5. **Naming**:

   - **Classes/interfaces** → `PascalCase`
   - **Variables/functions** → `camelCase`
   - **Files/directories** → `kebab-case`
   - **Constants** → `UPPERCASE`
   - **Boolean flags** → verb-based (e.g., `isLoading`)

6. **Package Manager**: Use `bun` and `bunx` consistently.
7. **classNames**: If we need using conditional or merge styles never use literal templates, using `/lib/cn.ts` this util contain `cn` function.
8. **CSS Colors**: Not use colors elements example text-red-500, use `global.css` theme variables always.
9. **Documentation**: NEVER create documents in root folder, always create in `/docs` folder in correct subfolder.

---

## Tech Stack

Framework:

1. Next.js 16 (App Router) Cachecomponents
2. TypeScript
3. ORM: Prisma
4. Autenticación: BetterAuth
5. Estilos: Tailwind CSS
6. UI Primitivas: Shadcn + Radix UI
7. Formularios: React Hook FormValidación: ZodUtilidades
8. Clave: ai, motion, sonner

---

## Prisma-Specific Guidelines

### 1. Data Modeling

- **Domain-driven model names**: keep them singular (e.g. `User`, `OrderItem`).
- **Field naming**: use `camelCase` for fields (e.g. `createdAt`, `deletedAt`).
- **IDs & keys**:

  ````prisma
  model Post {
    id    Int    @id @default(autoincrement())
    uuid  String @unique @default(uuid())
  }
  /```
  ````

- **Composite keys & uniques**:

  ````prisma
  @@id([userId, role])
  @@unique([email, tenantId])
  /```
  ````

- **Enums & constrained values**: leverage `enum` for fixed domains.
- **Soft deletes & audit**:

  ````prisma
  model Base {
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    deletedAt DateTime?
  }
  /```
  ````

### 2. Indexing & Constraints

- **Single-column indexes** for frequent lookups:

  ````prisma
  @@index([email])
  /```
  ````

- **Compound indexes** for multi-field filters/sorts:

  ````prisma
  @@index([status, createdAt])
  /```
  ````

- **Full-text search** (Postgres-only):

  ````prisma
  @@index([title, content], type: Brin)  // or Gin for JSONB
  /```
  ````

### 3. Migrations

- **Descriptive names**: `npx prisma migrate dev --name add-order-totals`
- **Idempotent steps**: avoid imperative SQL in migrations.
- **Shadow database**: enable in CI to catch drift.
- **Never edit** migration SQL after it’s applied to any environment.

### 4. Client Instantiation & Connection Management

- **Singleton pattern with libSQL adapter** (para Turso/SQLite)

  ````ts
  // lib/prisma.db.ts
  import { PrismaLibSql } from "@prisma/adapter-libsql";
  import { PrismaClient } from "@/generated/prisma/client";

  declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
  }

  function createPrismaClient(): PrismaClient {
    const isProduction = process.env.NODE_ENV === "production";
    const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";

    const finalUrl = databaseUrl.startsWith("file:")
      ? databaseUrl
      : databaseUrl.startsWith("libsql://")
      ? databaseUrl
      : `file:${databaseUrl}`;

    const adapter = new PrismaLibSql({
      url: finalUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    return new PrismaClient({
      adapter,
      log: isProduction ? ["error"] : ["error", "warn"],
    });
  }

  export const prisma = global.prisma || createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
  /```
  ````

- **Puntos clave:**
  - Usar `global.prisma` con declaración TypeScript explícita
  - Inicialización simple sin try-catch ni logs excesivos para evitar problemas con prerendering de Next.js 16
  - El adapter libSQL maneja tanto URLs `file:` (local) como `libsql://` (Turso remoto)
  - Singleton pattern previene múltiples instancias en hot reload

### 5. Transactions & Batch Operations

- **Multi-step atomicity**:

  ````ts
  const result = await prisma.$transaction([
    prisma.user.create({ data: { /*…*/ } }),
    prisma.order.create({ data: { /*…*/ } }),
  ]);
  /```
  ````

- **Interactive transactions** for long-running flows.
- **Bulk writes**: chunk large inserts/updates to avoid timeouts.

### 6. Precise Queries & Performance

- **Select only needed fields**:

  ````ts
  await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  /```
  ````

- **Avoid N+1**: use `include` or batch `findMany` with `where: { id: { in: [...] } }` or use database joins in prisma.
- Use **Cursor-based pagination**

### 7. Raw Queries & Client Extensions

- **Raw SQL** when necessary, safely:

  ````ts
  const users = await prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${email}`;
  /```
  ````

- **Sanitize inputs** with `Prisma.sql` for complex interpolations.
- **Client extensions**: use preview feature `clientExtensions` to add common helper methods.

### 8. Error Handling

- **Catch specific errors**:

  ````ts
  try {
    // …
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint
    }
  }
  /```
  ````

- **Wrap in service-level errors** to add context before bubbling up.

### 9. Testing

- **In-memory DB** (SQLite) or **Testcontainers** for integration tests.
- **Mock Prisma Client** for pure unit tests via `jest.mock()` or similar.

### 10. Logging, Monitoring & Metrics

- **Enable query logging** in dev:

  ````ts
  new PrismaClient({ log: ['query', 'warn', 'error'] });
  /```
  ````

- **APM integration** (Datadog, Sentry) – capture latency, errors.

### 11. Security & Best Practices

- **Never expose** raw Prisma client in HTTP controllers—wrap in a service layer.
- **Validate inputs** (e.g. with Zod) before any DB operation.
- **Least privilege** DB users: use separate roles for migrations vs. runtime.
- **Rotate credentials** and load from secure vault (AWS Secrets Manager, etc.).

### 12. Environment & Configuration

- **Centralize `DATABASE_URL`** and connection settings in `.env`.
- **Pin preview features** in `schema.prisma`:

  ````prisma
  generator client {
    previewFeatures = ["clientExtensions", "interactiveTransactions"]
  }
  /```
  ````

- **Version pinning**: match CLI and client versions in `package.json`.

---

## Next.js 16 Cache Components Pattern

### Overview

Este proyecto usa **Cache Components** (PPR - Partial Pre-Rendering) habilitado en Next.js 16. Este patrón permite mezclar contenido estático, cacheado y dinámico en una misma ruta, proporcionando la velocidad de sitios estáticos con la flexibilidad de rendering dinámico.

### Core Principles

1. **NO usar `dynamic = "force-dynamic"`** - Con Cache Components, todas las páginas son dinámicas por defecto.
2. **Shell estático + Suspense** - Separar contenido estático (shell) del dinámico (dentro de Suspense).
3. **Runtime data en componentes separados** - Cualquier acceso a `cookies()`, `headers()`, `searchParams`, o `params` debe estar dentro de un componente envuelto en `<Suspense>`.

### Standard Page Pattern

```typescript
/**
 * page.tsx - Standard Cache Components Pattern
 */

import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Static shell - prerendered automatically
 * Contains layout, navigation, static text
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
 * Contains session access, database queries, runtime data
 */
async function PageContent() {
  // Runtime data access (cookies, headers, etc.)
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

### Dynamic Routes Pattern

Para rutas dinámicas, `params` es una Promise que debe ser awaited:

```typescript
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Static shell for dynamic route
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
 */
async function DynamicPageContent({ id }: { id: string }) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const data = await fetchDataById(id);
  return <div>{/* render data */}</div>;
}
```

### Benefits of This Pattern

1. **PPR (Partial Pre-Rendering)**: Shell HTML se sirve instantáneamente desde el edge
2. **Streaming**: Contenido dinámico se transmite cuando está listo
3. **Better UX**: Usuarios ven estructura inmediatamente con skeletons
4. **SEO Optimized**: HTML estático para crawlers, contenido dinámico para interactividad
5. **Performance**: Reduce Time to First Byte (TTFB) y mejora Core Web Vitals

### Migration Checklist

Al crear o refactorizar páginas:

- [ ] Remover `export const dynamic = "force-dynamic"` (obsoleto)
- [ ] Separar shell estático (componente principal) de contenido dinámico
- [ ] Crear componente `PageContent` para lógica dinámica
- [ ] Crear componente `PageSkeleton` para estado de carga
- [ ] Envolver `PageContent` en `<Suspense fallback={<PageSkeleton />}>`
- [ ] Mover `getSession()`, queries DB, y runtime data a `PageContent`
- [ ] Verificar que `params` sea awaited si es ruta dinámica
- [ ] Mantener UI estática (nav, headers, footers) fuera de Suspense

### Anti-Patterns to Avoid

❌ **NO hacer:**

```typescript
export const dynamic = "force-dynamic"; // Obsoleto con Cache Components

export default async function Page() {
  const session = await getSession(); // Runtime data sin Suspense
  const data = await fetchData(); // Database sin Suspense
  return <div>{data}</div>;
}
```

✅ **SÍ hacer:**

```typescript
export default function Page() {
  return (
    <Container>
      <Suspense fallback={<Skeleton />}>
        <PageContent />
      </Suspense>
    </Container>
  );
}

async function PageContent() {
  const session = await getSession();
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### References

- [Next.js Cache Components Docs](https://nextjs.org/docs/app/getting-started/cache-components)
- [Partial Prerendering (PPR)](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
- [React Suspense](https://react.dev/reference/react/Suspense)
