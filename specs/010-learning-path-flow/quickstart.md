# Quickstart: Learning Path Flow

**Feature**: 010-learning-path-flow  
**Date**: 18 de diciembre de 2025

## Prerequisites

- Node.js 20+ / Bun 1.x
- Git
- VS Code (recomendado)

## Setup

### 1. Branch

```bash
cd /path/to/insight
git checkout 010-learning-path-flow
```

### 2. Install Dependencies

```bash
bun install
```

React Flow y Motion ya están instalados:
```bash
# Verificar
grep -E "@xyflow/react|motion" package.json
```

### 3. Run Development Server

```bash
bun dev
```

### 4. Access Feature

Navegar a: http://localhost:3000/dashboard/development

## Development Workflow

### File Structure

```text
app/dashboard/development/
├── page.tsx                    # Modificar: agregar view toggle
├── _components/
│   ├── learning-path-flow.tsx  # CREAR: Canvas principal
│   ├── module-node.tsx         # CREAR: Custom node
│   ├── module-edge.tsx         # CREAR: Custom edge
│   ├── module-preview-panel.tsx# CREAR: Panel de detalles
│   └── view-toggle.tsx         # CREAR: Toggle roadmap/lista
├── _hooks/
│   ├── use-roadmap-layout.ts   # CREAR: Layout calculator
│   └── use-view-preference.ts  # CREAR: localStorage hook
├── _utils/
│   └── layout-calculator.ts    # CREAR: Algoritmo serpentino
└── _schemas/
    └── roadmap.schema.ts       # CREAR: Tipos y schemas
```

### Implementation Order

1. **Schemas** (`_schemas/roadmap.schema.ts`)
   - Tipos para nodos y edges
   - Zod validation

2. **Utils** (`_utils/layout-calculator.ts`)
   - Algoritmo de layout serpentino
   - Agrupación por secciones

3. **Hooks** (`_hooks/`)
   - `useRoadmapLayout` - Calcula posiciones
   - `useViewPreference` - Persiste vista

4. **Components** (`_components/`)
   - `ModuleNode` - Nodo visual
   - `ModuleEdge` - Edge animado
   - `LearningPathFlow` - Canvas wrapper
   - `ModulePreviewPanel` - Detalles al click
   - `ViewToggle` - Switcher de vista

5. **Page** (`page.tsx`)
   - Integrar toggle
   - Renderizado condicional roadmap/lista

## Testing Checklist

### P1: Visualización Básica
- [ ] Canvas React Flow renderiza
- [ ] Nodos muestran título de módulo
- [ ] Estados visuales correctos (colores)
- [ ] Zoom in/out funciona
- [ ] Pan (arrastrar) funciona

### P1: Interactividad
- [ ] Click en nodo abre panel
- [ ] Panel muestra detalles correctos
- [ ] Botón "Comenzar" navega al módulo
- [ ] Hover muestra tooltip

### P2: Secciones
- [ ] Módulos agrupados por nivel
- [ ] Separadores visibles
- [ ] Progreso de sección correcto

### P3: Toggle Vista
- [ ] Toggle visible en header
- [ ] Cambio de vista funciona
- [ ] Preferencia persiste al recargar

### Responsive
- [ ] Funciona en tablet (1024px)
- [ ] Funciona en móvil (375px)
- [ ] Touch gestures funcionan

## Useful Commands

```bash
# Type check
bunx tsc --noEmit

# Lint
bun run lint

# Build
bun run build

# Format
bun run format
```

## Key Resources

- [React Flow Docs](https://reactflow.dev)
- [React Flow Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [Motion/Framer Motion](https://motion.dev)
- [Spec](./spec.md)
- [Plan](./plan.md)
- [Data Model](./data-model.md)
- [Research](./research.md)

## Troubleshooting

### "React Flow not rendering"
- Asegurar contenedor tiene height definido
- Wrap en `<ReactFlowProvider>`

### "Nodes not showing"
- Verificar que nodes array no está vacío
- Revisar nodeTypes está registrado

### "Touch not working on mobile"
- Asegurar `panOnDrag={true}`
- No usar `nodesDraggable` en móvil

### "Performance issues with many nodes"
- Usar `onlyRenderVisibleElements={true}`
- Memoizar custom nodes
- Reducir animaciones en móvil
