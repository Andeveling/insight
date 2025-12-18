# Tasks: Contextual Reports System

**Input**: Design documents from `/specs/009-contextual-reports/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No se requieren tests automatizados para este feature (no especificados).

**Organization**: Tareas agrupadas por user story para implementación independiente.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos diferentes, sin dependencias)
- **[Story]**: A qué user story pertenece (US1, US2, US3, US4, US5)
- Rutas exactas incluidas en descripciones

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización de constantes, schemas y utilidades base

- [X] T001 Create threshold constants file in `lib/constants/report-thresholds.ts`
- [X] T002 [P] Copy Zod schemas from contracts to `app/dashboard/reports/_schemas/readiness.schema.ts`
- [X] T003 [P] Update barrel export in `app/dashboard/reports/_schemas/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Calculador de readiness - requerido antes de cualquier user story

**⚠️ CRITICAL**: Las user stories dependen de estas funciones de cálculo

- [X] T004 Create readiness calculator with score calculation in `app/dashboard/reports/_lib/readiness-calculator.ts`
- [X] T005 Add `buildRequirements()` function to build requirements list in `app/dashboard/reports/_lib/readiness-calculator.ts`
- [X] T006 Add `isIndividualReady()` and `calculateTeamScore()` helper functions in `app/dashboard/reports/_lib/readiness-calculator.ts`

**Checkpoint**: Readiness calculator ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Ver Estado de Readiness Individual (Priority: P1) 🎯 MVP

**Goal**: Usuario puede ver dashboard de readiness con indicadores de progreso en `/dashboard/reports/individual`

**Independent Test**: Navegar a `/dashboard/reports/individual` y ver tarjeta de readiness con % y requisitos

### Implementation for User Story 1

- [X] T007 [US1] Create server action `get-individual-readiness.ts` in `app/dashboard/reports/_actions/`
- [X] T008 [US1] Update barrel export in `app/dashboard/reports/_actions/index.ts` with new action
- [X] T009 [P] [US1] Create `ReadinessRequirement` component in `app/dashboard/reports/_components/readiness-requirement.tsx`
- [X] T010 [P] [US1] Create circular progress component for score in `app/dashboard/reports/_components/circular-progress.tsx`
- [X] T011 [US1] Create `ReadinessDashboard` component combining progress + requirements in `app/dashboard/reports/_components/readiness-dashboard.tsx`
- [X] T012 [US1] Update barrel export in `app/dashboard/reports/_components/index.ts` with new components
- [X] T013 [US1] Refactor `app/dashboard/reports/individual/page.tsx` to show readiness gate before report

**Checkpoint**: User Story 1 complete - users can see individual readiness status

---

## Phase 4: User Story 2 - Generar Reporte Individual Contextualizado (Priority: P1) 🎯 MVP

**Goal**: Usuario que cumple requisitos puede generar reporte enriquecido con datos de desarrollo

**Independent Test**: Usuario con ≥3 módulos, ≥100 XP, ≥5 challenges genera reporte con sección "Progreso Demostrado"

### Implementation for User Story 2

- [X] T014 [US2] Create `buildDevelopmentContext()` function in `app/dashboard/reports/_lib/development-context-builder.ts`
- [X] T015 [US2] Add development context section to prompts in `app/dashboard/reports/_lib/ai-prompts.ts`
- [X] T016 [US2] Modify `generate-individual-report.action.ts` to check readiness before generation
- [X] T017 [US2] Modify `generate-individual-report.action.ts` to include development context in prompt
- [X] T018 [US2] Update report metadata with v2 schema marker in `generate-individual-report.action.ts`
- [X] T019 [US2] Add XP reward on first contextual report generation in `generate-individual-report.action.ts`
- [ ] T020 [US2] Add badge unlock check after successful generation in `generate-individual-report.action.ts`

**Checkpoint**: User Story 2 complete - contextual individual reports can be generated

---

## Phase 5: User Story 3 - Ver Estado de Readiness de Equipo (Priority: P2)

**Goal**: Líder de equipo puede ver % de miembros listos y quiénes necesitan más actividad

**Independent Test**: Navegar a `/dashboard/reports/team` y ver breakdown de miembros con % de readiness

### Implementation for User Story 3

- [ ] T021 [US3] Create server action `get-team-readiness.ts` in `app/dashboard/reports/_actions/`
- [ ] T022 [US3] Update barrel export in `app/dashboard/reports/_actions/index.ts` with team action
- [ ] T023 [P] [US3] Create `TeamMemberReadiness` component in `app/dashboard/reports/_components/team-member-readiness.tsx`
- [ ] T024 [US3] Create `TeamReadinessDashboard` component in `app/dashboard/reports/_components/team-readiness-dashboard.tsx`
- [ ] T025 [US3] Update barrel export in `app/dashboard/reports/_components/index.ts` with team components
- [ ] T026 [US3] Refactor `app/dashboard/reports/team/page.tsx` to show team readiness gate before report

**Checkpoint**: User Story 3 complete - team leads can see member readiness breakdown

---

## Phase 6: User Story 4 - Generar Reporte de Equipo Contextualizado (Priority: P2)

**Goal**: Líder puede generar reporte de equipo con patrones de desarrollo y brechas

**Independent Test**: Equipo con ≥60% miembros listos genera reporte con sección "Patrones de Desarrollo"

### Implementation for User Story 4

- [ ] T027 [US4] Create `buildTeamDevelopmentContext()` function in `app/dashboard/reports/_lib/development-context-builder.ts`
- [ ] T028 [US4] Add team development context section to prompts in `app/dashboard/reports/_lib/ai-prompts.ts`
- [ ] T029 [US4] Modify `generate-team-report.action.ts` to check team readiness before generation
- [ ] T030 [US4] Modify `generate-team-report.action.ts` to include team development context in prompt
- [ ] T031 [US4] Update team report metadata with v2 schema marker
- [ ] T032 [US4] Add XP rewards for team report (generator + contributors) in `generate-team-report.action.ts`
- [ ] T033 [US4] Add team badge unlock check after successful generation

**Checkpoint**: User Story 4 complete - contextual team reports can be generated

---

## Phase 7: User Story 5 - Dashboard de Reports Unificado (Priority: P3)

**Goal**: Usuario ve estado de todos sus reportes (individual + equipos) en un solo lugar

**Independent Test**: Navegar a `/dashboard/reports` y ver tarjetas con mini-indicadores de readiness

### Implementation for User Story 5

- [ ] T034 [P] [US5] Create `ReportReadinessCard` component in `app/dashboard/reports/_components/report-readiness-card.tsx`
- [ ] T035 [US5] Update barrel export in `app/dashboard/reports/_components/index.ts`
- [ ] T036 [US5] Refactor `app/dashboard/reports/page.tsx` to fetch readiness for all available reports
- [ ] T037 [US5] Display individual report card with readiness indicator in `app/dashboard/reports/page.tsx`
- [ ] T038 [US5] Display team report cards with readiness indicators (one per team) in `app/dashboard/reports/page.tsx`
- [ ] T039 [US5] Add "¡Listo!" animated badge for 100% readiness cards

**Checkpoint**: User Story 5 complete - unified dashboard shows all report readiness

---

## Phase 8: Gamification Integration

**Purpose**: Agregar badges de seed data y verificar integración de XP

- [ ] T040 [P] Add `INSIGHT_INDIVIDUAL` badge to `prisma/data/badges.data.ts`
- [ ] T041 [P] Add `INSIGHT_TEAM` badge to `prisma/data/badges.data.ts`
- [ ] T042 Run `bunx prisma db seed` to insert new badges
- [ ] T043 Verify XP award integration works with existing `awardXP()` service

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Animaciones, UX final, validaciones

- [ ] T044 [P] Add celebration animation when readiness reaches 100% in `readiness-dashboard.tsx`
- [ ] T045 [P] Add pulse effect on "Generar Reporte" button when ready
- [ ] T046 Verify all TypeScript types compile without errors (`bun run typecheck`)
- [ ] T047 Verify ESLint passes (`bun run lint`)
- [ ] T048 Manual QA: Test complete flow from 0% readiness to report generation
- [ ] T049 Manual QA: Test team readiness flow with multiple members

---

## Dependencies Graph

```
T001 (thresholds) ─────────────────────────────────────────────┐
T002 (schemas) ─────────────────────────────────────────────────┤
T003 (barrel export) ───────────────────────────────────────────┤
                                                                 │
                                                                 v
T004-T006 (readiness calculator) ──────────────────────────────────┐
                                                                    │
           ┌────────────────────────────────────────────────────────┤
           │                                                        │
           v                                                        v
┌──────────────────────────┐                          ┌──────────────────────────┐
│ US1: Individual Readiness│                          │ US3: Team Readiness      │
│ T007-T013                │                          │ T021-T026                │
└──────────────────────────┘                          └──────────────────────────┘
           │                                                        │
           v                                                        v
┌──────────────────────────┐                          ┌──────────────────────────┐
│ US2: Individual Report   │                          │ US4: Team Report         │
│ T014-T020                │                          │ T027-T033                │
└──────────────────────────┘                          └──────────────────────────┘
           │                                                        │
           └────────────────────────┬───────────────────────────────┘
                                    │
                                    v
                        ┌──────────────────────────┐
                        │ US5: Unified Dashboard   │
                        │ T034-T039                │
                        └──────────────────────────┘
                                    │
                                    v
                        ┌──────────────────────────┐
                        │ Gamification + Polish    │
                        │ T040-T049                │
                        └──────────────────────────┘
```

---

## Parallel Execution Opportunities

### Can run in parallel (no dependencies between them):

**Setup phase**:
- T002, T003 (after T001)

**US1 components**:
- T009, T010 (no dependencies between them)

**US3 + US1** (can overlap):
- T021-T026 can start once T004-T006 are done, even if US1 is in progress

**Gamification**:
- T040, T041 (independent badge additions)

**Polish**:
- T044, T045 (different files)

---

## Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Setup | T001-T003 | 30 min |
| Foundational | T004-T006 | 1 hour |
| US1: Individual Readiness | T007-T013 | 2 hours |
| US2: Individual Report | T014-T020 | 2 hours |
| US3: Team Readiness | T021-T026 | 1.5 hours |
| US4: Team Report | T027-T033 | 1.5 hours |
| US5: Unified Dashboard | T034-T039 | 1.5 hours |
| Gamification | T040-T043 | 30 min |
| Polish | T044-T049 | 1.5 hours |
| **Total** | **49 tasks** | **~12 hours** |

---

## MVP Scope (Recommended)

Para un MVP funcional, implementar solo:

1. **Phase 1**: Setup (T001-T003)
2. **Phase 2**: Foundational (T004-T006)
3. **Phase 3**: US1 - Individual Readiness (T007-T013)
4. **Phase 4**: US2 - Individual Report (T014-T020)

**MVP Total**: 20 tasks, ~5.5 hours

Esto entrega valor inmediato: usuarios ven readiness y generan reportes contextualizados individuales. Team features (US3-US4) y dashboard unificado (US5) pueden agregarse después.
