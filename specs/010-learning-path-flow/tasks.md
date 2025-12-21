# Tasks: Learning Path Flow

**Input**: Design documents from `/specs/010-learning-path-flow/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: No se solicitaron tests automatizados. Validación manual según quickstart.md.

**Organization**: Tasks organizados por user story para implementación y testing independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[Story]**: User story al que pertenece (US1, US2, US3, US4)
- Paths exactos incluidos en descripciones

---

## Phase 1: Setup (Infrastructure Compartida)

**Purpose**: Estructura base, tipos y utilidades que todas las user stories necesitan

- [x] T001 Crear `app/dashboard/development/_schemas/roadmap.schema.ts` con tipos NodeStatus, ModuleNodeData, SectionNodeData, LayoutConfig, RoadmapNode, RoadmapEdge
- [x] T002 [P] Crear `app/dashboard/development/_schemas/index.ts` con barrel export de roadmap schemas
- [x] T003 [P] Crear `app/dashboard/development/_utils/layout-calculator.ts` con función `calculateSerpentinePosition` y `generateNodesFromModules` (ajustado para nodos compactos 100x100)
- [x] T004 [P] Crear `app/dashboard/development/_utils/node-status-mapper.ts` con función `mapModuleToNodeStatus` y `moduleCardToNodeData`
- [x] T005 Crear `app/dashboard/development/_utils/index.ts` con barrel export de layout-calculator y node-status-mapper

**Checkpoint**: ✅ Tipos base y utilidades listas - Phase 2 puede comenzar

---

## Phase 2: Foundational (Prerrequisitos Bloqueantes)

**Purpose**: Hook core que DEBE estar completo antes de cualquier user story

**⚠️ CRITICAL**: No se puede comenzar trabajo de user stories hasta completar esta fase

- [x] T006 Crear `app/dashboard/development/_hooks/use-roadmap-layout.ts` que transforma ModuleCard[] → { nodes: RoadmapNode[], edges: RoadmapEdge[] } usando layout-calculator
- [x] T007 [P] Crear `app/dashboard/development/_hooks/index.ts` con barrel export de use-roadmap-layout

**Checkpoint**: ✅ Foundation ready - implementación de user stories puede comenzar

---

## Phase 3: User Story 1 - Visualizar Roadmap de Desarrollo (Priority: P1) 🎯 MVP

**Goal**: Transformar `/dashboard/development` de lista plana a canvas interactivo con nodos conectados mostrando estados visuales

**Independent Test**: Cargar `/dashboard/development` y verificar que módulos se muestran como nodos conectados en flujo visual serpentino con estados (verde/amarillo/gris) en lugar de grilla de tarjetas

### Implementation for User Story 1

- [x] T008 [P] [US1] Crear `app/dashboard/development/_components/module-node.tsx` con custom node compacto (circular/hex) que muestra icono y estado visual (sin tarjetas grandes)
- [x] T009 [P] [US1] Crear `app/dashboard/development/_components/module-edge.tsx` con edge animado usando motion para dash animation
- [x] T010 [US1] Crear `app/dashboard/development/_components/learning-path-flow.tsx` como wrapper principal de ReactFlow con nodeTypes={module: ModuleNode} y edgeTypes={animated: ModuleEdge}
- [x] T011 [P] [US1] Crear `app/dashboard/development/_components/roadmap-controls.tsx` con botones zoom in, zoom out, fitView usando ReactFlow hooks
- [x] T012 [US1] Actualizar `app/dashboard/development/_components/index.ts` agregando exports de LearningPathFlow, ModuleNode, ModuleEdge, RoadmapControls
- [x] T013 [US1] Integrar `LearningPathFlow` en `app/dashboard/development/page.tsx` usando Suspense y reemplazando ModuleList temporalmente para testing

**Checkpoint**: ✅ User Story 1 funcional - módulos visibles como nodos conectados con zoom/pan/estados

---

## Phase 4: User Story 2 - Interactuar con Nodos de Módulos (Priority: P1)

**Goal**: Click en nodos abre panel con detalles y acciones disponibles; hover muestra tooltip con info resumida

**Independent Test**: Click en nodo del roadmap abre Sheet lateral con título, descripción, XP, duración y botón Comenzar/Continuar que navega al módulo

### Implementation for User Story 2

- [x] T014 [US2] Crear `app/dashboard/development/_hooks/use-node-interactions.ts` con state selectedNodeId/hoveredNodeId y handlers handleNodeClick/handleNodeMouseEnter/handleNodeMouseLeave
- [x] T015 [US2] Actualizar `app/dashboard/development/_hooks/index.ts` agregando export de use-node-interactions
- [x] T016 [US2] Crear `app/dashboard/development/_components/module-preview-panel.tsx` usando Sheet de shadcn con props module/open/onClose mostrando detalles y botón de acción
- [x] T017 [US2] Agregar HoverCard o Tooltip a `module-node.tsx` mostrando nombre, XP y estado al hover
- [x] T018 [US2] Integrar `useNodeInteractions` en `learning-path-flow.tsx` pasando onNodeClick y onNodeMouseEnter/Leave a ReactFlow
- [x] T019 [US2] Integrar `ModulePreviewPanel` en `learning-path-flow.tsx` controlado por selectedNodeId del hook
- [x] T020 [US2] Actualizar `app/dashboard/development/_components/index.ts` agregando export de ModulePreviewPanel

**Checkpoint**: ✅ User Stories 1 Y 2 funcionan - nodos con estados clickeables que abren panel de detalles

---

## Phase 5: User Story 3 - Visualizar Progreso General y Secciones (Priority: P2)

**Goal**: Módulos agrupados por nivel/dominio con separadores visuales y progreso "X/Y completados" por sección

**Independent Test**: Verificar que roadmap muestra nodos de sección entre grupos de módulos con indicadores "2/5 completados" y click en sección hace zoom

### Implementation for User Story 3

- [x] T021 [US3] Crear `app/dashboard/development/_utils/section-grouper.ts` con función `groupModulesBySection` que retorna Map<sectionId, {modules, progress}>
- [x] T022 [US3] Actualizar `app/dashboard/development/_utils/index.ts` agregando export de section-grouper
- [x] T023 [US3] Crear `app/dashboard/development/_components/section-node.tsx` con custom node para headers de sección mostrando título y progreso X/Y
- [x] T024 [US3] Actualizar `use-roadmap-layout.ts` para insertar SectionNode entre grupos usando section-grouper y recalcular posiciones Y con sectionSpacing
- [x] T025 [US3] Registrar `section: SectionNode` en nodeTypes de `learning-path-flow.tsx`
- [x] T026 [US3] Agregar onClick en section-node.tsx que usa fitBounds de ReactFlow para hacer zoom a la sección
- [x] T027 [US3] Actualizar `app/dashboard/development/_components/index.ts` agregando export de SectionNode

**Checkpoint**: ✅ User Stories 1, 2 Y 3 funcionan - roadmap organizado por secciones con progreso visible

---

## Phase 6: User Story 4 - Modo Compacto vs Expandido (Priority: P3)

**Goal**: Toggle para alternar entre vista Roadmap (flujo visual) y Lista (grilla de tarjetas) con persistencia en localStorage

**Independent Test**: Click en toggle alterna entre vistas y al recargar página la preferencia se mantiene

### Implementation for User Story 4

- [x] T028 [US4] Crear `app/dashboard/development/_hooks/use-view-preference.ts` con state view y setView que persiste en localStorage key 'development-view-preference'
- [x] T029 [US4] Actualizar `app/dashboard/development/_hooks/index.ts` agregando export de use-view-preference
- [x] T030 [US4] Crear `app/dashboard/development/_components/view-toggle.tsx` con ToggleGroup de shadcn mostrando iconos 🗺️ Roadmap y 📋 Lista
- [x] T031 [US4] Integrar `useViewPreference` en `modules-roadmap-section.tsx` obteniendo view actual
- [x] T032 [US4] Agregar `ViewToggle` al header de módulos en modules-roadmap-section.tsx
- [x] T033 [US4] Implementar renderizado condicional: view === 'roadmap' ? <LearningPathFlow /> : <ModuleList /> en modules-roadmap-section.tsx
- [x] T034 [US4] Actualizar `app/dashboard/development/_components/index.ts` agregando export de ViewToggle

**Checkpoint**: ✅ Todas las user stories funcionales - toggle completo con persistencia

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras de UX, animaciones, mobile y performance que afectan múltiples user stories

- [x] T035 [P] Agregar motion animations de entrada con stagger a module-node.tsx (scale 0.8→1, opacity 0→1)
- [x] T036 [P] Agregar pulse animation a nodos completed y glow effect a nodos in_progress en module-node.tsx
- [x] T037 [P] Agregar shake animation al click en nodo locked en module-node.tsx
- [x] T038 [P] Agregar dash animation más fluida y gradient effect a module-edge.tsx
- [x] T039 Agregar empty state en learning-path-flow.tsx cuando modules.length === 0 con mensaje motivacional
- [x] T040 Optimizar performance con memo() en ModuleNode/SectionNode y useMemo para nodes/edges arrays
- [ ] T041 [P] Crear `app/dashboard/development/_components/roadmap-minimap.tsx` opcional usando MiniMap de ReactFlow
- [x] T042 Ajustar estilos responsive en learning-path-flow.tsx para móvil (viewport < 768px → nodesPerRow=2, nodeWidth ajustado a 80px)
- [x] T043 Verificar TypeScript compilation con `bunx tsc --noEmit` sin errores
- [x] T044 Verificar ESLint con `bun run lint` sin errores nuevos
- [x] T045 Verificar build production con `bun run build` exitoso
- [ ] T046 Testing manual siguiendo quickstart.md validando todos los acceptance scenarios de spec.md

**Checkpoint**: ✅ Feature 010 completo - Learning Path Flow implementado con todas las user stories

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKS all user stories
    ↓
┌───────────────────────────────────────────┐
│  US1 (P1) → US2 (P1) → US3 (P2)          │
│      ↓         ↓                          │
│      └─────────┴──→ US4 (P3) can start   │
│                      after US1 or in      │
│                      parallel with US2/3  │
└───────────────────────────────────────────┘
    ↓
Phase 7 (Polish) ← After desired stories complete
```

### User Story Dependencies

| Story | Priority | Depends On | Can Start With |
|-------|----------|------------|----------------|
| US1 - Roadmap Visual | P1 | Phase 2 | — |
| US2 - Interactividad | P1 | US1 (nodos base) | Final de US1 |
| US3 - Secciones | P2 | US1 (layout base) | US2 |
| US4 - View Toggle | P3 | Phase 2 | US2, US3 |

### Within Each Phase

1. Schemas/tipos primero (T001)
2. Barrel exports después de nuevos archivos
3. Hooks antes de componentes que los usan
4. Componentes core antes de integración en page.tsx

### Parallel Opportunities per Phase

```bash
# Phase 1 - Después de T001:
T002, T003, T004 pueden ejecutarse en paralelo (archivos distintos)

# Phase 3 (US1) - Componentes independientes:
T008 [module-node.tsx] || T009 [module-edge.tsx] || T011 [roadmap-controls.tsx]

# Phase 7 - Animaciones independientes:
T035, T036, T037, T038, T041 pueden ejecutarse en paralelo
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup (T001-T005)
2. ✅ Complete Phase 2: Foundational (T006-T007)
3. ✅ Complete Phase 3: User Story 1 (T008-T013)
4. **STOP and VALIDATE**: Roadmap visible con nodos y estados
5. Deploy/demo si está listo para feedback

### Incremental Delivery

| Increment | Tasks | Delivers |
|-----------|-------|----------|
| Foundation | T001-T007 | Tipos, utils, hooks base |
| MVP | T008-T013 | Canvas visual con nodos (**🎯 MVP**) |
| Interactivity | T014-T020 | Click → panel, hover → tooltip |
| Sections | T021-T027 | Agrupación con progreso |
| Toggle | T028-T034 | Switch Roadmap/Lista |
| Polish | T035-T046 | Animaciones, mobile, QA |

### Single Developer Strategy (Recomendado)

1. Phase 1 + 2 → Foundation completa
2. US1 completo (T008-T013) → **Validate MVP**
3. US2 completo (T014-T020) → Validate interactivity
4. US3 completo (T021-T027) → Validate sections
5. US4 completo (T028-T034) → Validate toggle
6. Polish (T035-T046) → Final QA

---

## Progress Tracking

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| 1. Setup | T001-T005 | 0/5 | ⬜ Not Started |
| 2. Foundational | T006-T007 | 0/2 | ⬜ Not Started |
| 3. US1 - Roadmap Visual | T008-T013 | 0/6 | ⬜ Not Started |
| 4. US2 - Interactividad | T014-T020 | 0/7 | ⬜ Not Started |
| 5. US3 - Secciones | T021-T027 | 0/7 | ⬜ Not Started |
| 6. US4 - View Toggle | T028-T034 | 0/7 | ⬜ Not Started |
| 7. Polish | T035-T046 | 0/12 | ⬜ Not Started |
| **TOTAL** | **T001-T046** | **0/46** | **0%** |

---

## Notes

- `[P]` = puede ejecutarse en paralelo (archivos distintos, sin dependencias entre sí)
- `[Story]` = mapea task a user story específica para trazabilidad
- Cada user story debe ser completable y testeable de forma independiente
- Hacer commit después de cada task o grupo lógico completado
- Detenerse en cualquier checkpoint para validar story de forma independiente
- Evitar: tasks vagos, conflictos en mismo archivo, dependencias cross-story que rompan independencia
