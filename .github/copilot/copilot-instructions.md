# GitHub Copilot Instructions - Insight Project

## Priority Guidelines

Cuando generes código para este repositorio:

1. **Cache Components First**: Este proyecto usa Next.js 16 con Partial Pre-Rendering (PPR). SIEMPRE sigue el patrón static shell + Suspense + dynamic content
2. **Version Compatibility**: Respeta las versiones exactas detectadas (Next.js 16.0.7, React 19.2.0, TypeScript ES2017)
3. **Pattern Consistency**: Analiza archivos similares ANTES de generar código
4. **Type Safety**: Usa tipos explícitos; evita `any`
5. **Code Quality**: Prioriza mantenibilidad, seguridad y testabilidad

---

## Tech Stack & Exact Versions

### Core Versions
- **Next.js**: 16.0.7 (Turbopack, Cache Components **enabled**)
- **React**: 19.2.0
- **React DOM**: 19.2.0
- **TypeScript**: ES2017 target, strict mode enabled
- **Node.js**: Usa `bun` como package manager

### Database & ORM
- **Prisma**: 7.1.0
- **Prisma Adapter**: libSQL (for Turso)
- **Database**: SQLite (dev) / Turso (production)
- **Location**: `prisma/schema.prisma`
- **Client**: `lib/prisma.db.ts` (singleton pattern with libSQL)

### Authentication
- **Library**: better-auth 1.4.5
- **Location**: `lib/auth.ts`
- **Pattern**: Server-side session with headers()
- **Usage**: `await getSession()` inside Suspense boundaries only

### Forms & Validation
- **Forms**: react-hook-form 7.68.0
- **Validation**: Zod 4.1.13
- **Pattern**: Type-safe forms with Zod schemas

### UI Framework
- **CSS**: Tailwind CSS + CyberPunk theme
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: lucide-react 0.562.0
- **Animation**: motion 12.23.25
- **Notifications**: sonner 2.0.7

### AI & Utilities
- **AI SDK**: OpenAI 2.0.80, Google 2.0.44
- **File Upload**: @react-pdf/renderer 4.3.1
- **Data Flow**: @xyflow/react 12.10.0
- **Date Handling**: date-fns 4.1.0

---

## Architecture Overview

### Directory Structure
```
app/
  ├─ (auth)/               # Auth routes (login, etc)
  ├─ api/                  # API routes (dynamic by default with headers())
  ├─ dashboard/            # Protected routes with Suspense pattern
  │  ├─ _components/       # Dashboard-specific components
  │  ├─ _actions/          # Server actions
  │  ├─ assessment/
  │  ├─ reports/
  │  └─ team/
  ├─ _components/          # Global components
  ├─ _shared/              # Shared utilities
  ├─ layout.tsx            # Root layout
  └─ page.tsx              # Home page

components/
  ├─ cyber-ui/             # Custom CyberPunk theme components
  ├─ gamification/         # Gamification system components
  └─ ui/                   # shadcn/ui components

lib/
  ├─ auth.ts               # Authentication utilities
  ├─ prisma.db.ts          # Prisma singleton
  ├─ cn.ts                 # classNames utility
  ├─ actions/              # Server actions
  ├─ services/             # Business logic
  ├─ hooks/                # React hooks
  ├─ types/                # TypeScript types
  ├─ constants/            # App constants
  └─ utils/                # Utility functions

prisma/
  ├─ schema.prisma         # Data models
  ├─ migrations/           # Migration history
  └─ seeders/              # Database seeders
```

### Architectural Style
- **Pattern**: Cache Components (Next.js 16 PPR)
- **Data Layer**: Prisma ORM with libSQL
- **Auth**: Server-side with BetterAuth
- **Styling**: Utility-first (Tailwind) with theme variables
- **State**: Minimal (React hooks + Server Components)

---

## Cache Components Critical Patterns

### ✅ Pattern to Follow (See cache-components.md)

```typescript
// CORRECT: Main component is sync, dynamic content wrapped in Suspense
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  const session = await getSession(); // OK - inside Suspense
  return <div>...</div>;
}
```

### ❌ Anti-Pattern to Avoid

```typescript
// WRONG: Accessing getSession() outside Suspense
export default async function Page() {
  const session = await getSession(); // ERROR during prerendering
  return <div>{session.user.name}</div>;
}
```

### Build Behavior
- `bun run build` will show warnings about `headers()` - **THIS IS EXPECTED**
- Routes will be marked as `◐ (Partial Prerender)` - **THIS IS CORRECT**
- Build should complete successfully even with warnings
- Refer to `cache-components.md` for detailed troubleshooting

---

## Naming Conventions

### Files & Directories
- **Files**: `kebab-case` (e.g., `user-profile.tsx`, `db-utils.ts`)
- **Directories**: `kebab-case` (e.g., `app/dashboard/team-tips/`)
- **Special files**: Follow Next.js conventions (page.tsx, layout.tsx, route.ts)

### Code Identifiers
- **Classes/Interfaces**: `PascalCase` (e.g., `UserProfile`, `DatabaseConfig`)
- **Functions/Variables**: `camelCase` (e.g., `getUserData()`, `isLoggedIn`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `DEFAULT_PAGE_SIZE`)
- **Boolean flags**: verb-based (e.g., `isLoading`, `hasPermission`, `shouldRefresh`)

### React Components
- **File**: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- **Export**: Single named export per file
- **Props**: `PascalCase + 'Props'` suffix (e.g., `UserCardProps`)

---

## Code Organization Patterns

### Component Structure
```typescript
/**
 * JSDoc comment describing component purpose and usage
 */

interface ComponentProps {
  // Props interface with clear types
}

export function ComponentName({ prop }: ComponentProps) {
  // Implementation
}
```

### Server Actions
- Location: `app/dashboard/_actions/` or `lib/actions/`
- Pattern: `'use server'` at top of file
- Naming: `actionName.ts` (e.g., `create-user.ts`, `update-profile.ts`)
- Usage: Import and call directly from Client Components

Example:
```typescript
// lib/actions/create-team.ts
'use server'

import { prisma } from '@/lib/prisma.db'
import { revalidatePath } from 'next/cache'

export async function createTeam(name: string) {
  const team = await prisma.team.create({ data: { name } })
  revalidatePath('/dashboard/team')
  return team
}
```

### Type Definitions
- Location: `lib/types/` with descriptive names
- Pattern: One main type per file or related types together
- Naming: Descriptive and exported as default or named

Example structure:
```typescript
// lib/types/user.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export interface UserProfile extends User {
  bio?: string
  avatar?: string
}
```

---

## Database & Prisma Patterns

### Schema Conventions
- **Model names**: Singular (e.g., `User`, `TeamMember`, `OrderItem`)
- **Field names**: `camelCase` (e.g., `createdAt`, `updatedAt`, `deletedAt`)
- **Timestamps**: Always include `createdAt`, `updatedAt`, optionally `deletedAt` (soft delete)
- **IDs**: Use `uuid()` for `id`, auto-increment as fallback
- **Enums**: Named with domain context (e.g., `MaturityLevel`, `QuestStatus`)

### Client Instantiation
- **Location**: `lib/prisma.db.ts`
- **Pattern**: Singleton with `global.prisma` fallback
- **Connection**: Uses `PrismaLibSql` adapter for Turso/SQLite
- **NEVER expose** raw Prisma client in HTTP handlers

Example usage:
```typescript
import { prisma } from '@/lib/prisma.db'

const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, name: true }
})
```

### Query Best Practices
1. **Select specific fields** - Avoid `SELECT *`
2. **Use `where` precisely** - Filter at DB level
3. **Batch operations** - Use `findMany` with indexed fields
4. **Transactions** - For multi-step operations (order + items)
5. **Avoid N+1** - Use `include` or batch queries

---

## Form Handling (React Hook Form + Zod)

### Pattern
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

type FormData = z.infer<typeof schema>

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  )
}
```

---

## TypeScript Guidelines

### Strict Mode
- **Enabled**: `strict: true` in tsconfig.json
- **No `any`**: Always declare explicit types
- **Union types**: Prefer over optional fields when logical

### Path Aliases (from tsconfig.json)
```
@/*         → root directory
@/prisma/*  → prisma directory
@/auth/*    → app/(auth) directory
@/dashboard/* → app/dashboard directory
```

### Type Exports
- **Default export**: For main types
- **Named exports**: For related type groups
- **Inference**: Use `z.infer<typeof schema>` for Zod types

---

## Styling Patterns

### Tailwind CSS + Theme Variables
- **Colors**: Use `global.css` theme variables, NOT hardcoded color classes
- **Forbidden**: `text-red-500`, `bg-blue-400`, etc.
- **Correct**: `text-error`, `bg-primary`, etc.

CyberPunk theme variables in `global.css`:
```css
--foreground
--background
--primary
--secondary
--muted
--border
--error
--success
```

### classNames Utility
- **Function**: `cn()` from `lib/cn.ts`
- **Usage**: Never use template literals for conditional styles
- **Pattern**: Always use `cn()` for merging classes

```typescript
import { cn } from '@/lib/cn'

// ✅ CORRECT
<div className={cn('base-class', isActive && 'active-class')} />

// ❌ WRONG
<div className={`base-class ${isActive ? 'active-class' : ''}`} />
```

---

## Error Handling

### Pattern
```typescript
import { Prisma } from '@/generated/prisma'

try {
  const result = await operation()
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error('Record already exists')
    }
  }
  throw error
}
```

### Logging
- **Console**: Use for development only
- **Structured**: Log with context when available
- **Errors**: Include full error messages

---

## Environment Variables
- **Location**: `.env.local` (local), `.env.production` (production), `.env` (defaults)
- **Prefix**: `NEXT_PUBLIC_` for client-side variables
- **Database**: `DATABASE_URL` or `TURSO_DATABASE_URL`
- **Auth**: `BETTER_AUTH_SECRET`
- **AI**: `OPENAI_API_KEY`, `GOOGLE_API_KEY`

---

## Build & Deployment

### Build Command
```bash
bun run build
```

This runs:
1. `prisma generate` - Generate Prisma client
2. `next build` - Build Next.js with Cache Components

### Expected Output
- Warnings about `headers()` in dashboard routes are EXPECTED
- Routes marked as `◐ (Partial Prerender)` are CORRECT
- Build should complete with exit code 0

### Performance Tips
- Don't disable source maps unless necessary
- Monitor build memory usage
- Cache .next directory between deploys

---

## Testing & Quality

### Linting
```bash
bun run lint     # Run Biome linter
bun run format   # Format code
bun run check    # Full check + write fixes
```

### Type Checking
```bash
bun run typecheck # Run TypeScript without emitting
```

### Code Quality Standards
1. **No console.log in production** - Use proper logging
2. **All publics exports documented** - JSDoc for functions/classes
3. **Type safety** - No implicit `any`
4. **Error handling** - Specific error types, never silent failures
5. **Performance** - Memoize expensive operations, use Suspense

---

## Documentation Rules

### Comments
- **Public APIs**: JSDoc with `@param`, `@returns`, `@throws`
- **Complex logic**: Explain WHY, not WHAT
- **TODO**: Include author and deadline
- **Deprecated**: Mark with `@deprecated` and suggest alternatives

### File Headers
```typescript
/**
 * Description of file purpose
 * 
 * Key exports:
 * - ExportedFunction
 * - ExportedClass
 */
```

---

## Security Best Practices

1. **Input validation**: Always use Zod for form/API data
2. **SQL injection**: Never raw SQL, use Prisma parameterization
3. **CORS**: Configured at middleware level (proxy.ts)
4. **Secrets**: Never commit `.env.local`, use env variables
5. **Session**: Validated on server, stored in secure cookies
6. **CSRF**: Handled by Next.js automatically with server actions

---

## Performance Optimization

### Images
- Use Next.js Image component
- Optimize with proper sizes/quality
- Lazy load below fold

### Code Splitting
- Server Components by default
- Client Components with `'use client'` for interactivity
- Dynamic imports for heavy libraries

### Caching
- Database queries: Cache with Prisma
- API responses: Use `use cache` directive
- Static assets: Browser caching headers

### Suspense Strategy
- One Suspense per major content section
- Granular skeletons that match layout
- Multiple Suspense boundaries = better UX

---

## Git & Version Control

### Commit Messages
- Format: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `docs`, `chore`
- Example: `feat(dashboard): add team creation form`

### Branch Naming
- Feature: `feature/description`
- Fix: `fix/issue-number`
- Refactor: `refactor/description`

### Migration Workflow
```bash
# Create migration
bun run db:migrate -- --name description

# For Turso
bun run db:migrate:turso
```

---

## Common Patterns Found in Codebase

### Fetching Data (Server Components)
```typescript
async function Component() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### Error Boundaries
Components implement error.tsx following Next.js pattern

### Loading States
Implement loading.tsx for streaming UI

### Redirects
Use `redirect()` from `next/navigation` in Server Components

### Revalidation
Use `revalidatePath()` after mutations

---

## When in Doubt

1. **Check similar files** - Look for established patterns
2. **Consult Cache Components guide** - Refer to `cache-components.md`
3. **Read test files** - Understanding how code is tested
4. **Follow build warnings** - They guide toward correct patterns
5. **Type errors are your friend** - Let TypeScript guide you

---

## Quick Reference Links

- Cache Components: See `.github/copilot/cache-components.md`
- Prisma Docs: https://prisma.io/docs
- Next.js 16: https://nextjs.org/docs
- React 19: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind: https://tailwindcss.com/docs
