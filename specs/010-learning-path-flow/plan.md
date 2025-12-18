# Implementation Plan: Learning Path Flow

**Branch**: `010-learning-path-flow` | **Date**: 18 de diciembre de 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-learning-path-flow/spec.md`

## Summary

Transformar la vista de módulos de desarrollo (`/dashboard/development`) en un roadmap visual interactivo estilo Duolingo/Battle Pass usando `@xyflow/react`. Los módulos se representan como nodos conectados con estados visuales distintivos (completado, en progreso, no iniciado). El usuario puede navegar con zoom/pan, hacer clic para ver detalles, y alternar entre vista roadmap y lista tradicional.

**Technical Approach**:
- Usar `@xyflow/react` (ya instalado) para el canvas interactivo
- Custom nodes con `motion/react` para animaciones gamificadas
- Layout algorítmico serpentino (vertical con zigzag)
- Organización por dominios/secciones con separadores visuales
- Persistencia de preferencia de vista en localStorage
- Reusar datos existentes de `getModules` action sin cambios de schema

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: 
- `@xyflow/react` ^12.10.0 (ya instalado) - Canvas interactivo
- `motion` ^12.23.25 (Framer Motion) - Animaciones gamificadas
- `lucide-react` - Iconos
- Shadcn/Radix UI - Componentes base (Dialog, Sheet, Tooltip)
**Storage**: Turso (libSQL) via Prisma - Sin cambios de schema requeridos
**Testing**: Manual QA + TypeScript compilation
**Target Platform**: Web (Next.js 16 App Router), responsive para móviles
**Project Type**: Web application (Next.js monorepo)
**Performance Goals**: 
- Carga inicial < 2s con 20+ nodos
- 60fps durante zoom/pan
- Renderizado incremental para 50+ nodos
**Constraints**: 
- Bundle size: React Flow agrega ~200KB (ya incluido)
- Touch-friendly para dispositivos móviles
**Scale/Scope**: 20-50 módulos por usuario típico

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Human-First Design** | ✅ PASS | Mejora orientación del usuario, reduce sensación de estar perdido |
| **II. Positive Psychology** | ✅ PASS | Gamificación visual refuerza progreso y logros |
| **III. Feature-First Architecture** | ✅ PASS | Componentes co-locados en `_components/`, hooks en `_hooks/` |
| **IV. AI-Augmented Insights** | ⚪ N/A | No involucra AI en esta feature |
| **V. Behavioral Design** | ✅ PASS | Reduce fricción, reward visual por progreso, progressive disclosure |
| **VI. Type Safety** | ✅ PASS | Tipos estrictos para nodes/edges, Zod para layout config |

## Project Structure

### Documentation (this feature)

```text
specs/010-learning-path-flow/
├── plan.md              # This file
├── research.md          # React Flow patterns research
├── data-model.md        # Node/Edge type definitions
├── quickstart.md        # Development setup guide
├── contracts/           # N/A (no new APIs)
├── checklists/          # Quality checklists
└── tasks.md             # Implementation tasks
```

### Source Code (feature-first architecture)

```text
app/dashboard/development/
├── page.tsx                          # Page with view toggle (Roadmap/Lista)
├── layout.tsx                        # Existing layout
├── loading.tsx                       # Existing loading state
├── _components/
│   ├── index.ts                      # Barrel export
│   ├── module-list.tsx               # Existing list view (preserved)
│   ├── module-card.tsx               # Existing card (preserved)
│   ├── learning-path-flow.tsx        # NEW: Main React Flow canvas wrapper
│   ├── module-node.tsx               # NEW: Custom node component
│   ├── section-node.tsx              # NEW: Section header node
│   ├── module-edge.tsx               # NEW: Custom animated edge
│   ├── module-preview-panel.tsx      # NEW: Detail panel/sheet on click
│   ├── roadmap-controls.tsx          # NEW: Zoom/fit controls
│   ├── roadmap-minimap.tsx           # NEW: Optional minimap
│   └── view-toggle.tsx               # NEW: Roadmap/Lista toggle
├── _hooks/
│   ├── index.ts                      # Barrel export
│   ├── use-roadmap-layout.ts         # NEW: Calculate node positions
│   ├── use-view-preference.ts        # NEW: localStorage persistence
│   └── use-node-interactions.ts      # NEW: Click, hover handlers
├── _utils/
│   ├── index.ts                      # Barrel export
│   ├── layout-calculator.ts          # NEW: Serpentine layout algorithm
│   ├── node-status-mapper.ts         # NEW: Map module status to visual state
│   └── section-grouper.ts            # NEW: Group modules by domain/strength
└── _schemas/
    ├── index.ts                      # Barrel export
    └── roadmap.schema.ts             # NEW: RoadmapNode, RoadmapEdge types
```

**Structure Decision**: Feature-first con subcarpetas `_*` para componentes, hooks, utils y schemas. Solo archivos del framework (page.tsx, layout.tsx, loading.tsx) en la raíz de la ruta.

## Schema Analysis

**Modelos existentes relevantes** (sin cambios requeridos):

| Model | Campos Clave para Roadmap | Uso |
|-------|---------------------------|-----|
| `DevelopmentModule` | `id`, `titleEs`, `level`, `order`, `strengthKey`, `domainKey`, `moduleType`, `xpReward`, `estimatedMinutes` | Datos del nodo |
| `UserModuleProgress` | `status`, `completedChallenges`, `totalChallenges` | Estado del nodo (completado/progreso/no iniciado) |
| `Challenge` | `xpReward`, `type` | Preview de recompensas |
| `Domain` | `name`, `nameEs` | Agrupación de secciones |
| `Strength` | `name`, `nameEs`, `domainId` | Vinculación fortaleza → dominio |
| `UserGamification` | `xpTotal`, `currentLevel` | Contexto de progreso global |

**Conclusión**: El schema actual tiene toda la información necesaria. No se requieren migraciones.

## Complexity Tracking

> No hay violaciones de la Constitution que requieran justificación.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |

---

## Phase 0: Research

### Decisiones de Diseño

| Decisión | Elección | Alternativas Consideradas | Rationale |
|----------|----------|---------------------------|-----------|
| **Layout Algorithm** | Serpentine (zigzag vertical) | Árbol jerárquico, Grid | Duolingo-style, mejor sensación de progreso lineal |
| **Node Interactivity** | Sheet/Panel lateral | Modal, Inline expand | Preserva contexto visual del roadmap |
| **Edge Style** | Animated bezier con gradient | Straight lines, Step edges | Más orgánico y gamificado |
| **Section Display** | Sticky section nodes | Collapsible groups | Mejor navegación sin perder contexto |
| **Mobile Support** | Touch gestures nativos de React Flow | Simplified mobile view | React Flow tiene buen soporte touch built-in |
| **View Persistence** | localStorage | Database UserPreference | Simplicidad, no requiere migration |

### React Flow Patterns Investigados

1. **Custom Nodes**: Usar `nodeTypes` prop para registrar `ModuleNode` y `SectionNode`
2. **Custom Edges**: Usar `edgeTypes` prop para `AnimatedEdge` con motion
3. **Layout**: Calcular posiciones manualmente (no usar dagre para más control)
4. **Interactivity**: `onNodeClick`, `onNodeMouseEnter/Leave` para preview
5. **Controls**: `<Controls>` component para zoom, `fitView` para reset
6. **Performance**: `nodesDraggable={false}` para mejor performance (no editable)

---

## Phase 1: Design & Contracts

### Data Model

```typescript
// _schemas/roadmap.schema.ts

import { z } from "zod";
import type { Node, Edge } from "@xyflow/react";

// Estados visuales del nodo
export const NodeStatusSchema = z.enum([
  "completed",    // Verde con checkmark
  "in_progress",  // Amarillo con porcentaje
  "not_started",  // Gris neutro
  "locked"        // Gris con candado (prerequisito no cumplido)
]);

// Datos del nodo de módulo
export const ModuleNodeDataSchema = z.object({
  moduleId: z.string(),
  title: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  status: NodeStatusSchema,
  progress: z.number().min(0).max(100),
  xpReward: z.number(),
  estimatedMinutes: z.number(),
  strengthKey: z.string().nullable(),
  domainKey: z.string().nullable(),
  moduleType: z.enum(["general", "personalized"]),
  completedChallenges: z.number(),
  totalChallenges: z.number(),
});

// Datos del nodo de sección
export const SectionNodeDataSchema = z.object({
  sectionId: z.string(),
  title: z.string(),
  domainKey: z.string().nullable(),
  completed: z.number(),
  total: z.number(),
});

// Layout configuration
export const LayoutConfigSchema = z.object({
  nodeWidth: z.number().default(180),
  nodeHeight: z.number().default(80),
  horizontalSpacing: z.number().default(100),
  verticalSpacing: z.number().default(120),
  sectionSpacing: z.number().default(60),
  nodesPerRow: z.number().default(3),
  startX: z.number().default(100),
  startY: z.number().default(50),
});

// Types
export type NodeStatus = z.infer<typeof NodeStatusSchema>;
export type ModuleNodeData = z.infer<typeof ModuleNodeDataSchema>;
export type SectionNodeData = z.infer<typeof SectionNodeDataSchema>;
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;

export type ModuleNode = Node<ModuleNodeData, "module">;
export type SectionNode = Node<SectionNodeData, "section">;
export type RoadmapNode = ModuleNode | SectionNode;
export type RoadmapEdge = Edge;
```

### Component Contracts

| Component | Props | Responsabilidad |
|-----------|-------|-----------------|
| `LearningPathFlow` | `modules: ModuleCard[]`, `onNodeClick: (moduleId) => void` | Canvas principal con React Flow |
| `ModuleNode` | `data: ModuleNodeData` (via React Flow) | Renderiza nodo individual con estado visual |
| `SectionNode` | `data: SectionNodeData` | Renderiza separador de sección |
| `ModuleEdge` | Edge props (via React Flow) | Edge animado con motion |
| `ModulePreviewPanel` | `module: ModuleCard \| null`, `open: boolean`, `onClose: () => void` | Sheet lateral con detalles |
| `ViewToggle` | `view: "roadmap" \| "list"`, `onChange: (view) => void` | Toggle entre vistas |
| `RoadmapControls` | N/A (usa React Flow Controls) | Controles de zoom/fit |

### Hook Contracts

| Hook | Input | Output | Responsabilidad |
|------|-------|--------|-----------------|
| `useRoadmapLayout` | `modules: ModuleCard[]`, `config?: LayoutConfig` | `{ nodes: RoadmapNode[], edges: RoadmapEdge[] }` | Calcula posiciones serpentinas |
| `useViewPreference` | N/A | `[view, setView]` | Persiste preferencia en localStorage |
| `useNodeInteractions` | N/A | `{ selectedNode, hoveredNode, handlers }` | Maneja click/hover |

---

## Quickstart

### Desarrollo Local

```bash
# 1. Asegurar branch correcto
git checkout 010-learning-path-flow

# 2. Instalar dependencias (React Flow ya instalado)
bun install

# 3. Ejecutar dev server
bun dev

# 4. Navegar a desarrollo
open http://localhost:3000/dashboard/development
```

### Verificación de Dependencias

```bash
# React Flow debe estar en package.json
grep "@xyflow/react" package.json
# Output: "@xyflow/react": "^12.10.0"

# Motion para animaciones
grep '"motion"' package.json  
# Output: "motion": "^12.23.25"
```

### Testing Manual

1. Cargar `/dashboard/development` → Ver roadmap en lugar de lista
2. Hacer zoom in/out con scroll → Canvas responde
3. Click en nodo → Aparece panel con detalles
4. Toggle a "Lista" → Ver grilla tradicional
5. Recargar página → Preferencia de vista persiste

