# Implementation Plan: Gamification Integration for Assessment & Feedback

**Branch**: `005-gamification-integration` | **Date**: December 14, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-gamification-integration/spec.md`

## Summary

Integrar el sistema de gamificación existente (XP, niveles, badges) con los módulos de Assessment y Peer Feedback para recompensar a los usuarios por completar evaluaciones y dar/recibir feedback. Esto requiere crear servicios de gamificación independientes dentro de cada módulo que **consuman** las APIs compartidas de `lib/services/` sin crear dependencias cruzadas entre features.

**Principio Clave: Inversión de Dependencias (SOLID)**
- Los módulos (assessment, feedback) NO importan directamente de development
- Cada módulo define sus propias acciones de gamificación que usan servicios de `lib/services/`
- Los servicios compartidos en `lib/` son agnósticos al dominio y reutilizables

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Next.js 16 (App Router), React 19, Prisma, Turso  
**Storage**: Turso (libSQL) via Prisma ORM - modelos UserGamification, Badge, UserBadge  
**Testing**: Vitest + Playwright E2E  
**Target Platform**: Web (responsive, SSR + CSR hybrid)  
**Project Type**: Web Application (Next.js monolith with feature-first architecture)  
**Performance Goals**: XP award < 2s, UI update < 100ms  
**Constraints**: No cross-feature imports, servicios compartidos solo en `lib/`  
**Scale/Scope**: ~15 Server Actions nuevas, 4 badges nuevos, 6 componentes de UI

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle                       | Status | Notes                                                                       |
| ------------------------------- | ------ | --------------------------------------------------------------------------- |
| I. Human-First Design           | ✅ PASS | XP rewards encourage completion without forcing; clear value messaging      |
| II. Positive Psychology         | ✅ PASS | Gamification reinforces growth mindset, badges celebrate milestones         |
| III. Feature-First Architecture | ✅ PASS | Each module (assessment, feedback) has its own `_actions/` for gamification |
| IV. AI-Augmented Insights       | N/A    | No AI changes in this feature                                               |
| V. Type Safety                  | ✅ PASS | All XP transactions typed, Zod schemas for inputs                           |

**Architecture Compliance (Dependency Inversion)**:

| Rule                     | Implementation                                                             |
| ------------------------ | -------------------------------------------------------------------------- |
| No cross-feature imports | assessment NO importa de feedback, feedback NO importa de development      |
| Shared services in lib/  | `lib/services/gamification.service.ts` (nuevo) para operaciones XP comunes |
| Feature-local actions    | `assessment/_actions/award-xp.ts`, `feedback/_actions/award-xp.ts`         |
| Types centralizados      | `lib/types/gamification.types.ts` (existente, extendido)                   |

## Project Structure

### Documentation (this feature)

```text
specs/005-gamification-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
├── checklists/          # Quality checklists
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (Inversión de Dependencias)

```text
lib/
├── services/
│   ├── xp-calculator.service.ts       # (EXISTENTE) Cálculos XP
│   ├── level-calculator.service.ts    # (EXISTENTE) Cálculos nivel
│   ├── badge-criteria.service.ts      # (EXISTENTE) Criterios badges
│   └── gamification.service.ts        # (NUEVO) API unificada de gamificación
├── constants/
│   ├── xp-levels.ts                   # (EXISTENTE) Niveles y XP
│   ├── badge-criteria.ts              # (EXISTENTE) Criterios badges
│   └── xp-rewards.ts                  # (NUEVO) Constantes de recompensas
└── types/
    └── gamification.types.ts          # (EXTENDER) Tipos para XP transactions

app/dashboard/
├── assessment/
│   ├── _actions/
│   │   ├── complete-phase.ts          # (MODIFICAR) Añadir award XP
│   │   ├── save-results-to-profile.ts # (MODIFICAR) Añadir award XP + badge
│   │   └── award-assessment-xp.ts     # (NUEVO) Server action para XP assessment
│   ├── _components/
│   │   ├── welcome-screen.tsx         # (MODIFICAR) Mostrar XP preview
│   │   ├── phase-transition.tsx       # (MODIFICAR) Mostrar XP ganado
│   │   └── xp-reward-preview.tsx      # (NUEVO) Componente de preview XP
│   └── _hooks/
│       └── use-assessment-xp.ts       # (NUEVO) Hook para tracking XP en assessment
│
├── feedback/
│   ├── _actions/
│   │   ├── feedback-response.actions.ts  # (MODIFICAR) Añadir award XP al submit
│   │   ├── feedback-request.actions.ts   # (MODIFICAR) Añadir XP cuando recibe respuesta
│   │   └── award-feedback-xp.ts          # (NUEVO) Server action para XP feedback
│   ├── _components/
│   │   ├── feedback-intro.tsx            # (MODIFICAR) Mostrar XP reward
│   │   ├── pending-requests.tsx          # (MODIFICAR) Mostrar potential XP
│   │   └── xp-incentive-banner.tsx       # (NUEVO) Banner de incentivo XP
│   └── respond/
│       └── [requestId]/
│           └── page.tsx                  # (MODIFICAR) Integrar XP display
│
├── development/
│   └── _components/
│       ├── xp-gain-toast.tsx          # (REUTILIZABLE) Exportar via lib
│       ├── level-up-notification.tsx  # (REUTILIZABLE) Exportar via lib
│       └── badge-unlock-modal.tsx     # (REUTILIZABLE) Exportar via lib

components/
└── gamification/                      # (NUEVO) Componentes compartidos
    ├── xp-gain-toast.tsx              # Copia adaptada de development
    ├── level-up-notification.tsx      # Copia adaptada de development
    ├── badge-unlock-modal.tsx         # Copia adaptada de development
    ├── xp-preview-card.tsx            # (NUEVO) Preview de XP a ganar
    └── index.ts                       # Barrel export

prisma/
├── data/
│   └── badges.data.ts                 # (MODIFICAR) Agregar 4 badges nuevos
└── schema.prisma                      # (VERIFICAR) No cambios necesarios
```

### Diagrama de Dependencias (Inversión)

```
┌─────────────────────────────────────────────────────────────────┐
│                        lib/services/                             │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ xp-calculator   │  │ level-calculator │  │ gamification   │ │
│  │    service      │  │     service      │  │    service     │ │
│  └────────▲────────┘  └────────▲─────────┘  └───────▲────────┘ │
└───────────┼───────────────────┼─────────────────────┼──────────┘
            │                   │                     │
            │ CONSUME           │ CONSUME             │ CONSUME
            │                   │                     │
┌───────────┼───────────────────┼─────────────────────┼──────────┐
│           │                   │                     │          │
│  ┌────────┴────────┐  ┌───────┴───────┐   ┌────────┴────────┐ │
│  │ assessment/     │  │ feedback/     │   │ development/   │  │
│  │ _actions/       │  │ _actions/     │   │ _actions/      │  │
│  │ award-xp.ts     │  │ award-xp.ts   │   │ complete-*.ts  │  │
│  └─────────────────┘  └───────────────┘   └────────────────┘  │
│                                                                │
│                    app/dashboard/ features                     │
│              (INDEPENDIENTES - NO se importan entre sí)        │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    components/gamification/                      │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ xp-gain-toast  │  │ level-up     │  │ badge-unlock-modal  │ │
│  │                │  │ notification │  │                     │ │
│  └────────────────┘  └──────────────┘  └─────────────────────┘ │
│              (COMPARTIDOS - usados por assessment y feedback)   │
└─────────────────────────────────────────────────────────────────┘
```

**Regla de Oro**: Los features en `app/dashboard/` NUNCA importan entre sí.
Solo consumen de:
- `lib/services/` - Lógica de negocio compartida
- `lib/types/` - Tipos compartidos
- `lib/constants/` - Constantes compartidas
- `components/` - Componentes UI compartidos

## Complexity Tracking

No hay violaciones de la Constitution. La arquitectura propuesta cumple con:
- Feature-first: Cada módulo tiene sus propias actions
- Dependency Inversion: Servicios compartidos en lib/, consumidos por features
- Single Responsibility: Cada action tiene un propósito específico

## Phase 0: Research Summary

### Servicios Existentes a Reutilizar

| Servicio                      | Ubicación     | Función                     | Uso en Esta Feature                    |
| ----------------------------- | ------------- | --------------------------- | -------------------------------------- |
| `xp-calculator.service.ts`    | lib/services/ | Cálculos XP con bonuses     | Calcular XP para assessment/feedback   |
| `level-calculator.service.ts` | lib/services/ | Determinar nivel por XP     | Verificar level-up después de XP award |
| `badge-criteria.service.ts`   | lib/services/ | Evaluar criterios de badges | Verificar desbloqueo de badges nuevos  |

### Nuevo Servicio Unificado

Se creará `lib/services/gamification.service.ts` como API de alto nivel:

```typescript
// lib/services/gamification.service.ts
export interface XpAwardParams {
  userId: string;
  amount: number;
  source: XpSource;
  sourceId?: string;
  applyStreakBonus?: boolean;
}

export type XpSource = 
  | 'assessment_phase_1'
  | 'assessment_phase_2' 
  | 'assessment_complete'
  | 'assessment_retake'
  | 'feedback_given'
  | 'feedback_received'
  | 'feedback_insights'
  | 'feedback_applied';

export async function awardXp(params: XpAwardParams): Promise<XpAwardResult>;
export async function checkAndUnlockBadges(userId: string): Promise<UnlockedBadge[]>;
export async function ensureGamificationRecord(userId: string): Promise<UserGamification>;
```

### Constantes de Recompensas

```typescript
// lib/constants/xp-rewards.ts
export const ASSESSMENT_XP = {
  PHASE_1: 100,
  PHASE_2: 150,
  COMPLETION_BONUS: 250,
  RETAKE: 200,
} as const;

export const FEEDBACK_XP = {
  GIVEN: 75,
  RECEIVED: 25,
  INSIGHTS_THRESHOLD: 50,
  APPLIED_SUGGESTIONS: 30,
} as const;
```

### Badges Nuevos

| Badge Key              | Nombre              | Tier   | Criterio                      | XP Bonus |
| ---------------------- | ------------------- | ------ | ----------------------------- | -------- |
| `explorer_interior`    | Explorador Interior | Bronze | Primer assessment completo    | 25       |
| `generous_mirror`      | Espejo Generoso     | Silver | 3+ feedbacks dados en 30 días | 75       |
| `active_listener`      | Escucha Activa      | Gold   | 10+ feedbacks recibidos       | 150      |
| `continuous_evolution` | Evolución Continua  | Silver | Retake tras recibir feedback  | 75       |

## Phase 1: Design Outputs

### Data Model Extensions

No se requieren cambios al schema Prisma. El modelo `UserGamification` existente soporta todas las operaciones necesarias. Los badges nuevos se agregan via seed data.

### API Contracts

**Assessment XP Awards**:
- `POST /api/gamification/award-assessment-xp` (vía Server Action)
- Input: `{ phase: 1|2|3, sessionId: string }`
- Output: `{ xpAwarded: number, totalXp: number, leveledUp: boolean, newLevel?: number, badge?: Badge }`

**Feedback XP Awards**:
- `POST /api/gamification/award-feedback-xp` (vía Server Action)
- Input: `{ type: 'given'|'received'|'insights'|'applied', requestId: string }`
- Output: `{ xpAwarded: number, totalXp: number, leveledUp: boolean, newLevel?: number, badge?: Badge }`

## Implementation Phases

### Phase 1: Setup & Shared Infrastructure (T001-T010)
- Crear `lib/constants/xp-rewards.ts`
- Crear `lib/services/gamification.service.ts`
- Extender `lib/types/gamification.types.ts`
- Crear `components/gamification/` con componentes reutilizables
- Agregar badges nuevos a seed data

### Phase 2: Assessment Gamification (T011-T025)
- Crear `assessment/_actions/award-assessment-xp.ts`
- Modificar `complete-phase.ts` para integrar XP
- Modificar `save-results-to-profile.ts` para badge "Explorador Interior"
- Crear `assessment/_components/xp-reward-preview.tsx`
- Modificar welcome-screen.tsx y phase-transition.tsx

### Phase 3: Feedback Gamification (T026-T040)
- Crear `feedback/_actions/award-feedback-xp.ts`
- Modificar `feedback-response.actions.ts` para XP al enviar
- Modificar `feedback-request.actions.ts` para XP al recibir
- Crear `feedback/_components/xp-incentive-banner.tsx`
- Modificar UI de feedback request/respond

### Phase 4: Integration & Polish (T041-T050)
- Integrar level-up notifications en ambos módulos
- Integrar badge unlock modals
- Testing E2E
- Documentación

## Constitution Check (Post-Design)

*Re-evaluation after Phase 1 design completion*

| Principle                       | Status | Post-Design Notes                                                                                  |
| ------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| I. Human-First Design           | ✅ PASS | XP rewards designed as positive reinforcement, not gates. Users can skip/dismiss notifications     |
| II. Positive Psychology         | ✅ PASS | Badge names reflect growth values: "Explorador", "Generoso", "Evolución Continua"                  |
| III. Feature-First Architecture | ✅ PASS | data-model.md confirms no schema changes; services in lib/ consumed by independent feature actions |
| IV. AI-Augmented Insights       | N/A    | No AI integration in this feature                                                                  |
| V. Type Safety                  | ✅ PASS | contracts/services.md defines all interfaces with explicit types                                   |

**Dependency Inversion Compliance (Post-Design)**:

| Artifact                | Compliance Check                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `data-model.md`         | ✅ Uses existing shared models (UserGamification, Badge), no feature-specific models   |
| `contracts/services.md` | ✅ All service APIs in lib/services/, feature actions consume via dependency inversion |
| `quickstart.md`         | ✅ Implementation follows lib/ → feature pattern with no cross-imports                 |
| `research.md`           | ✅ Decisions explicitly avoid cross-feature dependencies                               |

**Gate Status**: ✅ ALL GATES PASSED - Ready for Phase 2 (Tasks)

## Validation Checklist

✅ Technical Context completo
✅ Constitution Check pasado (initial)
✅ Constitution Check pasado (post-design)
✅ Arquitectura cumple Inversión de Dependencias
✅ No hay cross-feature imports
✅ Servicios compartidos en lib/
✅ Componentes compartidos en components/gamification/
✅ research.md completo - todos los NEEDS CLARIFICATION resueltos
✅ data-model.md completo - entidades y validaciones definidas
✅ contracts/services.md completo - APIs de servicios definidas
✅ quickstart.md completo - guía de implementación lista
✅ Agent context actualizado via update-agent-context.sh

**Ready for Phase 2 (Tasks Generation)**: ✅ YES
