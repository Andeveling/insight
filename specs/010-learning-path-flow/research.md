# Research: Learning Path Flow

**Feature**: 010-learning-path-flow  
**Date**: 18 de diciembre de 2025

## React Flow Patterns for Gamified Roadmaps

### 1. Layout Algorithms

| Algorithm | Pros | Cons | Decisión |
|-----------|------|------|----------|
| **Serpentine (Zigzag)** | Duolingo-style, clara progresión vertical | Requiere cálculo manual | ✅ ELEGIDO |
| Dagre (Auto-layout) | Automático, maneja dependencias | Menos control visual, no serpentino | ❌ |
| Grid simple | Fácil de implementar | No transmite progresión | ❌ |
| Árbol jerárquico | Bueno para dependencias | Muy técnico, no gamificado | ❌ |

### 2. Serpentine Layout Algorithm

```
Ejemplo de layout serpentino con 3 nodos por fila:

Row 0:  [1] → [2] → [3]
              ↓
Row 1:  [6] ← [5] ← [4]
              ↓
Row 2:  [7] → [8] → [9]
```

**Implementación**:
```typescript
function calculateSerpentineLayout(
  modules: ModuleCard[],
  config: LayoutConfig
): { x: number; y: number }[] {
  return modules.map((_, index) => {
    const row = Math.floor(index / config.nodesPerRow);
    const posInRow = index % config.nodesPerRow;
    const isEvenRow = row % 2 === 0;
    
    // Zigzag: filas pares van derecha, impares van izquierda
    const col = isEvenRow ? posInRow : (config.nodesPerRow - 1 - posInRow);
    
    return {
      x: config.startX + col * (config.nodeWidth + config.horizontalSpacing),
      y: config.startY + row * (config.nodeHeight + config.verticalSpacing),
    };
  });
}
```

### 3. Edge Connection Patterns

Para conectar nodos en patrón serpentino:
- Nodos consecutivos en misma fila: Edge horizontal
- Último nodo de fila → Primer nodo siguiente fila: Edge vertical/curvo
- Usar `type: 'smoothstep'` o `type: 'bezier'` para curvas suaves

### 4. Custom Node Design (Duolingo-inspired)

**Estados visuales**:
| Estado | Color | Icono | Animación |
|--------|-------|-------|-----------|
| `completed` | Verde (#22c55e) | ✓ Checkmark | Pulse on hover |
| `in_progress` | Amarillo (#eab308) | % Porcentaje | Glow effect |
| `not_started` | Gris claro | Círculo vacío | Subtle scale |
| `locked` | Gris oscuro | 🔒 Candado | Shake on click |

**Forma del nodo**:
- Circular o pill-shaped (como Duolingo)
- Shadow/elevation para profundidad
- Border highlight en estado seleccionado
- Icono de nivel (🌱 beginner, 🌿 intermediate, 🌳 advanced)

### 5. Motion Animations

```typescript
// Animaciones con motion/react
const nodeVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.05, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
  tap: { scale: 0.95 },
  completed: { 
    scale: [1, 1.1, 1],
    transition: { repeat: Infinity, repeatDelay: 3 }
  }
};

const edgeVariants = {
  animate: {
    strokeDashoffset: [0, -20],
    transition: { repeat: Infinity, duration: 1, ease: "linear" }
  }
};
```

### 6. Section Headers

Para separar secciones por dominio/fortaleza:
- Usar nodos especiales `type: "section"` con ancho completo
- Color coding por dominio (reusar colores de cultura)
- Mostrar progreso de sección (3/5 completados)
- Click para hacer zoom/fit a esa sección

### 7. Mobile Considerations

React Flow soporta touch gestures nativamente:
- **Pinch-to-zoom**: Funciona out-of-the-box
- **Pan**: Drag con un dedo
- **Tap**: Equivalente a click

Optimizaciones:
- `nodesDraggable={false}` - No permitir mover nodos
- `nodesConnectable={false}` - No permitir crear conexiones
- `panOnDrag={true}` - Pan habilitado
- Nodes más grandes en móvil (touch targets 44px mínimo)

### 8. Performance Considerations

Para 50+ nodos:
- Usar `memo()` en custom nodes
- `onlyRenderVisibleElements={true}` para virtualización
- Lazy loading de datos de nodos
- Evitar re-renders innecesarios con `useMemo` para nodes/edges

### 9. View Toggle UX

Ubicación del toggle:
- Header de la sección, junto a filtros existentes
- Iconos: 🗺️ Roadmap | 📋 Lista
- Transición suave con crossfade

### 10. Integration with Existing Code

**Reutilización**:
- `getModules()` action → Datos para nodes
- `ModuleCard` type → Base para `ModuleNodeData`
- Colores de dominio → Tema de secciones
- XP/Level display → Incluir en node tooltips

**Sin cambios**:
- Schema de Prisma ✅
- Actions existentes ✅
- Components de módulo individual ✅

## Ejemplos de Referencia

1. **Duolingo** - Path vertical con nodos circulares
2. **Fortnite Battle Pass** - Horizontal con checkpoints
3. **LinkedIn Learning Paths** - Cards conectadas
4. **Codecademy** - Syllabus tree

## Conclusiones

1. Layout serpentino es ideal para transmitir progresión gamificada
2. React Flow con custom nodes + motion da flexibilidad total
3. No se requieren cambios de schema - reusar `getModules()`
4. Priorizar P1 (visualización + interacción) para MVP funcional
5. Toggle de vista preserva accesibilidad para usuarios que prefieren lista
