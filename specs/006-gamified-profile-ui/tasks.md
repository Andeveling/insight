---

description: "Task list for 006-gamified-profile-ui implementation"

---

# Tasks: 006 Gamified UI Refresh (Profile + Theme)

**Input**: Design documents from `/specs/006-gamified-profile-ui/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: No tests fueron solicitados explícitamente en el spec. Se incluyen validaciones manuales + quality gates (`bun run lint`, `bun run build`).

## Formato (obligatorio)

Cada tarea sigue estrictamente:

- [ ] `[TaskID] [P?] [Story?] Descripción con ruta de archivo`

Donde:
- **[P]** = paralelizable (archivos distintos, sin dependencia directa)
- **[Story]** = `[US1]`, `[US2]`, `[US3]`, `[US4]` (solo en fases de historias)

## Phase 1: Setup (Shared)

**Goal**: asegurar que el entorno y la feature están listas para implementar.

- [X] T001 Verificar prerequisitos y entorno local (Bun/ENV) según `docs/ENVIRONMENTS.md`
- [X] T002 Confirmar que `specs/006-gamified-profile-ui/spec.md` contiene clarificaciones finales (XP por nivel, 3 logros, CTA, sin next goal)

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: preparar infraestructura mínima que bloquea a todas las historias (tokens + tipos + acciones + shell + Suspense).

- [X] T003 Definir tokens CSS "gamified" (light/dark) en `app/globals.css`
- [X] T004 [P] Crear type `ProfileGamificationProgress` en `lib/types/profile-gamification-progress.types.ts`
- [X] T005 [P] Crear type `ProfileAchievement` en `lib/types/profile-achievement.types.ts`
- [X] T006 [P] Crear type `ProfileAchievementsSummary` en `lib/types/profile-achievements-summary.types.ts`
- [X] T007 Implementar server action `getProfileGamificationProgress` en `app/dashboard/profile/_actions/get-profile-gamification-progress.action.ts`
- [X] T008 Implementar server action `getProfileAchievementsSummary` (default limit=3) en `app/dashboard/profile/_actions/get-profile-achievements-summary.action.ts`
- [X] T009 Exportar nuevas actions en `app/dashboard/profile/_actions/index.ts`
- [X] T010 [P] Crear skeleton reutilizable del Profile en `app/dashboard/profile/_components/profile-page-skeleton.tsx`
- [X] T011 Refactorizar `app/dashboard/profile/page.tsx` a patrón "shell + <Suspense>" y mover runtime data a un componente interno (p.ej. `ProfilePageContent`)
- [X] T012 Exportar skeleton (y futuros bloques) en `app/dashboard/profile/_components/index.ts`
- [X] T013 (Opcional por UX) Crear `app/dashboard/profile/loading.tsx` usando `profile-page-skeleton.tsx` como fallback del segmento

**Checkpoint**: al finalizar Phase 2, el Profile debe renderizar shell + skeleton sin romper, y las actions deben compilar.

---

## Phase 3: User Story 1 — Header gamificado con progreso (Priority: P1) 🎯 MVP

**Goal**: header llamativo con identidad + progreso (nivel/XP/racha) + conteo de recompensas.

**Independent Test**: abrir `Dashboard → Profile` y ver en <10s: nombre/email, nivel, `currentLevelXp / nextLevelXpRequired` + barra, racha y conteo de recompensas (o estado "no disponible" sin crash).

- [X] T014 [P] [US1] Crear componente `ProfileGamifiedHeader` en `app/dashboard/profile/_components/profile-gamified-header.tsx`
- [X] T015 [US1] Integrar `ProfileGamifiedHeader` en el contenido dinámico del Profile (`app/dashboard/profile/page.tsx`) usando `getProfileGamificationProgress` y `getProfileAchievementsSummary`
- [X] T016 [P] [US1] Asegurar accesibilidad del header (labels, orden de lectura, foco visible) en `app/dashboard/profile/_components/profile-gamified-header.tsx`

---

## Phase 4: User Story 2 — Fortalezas y DNA con UI más atractiva (Priority: P1)

**Goal**: fortalezas y DNA con jerarquía clara y estilo gamificado consistente (sin hardcode de colores).

**Independent Test**: con usuario con fortalezas: identificar top fortalezas y leer descripciones sin fricción; con DNA: ver tarjeta destacada; sin DNA: ver alternativa informativa sin errores.

- [X] T017 [US2] Refactorizar estilos/layout de fortalezas en `app/dashboard/profile/_components/user-strength-profile.tsx` (tokens semánticos + look gamificado)
- [X] T018 [US2] Refactorizar estilos/layout de DNA en `app/dashboard/profile/_components/user-dna-card.tsx` (tokens semánticos + look gamificado)
- [X] T019 [P] [US2] Ajustar copy de empty states (tono positivo, español) en `app/dashboard/profile/_components/user-strength-profile.tsx`

---

## Phase 5: User Story 3 — Bloque de logros/recompensas (Priority: P2)

**Goal**: mostrar 3 logros recientes (o empty state motivacional) y permitir ir a "Ver todo".

**Independent Test**: con usuario con badges: ver 3 recientes; sin badges: ver empty state; CTA "Ver todo" navega a `/dashboard/development/badges`.

- [X] T020 [P] [US3] Crear componente `ProfileAchievementsCard` en `app/dashboard/profile/_components/profile-achievements-card.tsx`
- [X] T021 [US3] Integrar `ProfileAchievementsCard` en `app/dashboard/profile/page.tsx` usando `getProfileAchievementsSummary`
- [X] T022 [P] [US3] Validar y ajustar navegación del CTA a `/dashboard/development/badges` en `app/dashboard/profile/_components/profile-achievements-card.tsx`
- [X] T023 [US3] Confirmar que no hay consumidor cliente y documentar decisión de NO crear endpoint en `specs/006-gamified-profile-ui/plan.md` (si aparece un consumidor cliente, implementar `app/api/gamification/achievements/route.ts` siguiendo `specs/006-gamified-profile-ui/contracts/openapi.yaml`)

---

## Phase 6: User Story 4 — Mantener edición de perfil con estilo gamificado (Priority: P3)

**Goal**: edición sigue funcionando (validación, guardado) con apariencia consistente.

**Independent Test**: editar datos válidos → guardar y ver reflejado; editar inválidos → mensajes claros, sin perder input.

- [X] T024 [US4] Refactorizar estilos de edición en `app/dashboard/profile/_components/edit-profile-card.tsx` para alinearlo al theme gamificado (tokens, sin hardcode)
- [X] T025 [US4] Revisar validación y mensajes de error (UX) en `app/dashboard/profile/_actions/update-profile.action.ts`
- [X] T026 [P] [US4] Ajustar responsive del panel de edición (mobile/desktop sin overflow) en `app/dashboard/profile/_components/edit-profile-card.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: coherencia visual, accesibilidad, y verificación final.

- [ ] T027 [P] Auditar que no se introducen clases de color hardcodeadas en archivos tocados (`app/globals.css`, `app/dashboard/profile/_components/*.tsx`)
- [ ] T028 [P] Revisar contraste y focus-visible en light/dark para Profile (archivos de `app/dashboard/profile/_components/*.tsx`)
- [ ] T029 Ejecutar lint y corregir hallazgos: `package.json` (`bun run lint`)
- [ ] T030 Ejecutar build y corregir fallos: `package.json` (`bun run build`)
- [ ] T031 Ejecutar verificación manual completa según `specs/006-gamified-profile-ui/quickstart.md`

---

## Dependencies & Execution Order

### User story completion order (dependency graph)

- Phase 1 → Phase 2 bloquea todo.
- Tras Phase 2:
  - **US1** y **US2** (ambas P1) pueden avanzar en paralelo.
  - **US3** (P2) puede avanzar en paralelo con US2 (y con US1 salvo el conteo, que ya viene de Phase 2).
  - **US4** (P3) puede avanzar en paralelo (toca principalmente `edit-profile-card.tsx`).

Representación:

- Setup → Foundational → { US1, US2, US3, US4 } → Polish

### Parallel execution examples

- **US1**:
  - En paralelo: T014 (componente) + T016 (a11y) mientras T015 integra.
- **US2**:
  - En paralelo: T017 (strengths) + T018 (DNA) + T019 (copy).
- **US3**:
  - En paralelo: T020 (componente) + T022 (CTA/link) mientras T021 integra.
- **US4**:
  - En paralelo: T024 (estilos) + T026 (responsive) mientras T025 revisa UX/validación.

## Implementation Strategy

### MVP (recomendado)

1. Phase 1 + Phase 2
2. US1 (header gamificado) ✅
3. Validar con `quickstart.md`

### Incremental delivery

- MVP: US1
- Iteración 2: US2
- Iteración 3: US3
- Iteración 4: US4

## Notes

- Mantener **feature-first**: todo lo específico del Profile en `app/dashboard/profile/_actions|_components|_schemas`.
- Evitar nuevos colores hardcodeados; preferir tokens/semánticos + `var(--gamified-*)`.
- “Ver todo” de logros reusa `/dashboard/development/badges` (no se crea una nueva vista en esta feature).
