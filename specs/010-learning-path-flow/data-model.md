# Data Model: Learning Path Flow

**Feature**: 010-learning-path-flow  
**Date**: 18 de diciembre de 2025

## Overview

Este documento define los tipos y estructuras de datos para el roadmap visual. No se requieren cambios al schema de Prisma ya que reutilizamos los modelos existentes.

## TypeScript Types

### Node Status (Estados Visuales)

```typescript
/**
 * Estados visuales del nodo en el roadmap
 */
export type NodeStatus = 
  | "completed"     // Verde con checkmark ✓
  | "in_progress"   // Amarillo con porcentaje
  | "not_started"   // Gris neutro
  | "locked";       // Gris oscuro con candado 🔒
```

### Module Node Data

```typescript
import type { ModuleCard } from "../_schemas/module.schema";

/**
 * Datos extendidos para un nodo de módulo en React Flow
 */
export interface ModuleNodeData {
  /** ID del módulo (de DevelopmentModule) */
  moduleId: string;
  
  /** Título en español */
  title: string;
  
  /** Nivel de dificultad */
  level: "beginner" | "intermediate" | "advanced";
  
  /** Estado visual del nodo */
  status: NodeStatus;
  
  /** Porcentaje de progreso (0-100) */
  progress: number;
  
  /** XP que otorga el módulo */
  xpReward: number;
  
  /** Duración estimada en minutos */
  estimatedMinutes: number;
  
  /** Key de la fortaleza asociada (opcional) */
  strengthKey: string | null;
  
  /** Key del dominio asociado (opcional) */
  domainKey: string | null;
  
  /** Tipo de módulo */
  moduleType: "general" | "personalized";
  
  /** Challenges completados */
  completedChallenges: number;
  
  /** Total de challenges */
  totalChallenges: number;
}
```

### Section Node Data

```typescript
/**
 * Datos para un nodo de sección (separador de dominio/fortaleza)
 */
export interface SectionNodeData {
  /** ID único de la sección */
  sectionId: string;
  
  /** Título de la sección (ej: "Dominio Hacer") */
  title: string;
  
  /** Key del dominio para theming */
  domainKey: string | null;
  
  /** Módulos completados en esta sección */
  completed: number;
  
  /** Total de módulos en esta sección */
  total: number;
}
```

### React Flow Node Types

```typescript
import type { Node } from "@xyflow/react";

/**
 * Nodo de módulo para React Flow
 */
export type ModuleNode = Node<ModuleNodeData, "module">;

/**
 * Nodo de sección para React Flow
 */
export type SectionNode = Node<SectionNodeData, "section">;

/**
 * Unión de todos los tipos de nodos
 */
export type RoadmapNode = ModuleNode | SectionNode;
```

### React Flow Edge Type

```typescript
import type { Edge } from "@xyflow/react";

/**
 * Edge para conectar nodos en el roadmap
 * Usa edges animados con tipo smoothstep
 */
export type RoadmapEdge = Edge<{
  /** Si el edge está "activo" (conecta nodos completados) */
  active?: boolean;
}>;
```

### Layout Configuration

```typescript
/**
 * Configuración del algoritmo de layout serpentino
 */
export interface LayoutConfig {
  /** Ancho de cada nodo en px */
  nodeWidth: number;
  
  /** Alto de cada nodo en px */
  nodeHeight: number;
  
  /** Espacio horizontal entre nodos */
  horizontalSpacing: number;
  
  /** Espacio vertical entre filas */
  verticalSpacing: number;
  
  /** Espacio extra antes de secciones */
  sectionSpacing: number;
  
  /** Número de nodos por fila (antes de zigzag) */
  nodesPerRow: number;
  
  /** Posición X inicial */
  startX: number;
  
  /** Posición Y inicial */
  startY: number;
}

/**
 * Configuración por defecto
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  nodeWidth: 180,
  nodeHeight: 80,
  horizontalSpacing: 100,
  verticalSpacing: 120,
  sectionSpacing: 60,
  nodesPerRow: 3,
  startX: 100,
  startY: 50,
};
```

### View Preference

```typescript
/**
 * Preferencia de vista del usuario
 */
export type ViewPreference = "roadmap" | "list";

/**
 * Key para localStorage
 */
export const VIEW_PREFERENCE_KEY = "insight:development:viewPreference";
```

## Mapping Functions

### ModuleCard → ModuleNodeData

```typescript
import type { ModuleCard } from "../_schemas/module.schema";

/**
 * Convierte un ModuleCard existente a ModuleNodeData para React Flow
 */
export function moduleCardToNodeData(module: ModuleCard): ModuleNodeData {
  // Determinar status basado en progreso
  let status: NodeStatus = "not_started";
  if (module.progress.status === "completed") {
    status = "completed";
  } else if (module.progress.status === "in_progress") {
    status = "in_progress";
  }
  // TODO: Lógica para "locked" basada en prerrequisitos
  
  return {
    moduleId: module.id,
    title: module.titleEs,
    level: module.level,
    status,
    progress: module.progress.percentComplete,
    xpReward: module.xpReward,
    estimatedMinutes: module.estimatedMinutes,
    strengthKey: module.strengthKey,
    domainKey: null, // Inferir de strengthKey si es necesario
    moduleType: module.moduleType,
    completedChallenges: module.progress.completedChallenges,
    totalChallenges: module.progress.totalChallenges,
  };
}
```

### GroupBySection

```typescript
/**
 * Agrupa módulos por sección (dominio o tipo)
 */
export function groupModulesBySection(
  modules: ModuleCard[]
): Map<string, ModuleCard[]> {
  const groups = new Map<string, ModuleCard[]>();
  
  // Primero: módulos personalizados en sección especial
  const personalized = modules.filter(m => m.moduleType === "personalized");
  if (personalized.length > 0) {
    groups.set("Para Ti", personalized);
  }
  
  // Luego: agrupar por nivel (beginner, intermediate, advanced)
  const general = modules.filter(m => m.moduleType === "general");
  const byLevel = {
    beginner: general.filter(m => m.level === "beginner"),
    intermediate: general.filter(m => m.level === "intermediate"),
    advanced: general.filter(m => m.level === "advanced"),
  };
  
  if (byLevel.beginner.length > 0) {
    groups.set("Principiante", byLevel.beginner);
  }
  if (byLevel.intermediate.length > 0) {
    groups.set("Intermedio", byLevel.intermediate);
  }
  if (byLevel.advanced.length > 0) {
    groups.set("Avanzado", byLevel.advanced);
  }
  
  return groups;
}
```

## Zod Schemas

```typescript
// _schemas/roadmap.schema.ts

import { z } from "zod";

export const NodeStatusSchema = z.enum([
  "completed",
  "in_progress", 
  "not_started",
  "locked"
]);

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

export const SectionNodeDataSchema = z.object({
  sectionId: z.string(),
  title: z.string(),
  domainKey: z.string().nullable(),
  completed: z.number(),
  total: z.number(),
});

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
```

## Database Entities (Sin Cambios)

Los siguientes modelos de Prisma se reutilizan sin modificaciones:

| Model | Uso en Roadmap |
|-------|----------------|
| `DevelopmentModule` | Fuente de datos para nodos |
| `UserModuleProgress` | Estado de completado |
| `Challenge` | Conteo para progreso |
| `Domain` | Agrupación de secciones |
| `Strength` | Asociación dominio-fortaleza |

**No se requieren migraciones de base de datos.**
