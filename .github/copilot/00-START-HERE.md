# 📚 Copilot Instructions - Project Documentation

## What This Is

This directory contains comprehensive documentation for the Insight project, specifically designed to help GitHub Copilot and developers understand:

1. **Cache Components Pattern** - How to correctly implement Next.js 16 PPR
2. **Project Architecture** - Directory structure and patterns used
3. **Code Conventions** - Naming, styling, type safety standards
4. **Common Patterns** - Real examples from the codebase
5. **Troubleshooting** - Solutions to common build errors

## Why This Matters

The main issue documented here was:

```
Error: During prerendering, `headers()` rejects when the prerender is complete.
This occurred at route "/dashboard/reports".
```

**Root cause**: Accessing runtime APIs (like `getSession()`) outside of Suspense boundaries during prerendering.

**Solution**: Implement the Cache Components pattern correctly with Suspense.

## Files at a Glance

| File | Size | Purpose | Read Time |
|------|------|---------|-----------|
| [EXECUTIVE-SUMMARY.md](./EXECUTIVE-SUMMARY.md) | 8.5 KB | Quick overview and checklist | 5 min |
| [copilot-instructions.md](./copilot-instructions.md) | 14.6 KB | Complete reference guide | 15 min |
| [cache-components.md](./cache-components.md) | 8.2 KB | Core patterns and rules | 10 min |
| [cache-components-build-errors.md](./cache-components-build-errors.md) | 8.5 KB | Error diagnosis and fixes | 10 min |
| [cache-components-examples.md](./cache-components-examples.md) | 17.7 KB | Real code examples | 15 min |
| [quick-reference.md](./quick-reference.md) | 11.4 KB | Copy-paste templates | 5 min |
| [README.md](./README.md) | 15.8 KB | Navigation guide | 5 min |

**Total Documentation**: ~84 KB across 7 files

## Quick Start

### For New Developers
```bash
1. Read: EXECUTIVE-SUMMARY.md (5 minutes)
2. Review: cache-components-examples.md - Example 1 (10 minutes)
3. Start coding using quick-reference.md templates
```

### For Experienced Developers
```bash
1. Reference: copilot-instructions.md (as needed)
2. Copy templates from: quick-reference.md
3. Troubleshoot using: cache-components-build-errors.md
```

### When You Get Build Errors
```bash
1. Read: cache-components-build-errors.md
2. Find your pattern in: cache-components.md
3. Run: bun run build again
```

## The Core Concept

**Next.js 16 Cache Components requires separating static from dynamic content:**

```
┌──────────────────────────────────┐
│ Main Component (SYNC)            │
│ - Returns immediately            │
│ - Renders static shell           │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ <Suspense fallback={<Skeleton/>}>│
│ - Shows loading skeleton          │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ Dynamic Component (ASYNC)        │
│ - Runs at request time           │
│ - Can access getSession()        │
│ - Can access databases           │
└──────────────────────────────────┘
```

## Pattern Example

```typescript
// ✅ CORRECT: Main sync, Suspense wrapper, content async
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  const session = await getSession(); // OK - inside Suspense
  return <div>{session.user.name}</div>;
}
```

```typescript
// ❌ WRONG: Accessing getSession() outside Suspense
export default async function Page() {
  const session = await getSession(); // ERROR
  return <div>{session.user.name}</div>;
}
```

## Tech Stack Reference

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.7 | App Router + Cache Components |
| React | 19.2.0 | UI Framework |
| TypeScript | ES2017 | Type safety |
| Prisma | 7.1.0 | ORM |
| Tailwind CSS | Latest | Styling |
| React Hook Form | 7.68.0 | Form handling |
| Zod | 4.1.13 | Validation |
| BetterAuth | 1.4.5 | Authentication |

## Build Output Explanation

When you run `bun run build`, you'll see:

```
✓ Compiled successfully
✓ Generating static pages using 11 workers (38/38)
✓ Finalizing page optimization

├ ○ /                    ← Static (no runtime APIs)
├ ◐ /dashboard           ← Partial Prerender (has Suspense)
├ ◐ /dashboard/reports   ← Partial Prerender (has Suspense)
└ ƒ /api/health          ← Dynamic (API route)
```

**Legend**:
- `○` = Static (fully prerendered)
- `◐` = Partial Prerender (shell + streamed content) ← THIS IS NORMAL FOR DASHBOARD
- `ƒ` = Dynamic (server-rendered on demand)

**Warnings about `headers()`**: NORMAL, EXPECTED, HARMLESS ✅

## Common Mistakes

### Mistake #1: getSession() outside Suspense
```typescript
// ❌ WRONG
export default async function Page() {
  const session = await getSession();
}
```
**Fix**: Wrap in Suspense, put getSession() in child component

### Mistake #2: Using export const dynamic
```typescript
// ❌ WRONG (incompatible with Cache Components)
export const dynamic = 'force-dynamic'

// ✅ CORRECT
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content />
    </Suspense>
  );
}
```

### Mistake #3: Hardcoded color classes
```typescript
// ❌ WRONG
className="text-red-500 bg-blue-400"

// ✅ CORRECT
className="text-error bg-primary"
```

### Mistake #4: Concatenating classNames
```typescript
// ❌ WRONG
className={`base ${active ? 'active' : ''}`}

// ✅ CORRECT
import { cn } from '@/lib/cn'
className={cn('base', active && 'active')}
```

## Documentation Hierarchy

```
README.md (you are here)
├── EXECUTIVE-SUMMARY.md          ← Start here
│   └── For quick overview
├── copilot-instructions.md        ← Complete reference
│   └── For specific guidance
├── cache-components.md            ← Core patterns
│   └── For implementing pages
├── cache-components-build-errors.md ← Troubleshooting
│   └── When something breaks
├── cache-components-examples.md   ← Real code
│   └── For copy-paste patterns
└── quick-reference.md             ← Templates
    └── For fast development
```

## How GitHub Copilot Uses This

1. **Context Analysis**: Copilot reads these files to understand your project
2. **Pattern Matching**: Generates code following documented patterns
3. **Quality Assurance**: Validates generated code against guidelines
4. **Error Prevention**: Suggests fixes based on documented common mistakes

## Maintenance Notes

These documents should be updated when:
- New dependencies are added (update versions in copilot-instructions.md)
- New patterns emerge in the codebase (add to cache-components-examples.md)
- New errors/solutions are discovered (update cache-components-build-errors.md)
- Architecture changes (update copilot-instructions.md)

## Key Takeaways

1. **Cache Components is the way**: Always use Suspense + async components pattern
2. **Build warnings are normal**: Errors about `headers()` are expected
3. **Test locally first**: `bun run dev` before `bun run build`
4. **Follow the templates**: Use quick-reference.md to stay consistent
5. **When in doubt**: Consult the examples from cache-components-examples.md

## Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Prisma Docs](https://prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

**Last Updated**: December 22, 2025

This documentation was created to prevent future Cache Components-related issues and provide a comprehensive reference for the Insight project architecture.

Questions? Check the relevant guide above or ask in code review.
