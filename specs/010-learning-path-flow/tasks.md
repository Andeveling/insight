# Implementation Tasks: Learning Path Flow

**Branch**: `010-learning-path-flow`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Created**: 18 de diciembre de 2025

## Progress Summary

| Phase | Tasks | Completed | Progress |
|-------|-------|-----------|----------|
| Phase 1: Foundation | T001-T006 | 0/6 | 0% |
| Phase 2: Core Visualization | T007-T014 | 0/8 | 0% |
| Phase 3: Interactivity | T015-T021 | 0/7 | 0% |
| Phase 4: Sections & Organization | T022-T026 | 0/5 | 0% |
| Phase 5: View Toggle | T027-T031 | 0/5 | 0% |
| Phase 6: Polish & Mobile | T032-T038 | 0/7 | 0% |
| Phase 7: QA & Documentation | T039-T042 | 0/4 | 0% |
| **Total** | **42 tasks** | **0/42** | **0%** |

---

## Phase 1: Foundation (Schemas, Types, Utils)

### T001: Create roadmap schema and types
- **File**: `app/dashboard/development/_schemas/roadmap.schema.ts`
- **Description**: Crear schemas Zod y tipos TypeScript para nodos, edges, y configuración de layout
- **Acceptance**: 
  - [ ] `NodeStatusSchema` enum (completed, in_progress, not_started, locked)
  - [ ] `ModuleNodeDataSchema` con todos los campos
  - [ ] `SectionNodeDataSchema` para nodos de sección
  - [ ] `LayoutConfigSchema` con defaults
  - [ ] Tipos exportados: `NodeStatus`, `ModuleNodeData`, `RoadmapNode`, `RoadmapEdge`
- **Status**: ⏳ Not Started

### T002: Update barrel export for schemas
- **File**: `app/dashboard/development/_schemas/index.ts`
- **Description**: Agregar exports del nuevo schema de roadmap
- **Acceptance**: 
  - [ ] Export all types from `roadmap.schema.ts`
- **Status**: ⏳ Not Started

### T003: Create layout calculator utility
- **File**: `app/dashboard/development/_utils/layout-calculator.ts`
- **Description**: Implementar algoritmo de layout serpentino (zigzag vertical)
- **Acceptance**: 
  - [ ] `calculateSerpentinePosition(index, config)` → `{x, y}`
  - [ ] `generateNodesFromModules(modules, config)` → `RoadmapNode[]`
  - [ ] `generateEdgesFromNodes(nodes)` → `RoadmapEdge[]`
  - [ ] Layout serpentino: filas pares izq→der, impares der→izq
- **Status**: ⏳ Not Started

### T004: Create node status mapper utility
- **File**: `app/dashboard/development/_utils/node-status-mapper.ts`
- **Description**: Mapear estado de módulo a estado visual del nodo
- **Acceptance**: 
  - [ ] `mapModuleToNodeStatus(module)` → `NodeStatus`
  - [ ] `moduleCardToNodeData(module)` → `ModuleNodeData`
  - [ ] Mapeo correcto de progress.status a colores
- **Status**: ⏳ Not Started

### T005: Create section grouper utility
- **File**: `app/dashboard/development/_utils/section-grouper.ts`
- **Description**: Agrupar módulos por sección (personalizado, nivel)
- **Acceptance**: 
  - [ ] `groupModulesBySection(modules)` → `Map<string, ModuleCard[]>`
  - [ ] Sección "Para Ti" primero si hay personalizados
  - [ ] Luego por nivel: Principiante, Intermedio, Avanzado
- **Status**: ⏳ Not Started

### T006: Update barrel export for utils
- **File**: `app/dashboard/development/_utils/index.ts`
- **Description**: Agregar exports de las nuevas utilidades
- **Acceptance**: 
  - [ ] Export all from `layout-calculator.ts`
  - [ ] Export all from `node-status-mapper.ts`
  - [ ] Export all from `section-grouper.ts`
- **Status**: ⏳ Not Started

---

## Phase 2: Core Visualization (React Flow Canvas)

### T007: Create ModuleNode component
- **File**: `app/dashboard/development/_components/module-node.tsx`
- **Description**: Custom node para módulos con estados visuales gamificados
- **Acceptance**: 
  - [ ] Acepta `NodeProps<ModuleNodeData>` de React Flow
  - [ ] Colores por estado: verde (completed), amarillo (in_progress), gris (not_started/locked)
  - [ ] Icono de checkmark para completados
  - [ ] Icono de candado para locked
  - [ ] Porcentaje visible para in_progress
  - [ ] Borde/glow para estado seleccionado
  - [ ] Animaciones con motion/react (hover scale, pulse)
- **Status**: ⏳ Not Started

### T008: Create SectionNode component
- **File**: `app/dashboard/development/_components/section-node.tsx`
- **Description**: Nodo separador para secciones/niveles
- **Acceptance**: 
  - [ ] Acepta `NodeProps<SectionNodeData>` de React Flow
  - [ ] Muestra título de sección
  - [ ] Muestra progreso (X/Y completados)
  - [ ] Ancho completo del canvas
  - [ ] Color coding por dominio si aplica
- **Status**: ⏳ Not Started

### T009: Create ModuleEdge component
- **File**: `app/dashboard/development/_components/module-edge.tsx`
- **Description**: Edge animado para conectar nodos
- **Acceptance**: 
  - [ ] Usa `getBezierPath` de React Flow
  - [ ] Animación de dash con motion
  - [ ] Color diferente si conecta nodos completados (active)
  - [ ] Gradient effect opcional
- **Status**: ⏳ Not Started

### T010: Create useRoadmapLayout hook
- **File**: `app/dashboard/development/_hooks/use-roadmap-layout.ts`
- **Description**: Hook para calcular layout de nodos y edges
- **Acceptance**: 
  - [ ] Input: `modules: ModuleCard[]`, `config?: LayoutConfig`
  - [ ] Output: `{ nodes: RoadmapNode[], edges: RoadmapEdge[] }`
  - [ ] Usa `useMemo` para performance
  - [ ] Incluye section nodes en posiciones correctas
- **Status**: ⏳ Not Started

### T011: Create LearningPathFlow component
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Componente wrapper principal del canvas React Flow
- **Acceptance**: 
  - [ ] Props: `modules: ModuleCard[]`, `onNodeClick: (moduleId) => void`
  - [ ] Usa `useRoadmapLayout` para calcular layout
  - [ ] Registra `nodeTypes` y `edgeTypes` custom
  - [ ] Incluye `<Controls>` para zoom
  - [ ] `fitView` inicial
  - [ ] `nodesDraggable={false}`, `nodesConnectable={false}`
- **Status**: ⏳ Not Started

### T012: Create RoadmapControls component
- **File**: `app/dashboard/development/_components/roadmap-controls.tsx`
- **Description**: Controles personalizados de zoom/fit
- **Acceptance**: 
  - [ ] Botón zoom in
  - [ ] Botón zoom out
  - [ ] Botón fit view
  - [ ] Estilizado con shadcn Button
  - [ ] Posicionado en esquina del canvas
- **Status**: ⏳ Not Started

### T013: Update barrel export for components
- **File**: `app/dashboard/development/_components/index.ts`
- **Description**: Agregar exports de los nuevos componentes
- **Acceptance**: 
  - [ ] Export LearningPathFlow
  - [ ] Export ModuleNode, SectionNode, ModuleEdge
  - [ ] Export RoadmapControls
- **Status**: ⏳ Not Started

### T014: Update barrel export for hooks
- **File**: `app/dashboard/development/_hooks/index.ts`
- **Description**: Agregar export del hook de roadmap
- **Acceptance**: 
  - [ ] Export useRoadmapLayout
- **Status**: ⏳ Not Started

---

## Phase 3: Interactivity (Click, Hover, Preview)

### T015: Create useNodeInteractions hook
- **File**: `app/dashboard/development/_hooks/use-node-interactions.ts`
- **Description**: Hook para manejar click y hover en nodos
- **Acceptance**: 
  - [ ] State: `selectedNodeId`, `hoveredNodeId`
  - [ ] Handler: `handleNodeClick(node)`
  - [ ] Handler: `handleNodeMouseEnter(node)`
  - [ ] Handler: `handleNodeMouseLeave()`
  - [ ] Retorna handlers para pasar a React Flow
- **Status**: ⏳ Not Started

### T016: Create ModulePreviewPanel component
- **File**: `app/dashboard/development/_components/module-preview-panel.tsx`
- **Description**: Panel lateral (Sheet) con detalles del módulo al hacer click
- **Acceptance**: 
  - [ ] Props: `module: ModuleCard | null`, `open: boolean`, `onClose: () => void`
  - [ ] Usa `<Sheet>` de shadcn
  - [ ] Muestra: título, descripción, nivel, XP, duración
  - [ ] Muestra: progreso si in_progress
  - [ ] Botón "Comenzar" / "Continuar" según estado
  - [ ] Navega a `/dashboard/development/[moduleId]`
  - [ ] Mensaje de prerrequisito si locked
- **Status**: ⏳ Not Started

### T017: Create ModuleTooltip component
- **File**: `app/dashboard/development/_components/module-tooltip.tsx`
- **Description**: Tooltip que aparece al hacer hover en nodo
- **Acceptance**: 
  - [ ] Props: `data: ModuleNodeData`, `position: {x, y}`
  - [ ] Muestra: nombre, XP, estado
  - [ ] Posicionado cerca del nodo
  - [ ] Animación fade in/out con motion
- **Status**: ⏳ Not Started

### T018: Integrate hover tooltip in LearningPathFlow
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Agregar lógica de tooltip al canvas
- **Acceptance**: 
  - [ ] Mostrar tooltip en hover sobre nodo
  - [ ] Ocultar al salir del nodo
  - [ ] Posición correcta relativa al viewport
- **Status**: ⏳ Not Started

### T019: Integrate preview panel in LearningPathFlow
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Agregar panel de preview al hacer click
- **Acceptance**: 
  - [ ] Abrir panel al click en nodo
  - [ ] Cerrar panel con botón o click fuera
  - [ ] Pasar datos del módulo correctos
- **Status**: ⏳ Not Started

### T020: Add locked node behavior
- **File**: `app/dashboard/development/_components/module-node.tsx`
- **Description**: Comportamiento especial para nodos bloqueados
- **Acceptance**: 
  - [ ] Cursor diferente (not-allowed)
  - [ ] Shake animation al click
  - [ ] Tooltip indica prerrequisito faltante
- **Status**: ⏳ Not Started

### T021: Update hooks barrel export
- **File**: `app/dashboard/development/_hooks/index.ts`
- **Description**: Agregar export de useNodeInteractions
- **Acceptance**: 
  - [ ] Export useNodeInteractions
- **Status**: ⏳ Not Started

---

## Phase 4: Sections & Organization (P2)

### T022: Add section support to layout calculator
- **File**: `app/dashboard/development/_utils/layout-calculator.ts`
- **Description**: Insertar nodos de sección en posiciones correctas
- **Acceptance**: 
  - [ ] Generar SectionNode antes de cada grupo
  - [ ] Calcular posición Y con sectionSpacing extra
  - [ ] Section nodes ocupan ancho completo
- **Status**: ⏳ Not Started

### T023: Style SectionNode with domain colors
- **File**: `app/dashboard/development/_components/section-node.tsx`
- **Description**: Aplicar colores de dominio a secciones
- **Acceptance**: 
  - [ ] Mapear domainKey a color
  - [ ] Background sutil con color del dominio
  - [ ] Iconos de nivel (🌱🌿🌳) según sección
- **Status**: ⏳ Not Started

### T024: Add section progress calculation
- **File**: `app/dashboard/development/_utils/section-grouper.ts`
- **Description**: Calcular progreso por sección
- **Acceptance**: 
  - [ ] `calculateSectionProgress(modules)` → `{completed, total}`
  - [ ] Incluir en SectionNodeData
- **Status**: ⏳ Not Started

### T025: Add section click to zoom behavior
- **File**: `app/dashboard/development/_components/section-node.tsx`
- **Description**: Click en sección hace zoom a esa área
- **Acceptance**: 
  - [ ] Props incluye callback `onSectionClick`
  - [ ] Usa `fitBounds` de React Flow
  - [ ] Animación suave de transición
- **Status**: ⏳ Not Started

### T026: Integrate sections in LearningPathFlow
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Renderizar secciones correctamente
- **Acceptance**: 
  - [ ] Section nodes visibles
  - [ ] Progreso actualizado
  - [ ] Click zoom funciona
- **Status**: ⏳ Not Started

---

## Phase 5: View Toggle (P3)

### T027: Create useViewPreference hook
- **File**: `app/dashboard/development/_hooks/use-view-preference.ts`
- **Description**: Hook para persistir preferencia de vista en localStorage
- **Acceptance**: 
  - [ ] Input: ninguno
  - [ ] Output: `[view: ViewPreference, setView: (v) => void]`
  - [ ] Lee de localStorage en mount
  - [ ] Persiste cambios a localStorage
  - [ ] Default: "roadmap"
- **Status**: ⏳ Not Started

### T028: Create ViewToggle component
- **File**: `app/dashboard/development/_components/view-toggle.tsx`
- **Description**: Toggle para alternar entre vista Roadmap y Lista
- **Acceptance**: 
  - [ ] Props: `view`, `onChange`
  - [ ] Dos botones: 🗺️ Roadmap, 📋 Lista
  - [ ] Estilo de ToggleGroup de shadcn
  - [ ] Animación de transición
- **Status**: ⏳ Not Started

### T029: Update hooks barrel export
- **File**: `app/dashboard/development/_hooks/index.ts`
- **Description**: Agregar export de useViewPreference
- **Acceptance**: 
  - [ ] Export useViewPreference
- **Status**: ⏳ Not Started

### T030: Modify development page for view toggle
- **File**: `app/dashboard/development/page.tsx`
- **Description**: Integrar toggle y renderizado condicional
- **Acceptance**: 
  - [ ] Agregar ViewToggle en header de módulos
  - [ ] Renderizar LearningPathFlow si view="roadmap"
  - [ ] Renderizar ModuleList si view="list"
  - [ ] Transición suave entre vistas
- **Status**: ⏳ Not Started

### T031: Update components barrel export
- **File**: `app/dashboard/development/_components/index.ts`
- **Description**: Agregar ViewToggle al export
- **Acceptance**: 
  - [ ] Export ViewToggle
- **Status**: ⏳ Not Started

---

## Phase 6: Polish & Mobile

### T032: Add motion animations to ModuleNode
- **File**: `app/dashboard/development/_components/module-node.tsx`
- **Description**: Mejorar animaciones gamificadas
- **Acceptance**: 
  - [ ] Entrada con stagger animation
  - [ ] Pulse suave para nodos completados
  - [ ] Glow para in_progress
  - [ ] Bounce al completar un challenge
- **Status**: ⏳ Not Started

### T033: Add motion animations to edges
- **File**: `app/dashboard/development/_components/module-edge.tsx`
- **Description**: Edges más vivos y gamificados
- **Acceptance**: 
  - [ ] Dash animation fluida
  - [ ] Cambio de color al pasar a completado
  - [ ] Sparkle effect en conexión de nodos completados
- **Status**: ⏳ Not Started

### T034: Mobile responsive adjustments
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Optimizar para dispositivos móviles
- **Acceptance**: 
  - [ ] Detectar viewport < 768px
  - [ ] Ajustar nodeWidth/nodeHeight
  - [ ] Aumentar touch targets (44px min)
  - [ ] Reducir nodesPerRow a 2 en móvil
- **Status**: ⏳ Not Started

### T035: Touch gesture improvements
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Mejorar experiencia touch
- **Acceptance**: 
  - [ ] Pinch-to-zoom suave
  - [ ] Long press para tooltip
  - [ ] Tap to select, double tap to zoom
- **Status**: ⏳ Not Started

### T036: Performance optimization
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Optimizar para 50+ nodos
- **Acceptance**: 
  - [ ] Usar `memo()` en ModuleNode y SectionNode
  - [ ] `onlyRenderVisibleElements={true}`
  - [ ] Reducir animaciones si > 30 nodos
- **Status**: ⏳ Not Started

### T037: Empty state handling
- **File**: `app/dashboard/development/_components/learning-path-flow.tsx`
- **Description**: Manejar caso sin módulos
- **Acceptance**: 
  - [ ] Mostrar mensaje motivacional
  - [ ] Sugerir completar fortalezas primero
  - [ ] Ilustración/icono amigable
- **Status**: ⏳ Not Started

### T038: Add minimap optional
- **File**: `app/dashboard/development/_components/roadmap-minimap.tsx`
- **Description**: Minimap opcional para navegación
- **Acceptance**: 
  - [ ] Componente wrapper de `<MiniMap>`
  - [ ] Colores de nodos reflejan estado
  - [ ] Toggle para mostrar/ocultar
  - [ ] Solo visible si > 10 nodos
- **Status**: ⏳ Not Started

---

## Phase 7: QA & Documentation

### T039: TypeScript compilation check
- **Description**: Verificar compilación sin errores
- **Acceptance**: 
  - [ ] `bunx tsc --noEmit` sin errores
  - [ ] Todos los tipos correctos
- **Status**: ⏳ Not Started

### T040: ESLint check
- **Description**: Verificar linting sin errores
- **Acceptance**: 
  - [ ] `bun run lint` sin errores nuevos
  - [ ] Imports ordenados
- **Status**: ⏳ Not Started

### T041: Build verification
- **Description**: Verificar build exitoso
- **Acceptance**: 
  - [ ] `bun run build` completa sin errores
  - [ ] No warnings críticos
- **Status**: ⏳ Not Started

### T042: Manual QA testing
- **Description**: Testing manual completo de la feature
- **Acceptance**: 
  - [ ] Roadmap carga correctamente
  - [ ] Estados visuales correctos
  - [ ] Click → panel funciona
  - [ ] Hover → tooltip funciona
  - [ ] Zoom/pan funciona
  - [ ] Toggle vista funciona
  - [ ] Preferencia persiste
  - [ ] Mobile funciona
  - [ ] Performance aceptable
- **Status**: ⏳ Not Started

---

## Task Legend

| Symbol | Meaning |
|--------|---------|
| ⏳ | Not Started |
| 🔄 | In Progress |
| ✅ | Completed |
| ❌ | Blocked |
| 🔍 | Needs Review |
