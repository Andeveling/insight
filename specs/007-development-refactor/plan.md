# Implementation Plan: Development Module Refactor - Strength-Focused Learning

**Branch**: `007-development-refactor` | **Date**: 2025-12-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-development-refactor/spec.md`

## Summary

Refactorizar el módulo de desarrollo para enfocarlo exclusivamente en las fortalezas Top 5 del usuario, implementando dos tipos de módulos (generales reutilizables y personalizados únicos), eliminando módulos de dominios completos, y añadiendo progresión secuencial con cuestionario de perfil profesional. El diseño sigue Gaming Fluent Design con animaciones motion/react y componentes reutilizables.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Next.js 16, React 19, Prisma 7.1, motion/react, Vercel AI SDK 5.x, Zod 4.x  
**Storage**: Turso (libSQL) via Prisma ORM with @prisma/adapter-libsql  
**Testing**: E2E testing planificado (no implementado en esta fase)  
**Target Platform**: Web (SSR/RSC optimizado)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: <2s TTI, módulos cargados en streaming via Suspense  
**Constraints**: Gamificación existente debe mantenerse funcional, migración no destructiva  
**Scale/Scope**: ~5 fortalezas por usuario, ~20 módulos generales totales, N módulos personalizados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Human-First Design | ✅ PASS | Módulos personalizados potencian crecimiento individual |
| II. Positive Psychology Foundation | ✅ PASS | Enfocado en fortalezas (strengths-based), no deficiencias |
| III. Feature-First Architecture | ✅ PASS | Estructura `_components/`, `_actions/`, `_schemas/` existente |
| IV. AI-Augmented Insights | ✅ PASS | Módulos personalizados usan AI para generación |
| V. Type Safety & Explicit Contracts | ✅ PASS | Zod schemas para todas las entradas/salidas |

**Resultado**: Aprobado para proceder

## Project Structure

### Documentation (this feature)

```text
specs/007-development-refactor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/dashboard/development/
├── page.tsx                        # Main page (refactor for Top 5 gate)
├── layout.tsx                      # Layout
├── loading.tsx                     # Loading state
├── error.tsx                       # Error boundary
├── _actions/
│   ├── index.ts
│   ├── get-modules.ts              # MODIFY: Filter by Top 5 only
│   ├── get-user-progress.ts
│   ├── start-module.ts
│   ├── check-can-generate.ts       # NEW: Check if user can request new modules
│   ├── generate-personalized.ts    # NEW: Generate personalized module
│   ├── get-professional-profile.ts # NEW: Get/create professional profile
│   └── save-professional-profile.ts # NEW: Save profile answers
├── _components/
│   ├── index.ts
│   ├── module-list.tsx             # MODIFY: Two sections (general/personalized)
│   ├── module-card.tsx             # MODIFY: Add type indicator
│   ├── strength-gate.tsx           # NEW: Top 5 requirement gate
│   ├── professional-profile-form.tsx # NEW: Onboarding questionnaire
│   ├── module-type-badge.tsx       # NEW: General/Personalized badge
│   ├── generate-module-button.tsx  # NEW: Gated generation button
│   └── ...existing components
├── _schemas/
│   ├── index.ts
│   ├── module.schema.ts            # MODIFY: Add moduleType field
│   ├── professional-profile.schema.ts # NEW: Profile questionnaire schemas
│   └── ...existing schemas
├── _hooks/
│   ├── index.ts
│   ├── use-module-generation.ts    # NEW: Hook for module generation state
│   └── ...existing hooks
└── _utils/
    ├── index.ts
    └── ...existing utils

prisma/
├── schema.prisma                   # MODIFY: Add new models
└── migrations/
    └── YYYYMMDD_add_module_types_and_profile/ # NEW

lib/
├── services/
│   └── module-generator.service.ts # NEW: AI module generation service
└── types/
    └── development.types.ts        # MODIFY: Add new types
```

**Structure Decision**: Feature-first architecture siguiendo convención existente. Nuevos componentes y actions añadidos a la estructura `_` existente.

## Complexity Tracking

> No hay violaciones de la constitución que requieran justificación.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

# Phase 0: Research

## Research Tasks Identified

### R1: Módulos Generales vs Personalizados - Estrategia de Cache
**Context**: FR-004 requiere reutilización de módulos generales entre usuarios
**Decision**: 
- Módulos generales: Almacenados en `DevelopmentModule` con `moduleType = 'general'`
- Módulos personalizados: Generados por AI, almacenados con `moduleType = 'personalized'` y `userId`
- Cache: Módulos generales cacheados a nivel de fortaleza, personalizados nunca compartidos

**Rationale**: Prisma permite filtrar por `strengthKey` para generales y `userId` para personalizados sin cambios arquitectónicos mayores.

### R2: Progresión Secuencial - Implementación del Gate
**Context**: FR-006 requiere bloquear generación hasta completar módulos pendientes
**Decision**:
- Verificar count de `UserModuleProgress` donde `status != 'completed'`
- Si pendientes > 0, botón "Generar nuevo" está deshabilitado con tooltip explicativo
- UI muestra lista de módulos pendientes para referencia

**Rationale**: Query simple en Prisma, UX clara con feedback visual usando motion/react.

### R3: Cuestionario de Perfil Profesional
**Context**: FR-008, FR-009 requieren recopilar información del perfil
**Decision**:
- Nueva tabla `UserProfessionalProfile` con campos:
  - `roleStatus`: enum ('satisfied', 'partially_satisfied', 'unsatisfied')
  - `currentRole`: string opcional
  - `careerGoals`: string opcional (JSON array)
  - `industryContext`: string opcional
- Cuestionario mostrado una vez al acceder a development por primera vez
- Skip opcional con valores por defecto

**Rationale**: Modelo simple que permite expansión futura. Valores neutrales permiten funcionamiento sin completar.

### R4: Eliminación de Módulos de Dominio
**Context**: FR-007 elimina módulos de dominios completos
**Decision**:
- Soft-delete: Agregar `isArchived` flag en lugar de eliminar datos
- Query filtra `isArchived = false` y `domainKey IS NULL` (solo fortalezas)
- Migración marca módulos existentes de dominio como archivados

**Rationale**: Preserva datos históricos, migración reversible, no rompe progreso existente.

### R5: Gaming Fluent Design con motion/react
**Context**: Usuario requiere diseño Gaming Fluent con animaciones
**Decision**:
- Usar `motion/react` para:
  - Entry animations en cards (fade + slide)
  - Progress bar animations suaves
  - Badge unlock celebrations
  - Button hover/press states
- Componentes hexagonales y escudos para badges (ya existentes en `/components/gamification/`)
- Color palette de CSS variables para consistencia

**Rationale**: Stack existente ya usa motion/react, extender patrones de `/components/gamification/`.

---

## Dependencies Identified

| Dependency | Purpose | Version/Notes |
|------------|---------|---------------|
| motion/react | Animations | ^12.23.25 (instalado) |
| ai (Vercel AI SDK) | Module generation | ^5.0.108 (instalado) |
| zod | Schema validation | ^4.1.13 (instalado) |
| @ai-sdk/openai | GPT-4o provider | ^2.0.80 (instalado) |

Todas las dependencias ya están instaladas.

---

---

# Phase 1: Design Complete

## Artifacts Generated

| Artifact | Status | Path |
|----------|--------|------|
| Research | ✅ Complete | [research.md](research.md) |
| Data Model | ✅ Complete | [data-model.md](data-model.md) |
| API Contracts | ✅ Complete | [contracts/api-contracts.md](contracts/api-contracts.md) |
| Quickstart Guide | ✅ Complete | [quickstart.md](quickstart.md) |
| Agent Context | ✅ Updated | `.github/agents/copilot-instructions.md` |

## Constitution Check - Post Design

*Re-evaluation after Phase 1 design completion.*

| Principle | Status | Validation |
|-----------|--------|------------|
| I. Human-First Design | ✅ PASS | - Strength gate ensures personalized experience<br>- Profile questions empower user agency<br>- Clear feedback on why actions are blocked |
| II. Positive Psychology Foundation | ✅ PASS | - Focus exclusively on user's existing strengths<br>- No deficit-based content<br>- Progressive unlock encourages completion |
| III. Feature-First Architecture | ✅ PASS | - All new code in `_actions/`, `_components/`, `_schemas/`<br>- Barrel exports maintained<br>- Service layer in `lib/services/` |
| IV. AI-Augmented Insights | ✅ PASS | - Personalized modules use GPT-4o<br>- Zod schemas validate all AI outputs<br>- Fallback to general modules on AI failure |
| V. Type Safety & Explicit Contracts | ✅ PASS | - All inputs/outputs have Zod schemas<br>- No `any` types in contracts<br>- Prisma types generated from schema |

**Resultado Post-Diseño**: Aprobado - Listo para Phase 2 (Tasks)

---

## Next Steps

This plan is complete through Phase 1. To proceed:

1. **Generate tasks**: Run `/speckit.tasks` to create detailed implementation tasks
2. **Review priorities**: Tasks will be ordered by user story priority (P1 → P2 → P3)
3. **Begin implementation**: Follow task order for incremental delivery

---

## Plan Metadata

| Field | Value |
|-------|-------|
| Branch | `007-development-refactor` |
| Created | 2025-12-15 |
| Spec | [spec.md](spec.md) |
| Status | Phase 1 Complete |
| Next | `/speckit.tasks` |
