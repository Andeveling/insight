# insight Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-13

## Active Technologies
- TypeScript (strict mode) / Next.js 16 with App Router (004-strength-pathways)
- Turso (libSQL) via Prisma ORM (004-strength-pathways)
- TypeScript 5.x (strict mode) + Next.js 16 (App Router), React 19, Prisma, Turso (005-gamification-integration)
- Turso (libSQL) via Prisma ORM - modelos UserGamification, Badge, UserBadge (005-gamification-integration)
- TypeScript 5, React 19, Next.js 16 (App Router) + Tailwind CSS v4 (tokens en `app/globals.css`), shadcn/ui + Radix, motion, Zod, React Hook Form, BetterAuth (006-gamified-profile-ui)
- Turso/libSQL vía Prisma 7 (`@prisma/client`, `@prisma/adapter-libsql`) (006-gamified-profile-ui)
- TypeScript 5.x, Node.js 20+ + Next.js 16, React 19, Prisma 7.1, motion/react, Vercel AI SDK 5.x, Zod 4.x (007-development-refactor)
- Turso (libSQL) via Prisma ORM with @prisma/adapter-libsql (007-development-refactor)
- TypeScript (Next.js 16 App Router with Cache Components pattern) (008-feedback-gamification)
- SQLite (Turso remote + local dev), esquema Prisma existente (008-feedback-gamification)
- TypeScript 5.x (strict mode) + Prisma ORM, Vercel AI SDK, Zod, React Hook Form (009-contextual-reports)
- Turso (libSQL) via Prisma - Sin cambios de schema requeridos (010-learning-path-flow)
- TypeScript 5.x, Next.js 16 (App Router) + Tailwind CSS, Lucide React, Framer Motion (motion/react) (011-refactor-dashboard-root)
- Prisma (via Server Actions) (011-refactor-dashboard-root)
- TypeScript 5.7 (strict mode) + Next.js 16 (App Router, RSC, Turbopack), React 19, Prisma 6.15, BetterAuth 1.4, Tailwind CSS 4.0, shadcn/ui, Radix UI, Framer Motion 11, Zod 3.24 (012-strength-levels)
- Turso (libSQL) via Prisma ORM, existing `UserStrength` and `UserGamification` models to extend (012-strength-levels)

- TypeScript 5.x con strict mode habilitado (003-subteam-builder)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x con strict mode habilitado: Follow standard conventions

## Recent Changes
- 012-strength-levels: Added TypeScript 5.7 (strict mode) + Next.js 16 (App Router, RSC, Turbopack), React 19, Prisma 6.15, BetterAuth 1.4, Tailwind CSS 4.0, shadcn/ui, Radix UI, Framer Motion 11, Zod 3.24
- 011-refactor-dashboard-root: Added TypeScript 5.x, Next.js 16 (App Router) + Tailwind CSS, Lucide React, Framer Motion (motion/react)
- 010-learning-path-flow: Added TypeScript 5.x (strict mode)


<!-- MANUAL ADDITIONS START -->
## Correcciones manuales (repo real)

- **Package manager**: usar `bun` / `bunx` (no `npm`).
- **Estructura real (alto nivel)**:

```text
app/
components/
lib/
prisma/
specs/
```

- **Comandos comunes**:
	- `bun install`
	- `bun dev`
	- `bun run lint`
	- `bun run build`

<!-- MANUAL ADDITIONS END -->
