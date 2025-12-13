# Implementation Plan: Sub-Team Builder & Match Analyzer

**Branch**: `003-subteam-builder` | **Date**: 13 de diciembre de 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-subteam-builder/spec.md`

## Summary

Crear una herramienta de composición de sub-equipos que permite a líderes de equipo crear equipos virtuales a partir de un equipo principal y analizar su compatibilidad de fortalezas para tipos de proyectos específicos. El sistema calculará un match score en tiempo real (0-100) y proporcionará análisis de brechas identificando fortalezas críticas faltantes según el tipo de proyecto.

## Technical Context

**Language/Version**: TypeScript 5.x con strict mode habilitado  
**Primary Dependencies**: 
  - Next.js 16 (App Router, React Server Components)
  - Prisma ORM (libSQL adapter para Turso)
  - React Hook Form + Zod validation
  - Vercel AI SDK con GPT-4o (opcional para análisis avanzado)
  - shadcn/ui + Radix UI
  - Tailwind CSS

**Storage**: Turso (libSQL) via Prisma ORM con SQLite local en desarrollo  
**Testing**: Playwright para tests E2E (ya configurado en el proyecto)  
**Target Platform**: Web application (Next.js 16 App Router)  
**Project Type**: Web application con feature-first architecture  
**Performance Goals**: 
  - Match score calculation <2s
  - Carga inicial de lista de sub-equipos <1s
  - Real-time UI updates durante selección de miembros <100ms

**Constraints**: 
  - Sub-equipos limitados a 2-10 miembros
  - Cálculo de match score debe ser determinístico y explicable
  - Sin dependencias de servicios externos para cálculo core (AI solo para insights adicionales)
  - UI debe funcionar con Next.js 16 Cache Components (PPR)

**Scale/Scope**: 
  - 50-100 sub-equipos por organización
  - Equipos principales de 5-50 miembros
  - 4 tipos de proyecto predefinidos
  - Cálculo de match score con 5 factores ponderados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Human-First Design ✅

**Status**: PASS

- UI será intuitiva con drag-and-drop para selección de miembros
- Match score será explicable con desglose por categorías
- Análisis de brechas proporcionará recomendaciones accionables
- Modo "What-If" permite exploración sin consecuencias

### II. Positive Psychology Foundation ✅

**Status**: PASS

- Feature se basa en framework de fortalezas existente (HIGH5)
- Match score resalta complementariedad de fortalezas
- Análisis de brechas enfoca en oportunidades, no deficiencias
- Recomendaciones empoderan decisiones informadas

### III. Feature-First Architecture ✅

**Status**: PASS

- Código se organizará en `app/dashboard/team/[teamId]/sub-teams/`
- Estructura: `_components/`, `_hooks/`, `_actions/`, `_schemas/`, `_utils/`
- Reutilización de componentes shared de `components/ui/`
- Tipos centralizados en `lib/types/subteam.types.ts`

### IV. AI-Augmented Insights ✅

**Status**: PASS (with clarification)

- AI es **opcional** para insights adicionales (ej: recomendaciones narrativas)
- Cálculo core de match score es algorítmico (sin AI)
- Si se usa AI, output validado con Zod schemas
- Fallback graceful si AI no disponible

### V. Type Safety & Explicit Contracts ✅

**Status**: PASS

- TypeScript strict mode
- Zod schemas para validación de formularios y AI outputs
- Prisma types generados para modelos DB
- Interfaces explícitas en `lib/types/`

### Technology Standards Compliance ✅

**Status**: PASS

- Framework: Next.js 16 App Router con PPR
- Database: Turso/libSQL via Prisma
- Auth: BetterAuth (ya implementado)
- Styling: Tailwind CSS con CSS variables
- UI: shadcn/ui + Radix UI
- Forms: React Hook Form + Zod
- Package Manager: Bun

### Summary

**🟢 NO VIOLATIONS DETECTED** - Feature cumple todos los principios constitucionales sin necesidad de complejidad adicional.

## Project Structure

### Documentation (this feature)

```text
specs/003-subteam-builder/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions and best practices
├── data-model.md        # Phase 1: Prisma schema extensions
├── quickstart.md        # Phase 1: Implementation guide
├── contracts/           # Phase 1: TypeScript interfaces and Zod schemas
│   ├── subteam.types.ts
│   ├── match-score.types.ts
│   └── project-type.types.ts
├── checklists/
│   └── requirements.md  # Quality checklist (already created)
└── tasks.md             # Phase 2: Implementation tasks (created by /speckit.tasks)
```

### Source Code (Feature-First Architecture)

```text
app/
├── dashboard/
│   └── team/
│       └── [teamId]/
│           └── sub-teams/              # NEW: Sub-team builder feature
│               ├── page.tsx            # List view of sub-teams
│               ├── new/
│               │   └── page.tsx        # Create sub-team wizard
│               ├── [subTeamId]/
│               │   ├── page.tsx        # Sub-team detail view
│               │   └── edit/
│               │       └── page.tsx    # Edit sub-team
│               ├── _components/
│               │   ├── subteam-list.tsx
│               │   ├── subteam-card.tsx
│               │   ├── subteam-form.tsx
│               │   ├── member-selector.tsx
│               │   ├── project-type-selector.tsx
│               │   ├── match-score-display.tsx
│               │   ├── gap-analysis.tsx
│               │   ├── what-if-simulator.tsx
│               │   └── subteam-report.tsx
│               ├── _actions/
│               │   ├── create-subteam.ts
│               │   ├── update-subteam.ts
│               │   ├── delete-subteam.ts
│               │   ├── calculate-match-score.ts
│               │   └── generate-report.ts
│               ├── _hooks/
│               │   ├── use-subteam.ts
│               │   ├── use-match-score.ts
│               │   └── use-what-if.ts
│               ├── _schemas/
│               │   ├── subteam.schema.ts
│               │   └── project-type.schema.ts
│               └── _utils/
│                   ├── match-score-calculator.ts
│                   ├── gap-analyzer.ts
│                   └── strength-coverage.ts

lib/
├── types/
│   ├── subteam.types.ts           # NEW: SubTeam interfaces
│   └── match-score.types.ts       # NEW: Match score types
├── services/
│   └── subteam.service.ts         # NEW: Business logic layer
└── utils/
    └── subteam-helpers.ts         # NEW: Utility functions

prisma/
├── schema.prisma                   # UPDATED: Add SubTeam and ProjectTypeProfile models
├── data/
│   └── project-types.data.ts      # NEW: Seed data for project types
└── seeders/
    └── seed-project-types.ts      # NEW: Project type seeder

tests/
└── e2e/
    └── subteam-builder.spec.ts    # NEW: Playwright E2E tests
```

**Structure Decision**: Web application con Next.js 16 feature-first architecture. La feature se ubica dentro de la ruta existente de equipos (`app/dashboard/team/[teamId]/`) siguiendo el patrón establecido. Componentes privados usan prefijo `_` para co-localización. Código compartido genuino vive en `lib/`. Prisma schema se extiende con nuevos modelos.

## Complexity Tracking

**Status**: No violations detected. Feature complies with all constitutional principles without requiring additional complexity justification.
