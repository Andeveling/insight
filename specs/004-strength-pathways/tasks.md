# Tasks: Rutas de Desarrollo de Fortalezas (Gamificadas)

**Input**: Design documents from `/specs/004-strength-pathways/`
**Branch**: `004-strength-pathways`
**Generated**: 14 de diciembre de 2025

## Task Format

- **Checkbox**: `- [ ]` (markdown checkbox)
- **Task ID**: Sequential (T001, T002, T003...)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4, US5, US6)
- **Description**: Clear action with exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, database models, and shared utilities

**Independent Testing**: N/A - Foundational phase

### Database & Models

- [x] T001 Create Prisma migration for 6 new models in prisma/schema.prisma (DevelopmentModule, Challenge, UserProgress, UserGamification, Badge, CollaborativeChallenge)
- [x] T002 [P] Add User model relations in prisma/schema.prisma (progress, gamification)
- [x] T003 Run Prisma migration and apply to Turso database
- [x] T004 [P] Create seed data file prisma/data/development-modules.data.ts (15-20 modules)
- [x] T005 [P] Create seed data file prisma/data/challenges.data.ts (60-80 challenges)
- [x] T006 [P] Create seed data file prisma/data/badges.data.ts (10-15 badges)
- [x] T007 Update prisma/seed.ts to include new seed data

### Shared Types & Constants

- [x] T008 [P] Create lib/types/development.types.ts with DevelopmentModule, Challenge, ModuleLevel types
- [x] T009 [P] Create lib/types/gamification.types.ts with XP, Level, Badge types
- [x] T010 [P] Create lib/types/ai-coach.types.ts with Recommendation types
- [x] T011 [P] Create lib/constants/xp-levels.ts with level thresholds (Nivel 1: 0-500 XP, etc.)
- [x] T012 [P] Create lib/constants/badge-criteria.ts with badge unlock rules

### Shared Services

- [x] T013 [P] Create lib/services/xp-calculator.service.ts with calculateLevel, getNextLevelXp functions
- [x] T014 [P] Create lib/services/level-calculator.service.ts with level progression logic
- [x] T015 [P] Create lib/services/badge-rules.service.ts with badge unlock validation
- [x] T016 Create lib/services/ai-coach.service.ts with OpenAI integration for recommendations (depends on T010)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that all user stories depend on

**Independent Testing**: N/A - Required by all features

### Feature Structure

- [x] T017 Create app/dashboard/development directory structure
- [x] T018 [P] Create app/dashboard/development/layout.tsx with navigation
- [x] T019 [P] Create app/dashboard/development/loading.tsx skeleton
- [x] T020 [P] Create app/dashboard/development/error.tsx boundary

### Schemas & Validation

- [x] T021 [P] Create app/dashboard/development/_schemas/module.schema.ts with Zod validation
- [x] T022 [P] Create app/dashboard/development/_schemas/challenge.schema.ts with Zod validation
- [x] T023 [P] Create app/dashboard/development/_schemas/progress.schema.ts with Zod validation
- [x] T024 [P] Create app/dashboard/development/_schemas/ai-recommendation.schema.ts with Zod validation
- [x] T025 [P] Create app/dashboard/development/_schemas/index.ts barrel export

### Shared Components

- [x] T026 [P] Create app/dashboard/development/_components/xp-bar.tsx with Framer Motion progress animation
- [x] T027 [P] Create app/dashboard/development/_components/level-badge.tsx displaying current level
- [x] T028 [P] Create app/dashboard/development/_components/level-up-notification.tsx with Framer Motion scale animation
- [x] T029 [P] Create app/dashboard/development/_components/index.ts barrel export

---

## Phase 3: User Story 1 - Explorar y Comenzar un Módulo de Desarrollo (P1)

**Goal**: Usuarios pueden explorar módulos organizados por fortaleza y comenzar módulos.

**Independent Test**: Usuario navega a /dashboard/development, ve módulos categorizados, hace clic en "Comenzar Módulo" y ve contenido.

**Acceptance Criteria**:
- Usuario ve lista de módulos organizados por sus fortalezas principales con indicadores de nivel
- Usuario puede seleccionar módulo y ver descripción, duración, botón "Comenzar"
- Al comenzar, contenido Markdown se renderiza y progreso se marca como "en_progreso"

### Server Actions

- [x] T030 [US1] Create app/dashboard/development/_actions/get-modules.ts fetching modules filtered by user strengths
- [x] T031 [US1] Create app/dashboard/development/_actions/start-module.ts creating UserProgress record
- [x] T032 [US1] Create app/dashboard/development/_actions/get-module-detail.ts fetching single module with challenges
- [x] T033 [US1] Create app/dashboard/development/_actions/index.ts barrel export

### Components

- [x] T034 [P] [US1] Create app/dashboard/development/_components/module-card.tsx displaying module info with level badge
- [x] T035 [P] [US1] Create app/dashboard/development/_components/module-list.tsx grid of module cards
- [x] T036 [US1] Create app/dashboard/development/_components/challenge-list.tsx displaying challenges in module detail
- [x] T037 [US1] Create app/dashboard/development/_components/stats-overview.tsx showing total modules/challenges

### Pages

- [x] T038 [US1] Create app/dashboard/development/page.tsx with Suspense for module list (Cache Components pattern)
- [x] T039 [US1] Create app/dashboard/development/[moduleId]/page.tsx with Suspense for module detail and challenges

### Utils

- [x] T040 [P] [US1] Create app/dashboard/development/_utils/module-helpers.ts with filtering and sorting functions
- [x] T041 [P] [US1] Create app/dashboard/development/_utils/progress-formatter.ts with percentage calculations

---

## Phase 4: User Story 2 - Completar Desafíos y Ganar XP (P1)

**Goal**: Usuarios completan desafíos dentro de módulos y reciben XP inmediatamente.

**Independent Test**: Usuario marca desafío como completado, ve notificación "+X XP", y XP total se actualiza en barra de progreso.

**Acceptance Criteria**:
- Usuario ve desafío con título, descripción, tipo, XP que otorga
- Al completar, recibe notificación visual "+[X] XP ganados"
- XP total se actualiza en tiempo real
- Módulo se marca "completado" cuando todos los desafíos finalizan

### Server Actions

- [x] T042 [US2] Create app/dashboard/development/_actions/complete-challenge.ts awarding XP and updating UserProgress
- [x] T043 [US2] Create app/dashboard/development/_actions/check-module-completion.ts validating all challenges done
- [x] T044 [US2] Update app/dashboard/development/_actions/index.ts with new exports

### Components

- [x] T045 [P] [US2] Create app/dashboard/development/_components/challenge-card.tsx with completion checkbox
- [x] T046 [P] [US2] Create app/dashboard/development/_components/xp-gain-toast.tsx with Framer Motion slide animation

### Hooks

- [x] T047 [P] [US2] Create app/dashboard/development/_hooks/use-xp-tracker.ts for real-time XP updates
- [x] T048 [P] [US2] Create app/dashboard/development/_hooks/use-module-progress.ts tracking challenge completion
- [x] T049 [P] [US2] Create app/dashboard/development/_hooks/index.ts barrel export

### Integration

- [x] T050 [US2] Update app/dashboard/development/[moduleId]/page.tsx to use challenge completion actions and hooks
- [x] T051 [US2] Integrate xp-gain-toast into challenge-card.tsx for instant feedback

---

## Phase 5: User Story 3 - Visualizar Progreso y Barra de XP (P1)

**Goal**: Usuarios ven dashboard con XP total, nivel, progreso hacia siguiente nivel, y resumen de logros.

**Independent Test**: Usuario accede a dashboard, ve XP total, nivel actual, barra de progreso, módulos completados, y recibe notificación al subir de nivel.

**Acceptance Criteria**:
- Dashboard muestra XP total, nivel actual, barra hacia siguiente nivel
- Muestra estadísticas: módulos completados, desafíos finalizados, insignias
- Notificación "¡Subiste de nivel!" con animación cuando alcanza umbral

### Server Actions

- [x] T052 [US3] Create app/dashboard/development/_actions/get-user-progress.ts fetching UserGamification with all stats
- [x] T053 [US3] Create app/dashboard/development/_actions/check-level-up.ts detecting level increase
- [x] T054 [US3] Update app/dashboard/development/_actions/index.ts with new exports

### Components

- [x] T055 [P] [US3] Create app/dashboard/development/_components/progress-dashboard.tsx main dashboard with XP and level
- [x] T056 [P] [US3] Update app/dashboard/development/_components/stats-overview.tsx with full statistics (XP, modules, challenges)

### Pages

- [x] T057 [US3] Create app/dashboard/development/dashboard/page.tsx with Suspense for progress dashboard (Cache Components pattern)

### Integration

- [x] T058 [US3] Integrate check-level-up logic into complete-challenge.ts (T042) to trigger level-up notification
- [x] T059 [US3] Display level-up-notification.tsx (T028) when level increase detected

---

## Phase 6: User Story 4 - Desbloquear Insignias por Logros (P2)

**Goal**: Usuarios desbloquean insignias al completar hitos específicos y las ven en su perfil.

**Independent Test**: Usuario completa módulo/desafío que cumple criterio de insignia, recibe notificación, y ve insignia en perfil.

**Acceptance Criteria**:
- Usuario desbloquea insignia "Explorador" al completar módulo Principiante
- Usuario desbloquea insignia "Maestro" al completar módulo Avanzado
- Usuario gana XP bonus por desafíos colaborativos y avanza hacia insignia "Aliado"

### Server Actions

- [x] T060 [US4] Create app/dashboard/development/_actions/get-badges.ts fetching user's unlocked badges
- [x] T061 [US4] Create app/dashboard/development/_actions/check-badge-unlock.ts validating badge criteria after actions
- [x] T062 [US4] Update app/dashboard/development/_actions/index.ts with new exports

### Components

- [x] T063 [P] [US4] Create app/dashboard/development/_components/badge-showcase.tsx grid of unlocked/locked badges
- [x] T064 [P] [US4] Create app/dashboard/development/_components/badge-unlock-modal.tsx with Framer Motion rotate animation

### Hooks

- [x] T065 [P] [US4] Create app/dashboard/development/_hooks/use-badge-notifications.ts for badge unlock toasts
- [x] T066 [US4] Update app/dashboard/development/_hooks/index.ts with new export

### Pages

- [x] T067 [US4] Create app/dashboard/development/badges/page.tsx with Suspense for badge gallery (Cache Components pattern)

### Integration

- [x] T068 [US4] Integrate check-badge-unlock into complete-challenge.ts (T042) after XP award
- [x] T069 [US4] Integrate check-badge-unlock into check-module-completion.ts (T043) after module finalization
- [x] T070 [US4] Display badge-unlock-modal when new badge unlocked

---

## Phase 7: User Story 5 - Recomendaciones del AI Coach (P2)

**Goal**: AI Coach genera recomendaciones personalizadas basadas en progreso y fortalezas.

**Independent Test**: Usuario accede a dashboard, ve panel de recomendaciones con módulos sugeridos y explicaciones del AI Coach.

**Acceptance Criteria**:
- AI Coach sugiere módulos relacionados con fortalezas con bajo progreso
- AI Coach indica qué desafíos completar para desbloquear insignias cercanas
- AI Coach sugiere avanzar a siguiente nivel con mensaje motivacional

### Server Actions

- [x] T071 [US5] Create app/dashboard/development/_actions/get-ai-recommendations.ts using ai-coach.service.ts (T016)
- [x] T072 [US5] Implement caching logic in get-ai-recommendations.ts with UserRecommendation model (TTL 7 días)
- [x] T073 [US5] Update app/dashboard/development/_actions/index.ts with new exports

### Components

- [x] T074 [P] [US5] Create app/dashboard/development/_components/ai-recommendations.tsx panel displaying AI suggestions
- [x] T075 [US5] Update app/dashboard/development/_components/progress-dashboard.tsx (T055) to include AI recommendations panel

### Integration

- [x] T076 [US5] Integrate ai-recommendations into dashboard/page.tsx (T057) with Suspense boundary

---

## Phase 8: User Story 6 - Conectar con Otros Usuarios (Aprendizaje Peer) (P3)

**Goal**: Usuarios ven otros usuarios en la misma ruta de desarrollo y completan desafíos colaborativos juntos.

**Independent Test**: Usuario ve lista de "peer learners" en mismo módulo, completa desafío colaborativo con otro usuario, y ambos reciben XP bonus.

**Acceptance Criteria**:
- Usuario ve otros usuarios trabajando en la misma fortaleza en sección "Comunidad"
- Al completar desafío colaborativo, ambos usuarios reciben XP bonus
- Usuario puede ver progreso mutuo de peer learners

### Server Actions

- [X] T077 [US6] Create app/dashboard/development/_actions/get-peer-learners.ts fetching users with same strength in progress
- [X] T078 [US6] Create app/dashboard/development/_actions/complete-collaborative.ts handling dual confirmation and XP bonus
- [X] T079 [US6] Update app/dashboard/development/_actions/index.ts with new exports

### Components

- [X] T080 [P] [US6] Create app/dashboard/development/_components/peer-learners.tsx list of users in same path
- [X] T081 [P] [US6] Create app/dashboard/development/_components/collaborative-challenge.tsx UI for dual confirmation
- [X] T082 [US6] Update app/dashboard/development/_components/index.ts with new exports

### Integration

- [X] T083 [US6] Add "Comunidad" tab to app/dashboard/development/[moduleId]/page.tsx (T039) showing peer-learners
- [X] T084 [US6] Integrate collaborative-challenge component into challenge-card.tsx (T045) for collaboration-type challenges
- [X] T085 [US6] Handle collaborative completion flow with email/in-app notifications in complete-collaborative.ts (T078)

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final enhancements, responsive design, and production readiness

### Responsive Design

- [X] T086 [P] Ensure all pages in app/dashboard/development/ are mobile-responsive (Tailwind breakpoints)
- [X] T087 [P] Test all Framer Motion animations on mobile devices (performance target: 60fps)

### Error Handling

- [X] T088 [P] Add error boundaries to all pages in app/dashboard/development/
- [X] T089 [P] Add loading states to all async operations (Server Actions)
- [X] T090 [P] Add fallback UI for AI Coach recommendations when API fails

### Accessibility

- [X] T091 [P] Add ARIA labels to all interactive components (buttons, checkboxes, cards)
- [X] T092 [P] Ensure keyboard navigation works for module/challenge selection
- [X] T093 [P] Test screen reader compatibility for XP notifications and level-ups

### Performance

- [X] T094 Validate XP update response time <2s (load test with 500 concurrent users)
- [X] T095 Verify AI recommendation caching reduces OpenAI costs by 67%
- [X] T096 Profile animation performance to ensure <300ms duration

### Documentation

- [X] T097 [P] Update README.md with Development feature setup instructions
- [X] T098 [P] Document seed data structure in prisma/data/README.md
- [X] T099 [P] Create API documentation in specs/004-strength-pathways/contracts/

---

## Dependencies & Execution Order

### Critical Path (Must Complete in Order)

1. **Phase 1** (Setup) → **Phase 2** (Foundational) → **All User Story Phases can begin**
2. Within User Stories:
   - US1 (T030-T041) → US2 (T042-T051) → US3 (T052-T059) [Sequential - each builds on previous]
   - US4 (T060-T070) can start after US2 complete [Depends on XP system]
   - US5 (T071-T076) can start after US1 complete [Depends on module data]
   - US6 (T077-T085) can start after US2 complete [Depends on challenge completion]

### Parallel Execution Opportunities

**After Phase 1 & 2 Complete**:
- Team A: US1 (Modules exploration) → US2 (Challenges & XP) → US3 (Dashboard)
- Team B: US4 (Badges) - starts after US2
- Team C: US5 (AI Coach) - starts after US1
- Team D: US6 (Peer Learning) - starts after US2

**Phase 9 Polish**: Can run in parallel across all teams once core functionality works

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

**Include**:
- ✅ Phase 1: Setup (T001-T016)
- ✅ Phase 2: Foundational (T017-T029)
- ✅ Phase 3: User Story 1 - Module Exploration (T030-T041)
- ✅ Phase 4: User Story 2 - Challenges & XP (T042-T051)
- ✅ Phase 5: User Story 3 - Progress Dashboard (T052-T059)

**MVP Delivers**:
- Users can explore modules by strength
- Users can complete challenges and earn XP
- Users see progress and level up
- **Total Tasks**: T001-T059 (59 tasks)

**Defer to Phase 2**:
- 🔄 Phase 6: User Story 4 - Badges (T060-T070)
- 🔄 Phase 7: User Story 5 - AI Coach (T071-T076)
- 🔄 Phase 8: User Story 6 - Peer Learning (T077-T085)

### Incremental Delivery Plan

1. **Sprint 1** (Weeks 1-2): Phase 1 Setup + Phase 2 Foundational (T001-T029)
2. **Sprint 2** (Weeks 3-4): US1 Modules + US2 Challenges (T030-T051)
3. **Sprint 3** (Week 5): US3 Dashboard + MVP Testing (T052-T059)
4. **Sprint 4** (Week 6): US4 Badges (T060-T070)
5. **Sprint 5** (Week 7): US5 AI Coach + US6 Peer Learning (T071-T085)
6. **Sprint 6** (Week 8): Phase 9 Polish (T086-T099)

---

## Task Summary

- **Total Tasks**: 99
- **Setup Phase**: 16 tasks (T001-T016)
- **Foundational Phase**: 13 tasks (T017-T029)
- **User Story 1**: 12 tasks (T030-T041)
- **User Story 2**: 10 tasks (T042-T051)
- **User Story 3**: 8 tasks (T052-T059)
- **User Story 4**: 11 tasks (T060-T070)
- **User Story 5**: 6 tasks (T071-T076)
- **User Story 6**: 9 tasks (T077-T085)
- **Polish Phase**: 14 tasks (T086-T099)

**Parallelizable Tasks**: 45 tasks marked with [P]
**MVP Scope**: 59 tasks (T001-T059)
**Estimated Duration**: 6-8 weeks (6 sprints)

---

## Validation Checklist

✅ All tasks follow checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
✅ Tasks organized by user story for independent implementation
✅ Each user story phase includes clear goal and acceptance criteria
✅ Dependencies documented in execution order section
✅ Parallel execution opportunities identified
✅ MVP scope defined (US1 + US2 + US3)
✅ File paths follow Next.js 16 feature-first architecture
✅ All 6 user stories from spec.md mapped to task phases
✅ Phase 9 includes polish and cross-cutting concerns
✅ Total task count and breakdown provided

**Ready for Implementation**: ✅ YES
