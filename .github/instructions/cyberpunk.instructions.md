---
description: "This is the System Design instructions for the CyberPunk UI theme."
applyTo: "**/*.css, **/*.tsx"
---

# CyberPunk UI Design System (Tech/Stealth)

## 1. Visión General
El sistema de diseño de **Insight** se basa en una estética **Industrial CyberPunk / HUD (Heads-Up Display)**. El objetivo es que la interfaz se sienta como un sistema operativo táctico de alto rendimiento, priorizando la precisión técnica, la jerarquía de datos y la interactividad binaria.

## 2. Geometría y Estructura (Industrial Geometry)

### 2.1 Clip-Paths (Sharp Edges)
En Insight, los bordes redondos no existen. Utilizamos polígonos agresivos para cada contenedor.

- **Cards/Contenedores Principales (16px)**:
  `clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);`
- **Botones/Inputs (8px-12px)**:
  `clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);`
- **Iconos Hexagonales**:
  `clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);`

### 2.2 Bordes de Capas (Layered Internal Borders)
Para evitar que los bordes tradicionales se vean rectangulares al aplicar un clip-path, utilizamos el **Patrón de Doble Contenedor**:

```tsx
<div className="p-px bg-primary/30" style={{ clipPath: clipPath16 }}>
  <div className="bg-background/90 backdrop-blur-md h-full" style={{ clipPath: clipPath16 }}>
    {/* Contenido */}
  </div>
</div>
```

## 3. Texturas y Fondos (HUD Textures)

### 3.1 Rejilla Técnica (`bg-grid-tech`)
Utilizamos un patrón de rejilla de 40px para dar una sensación de plano técnico.
- **Implementación**: `.bg-grid-tech` (definido en `globals.css`).
- **Mascara Radial**: En secciones como el Hero, aplicamos un degradado radial para centrar el foco:
  `[mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]`

### 3.2 Escaneo de Sistema (Scan line)
Una línea horizontal que recorre la pantalla de arriba a abajo sutilmente para indicar que el sistema está "vivo".
- **Clase**: `.animate-scan`.

## 4. Tipografía y Micro-Lenguaje

### 4.1 Arquitectura de Texto
- **Headers/Labels**: Siempre en `uppercase`, con `font-black` y un `tracking` generoso (`tracking-[0.2em]` a `tracking-[0.4em]`).
- **Monospaced Logs**: Utilizamos fuentes mono para IDs de sistema, versiones y mensajes de error (ej: `SYSTEM_AUTH_V.01`).

### 4.2 Etiquetas Técnicas
Los badges deben incluir prefijos de sistema y ser visualmente compactos:
- `[NODE_READY]`
- `[DATA_MINING]`
- `PROTOCOL_V2.0`

## 5. Código de Colores Semántico

- **Core System (Primary/Amber)**: `--primary`. Utilizado para el núcleo de la aplicación y el flujo principal.
- **Stable/Success (Emerald)**: Utilizado para estados "Online", fortalezas desbloqueadas y confirmaciones.
- **Alert/Critical (Destructive)**: Utilizado para excepciones de protocolo y errores de sistema.
- **Data/Neutral (Chart-2/Teal)**: Utilizado para métricas secundarias y visualización de datos de equipo.

## 6. Animaciones y Reactividad

### 6.1 Status Pulse
Los componentes activos deben tener un destello sutil de estado:
- **Active Node Pulse**: `.animate-pulse` sobre un punto pequeño con `shadow-[0_0_8px_currentColor]`.

### 6.2 Data Transmission
- **Loading Progress**: Barras que se llenan horizontalmente con `@keyframes progress-fill`.
- **Hover Transitions**: Al pasar el cursor sobre las `FeatureCards`, la opacidad del borde aumenta y la barra de carga interna se completa, indicando que el "nodo" está seleccionado.

## 7. Componentes Reutilizables Estandarizados

Para mantener consistencia visual y reducir duplicación, utilizamos componentes base ubicados en `components/cyber-ui/`:

### 7.1 ClippedContainer
Wrapper base que implementa automáticamente el patrón de doble contenedor con clip-paths.

**Props:**
- `size`: `"large"` | `"medium"` | `"small"` (mapea a clip-paths predefinidos)
- `borderColor`: color semántico (default: `"primary"`)
- `borderOpacity`: 0-100 (default: `30`)
- `backgroundColor`: color semántico
- `backgroundOpacity`: 0-100
- `backdropBlur`: boolean (default: `true`)
- `padding`: clase Tailwind (default: `"p-6"`)
- `noBorder`: boolean para ocultar borde externo

**Uso:**
```tsx
<ClippedContainer
  size="large"
  borderColor="warning"
  borderOpacity={30}
  padding="p-10"
  innerClassName="text-center space-y-6"
>
  {/* Contenido */}
</ClippedContainer>
```

### 7.2 HexIcon
Componente que envuelve íconos de Lucide en un contenedor hexagonal con opciones de animación.

**Props:**
- `icon`: LucideIcon
- `color`: color semántico
- `size`: `"sm"` | `"md"` | `"lg"` | `"xl"`
- `animated`: boolean (aplica `animate-pulse`)
- `bgOpacity`: 0-100 (background externo)
- `innerBgOpacity`: 0-100 (background interno)

**Uso:**
```tsx
<HexIcon 
  icon={UsersIcon} 
  color="primary" 
  size="lg" 
  animated 
/>
```

### 7.3 Badge Components
Conjunto de componentes especializados para etiquetas técnicas:

#### StatusBadge
Indicadores de compatibilidad con variantes: `high` (success), `medium` (warning), `low` (destructive).
```tsx
<StatusBadge compatibility="high" /> // High_Resonance
```

#### StrengthTag
Micro badges para nombres de fortalezas en listas.
```tsx
<StrengthTag strength="Leadership" />
```

#### PhaseLabel
Headers de fases con duración. Variantes: `immediate`, `consolidation`, `sustainability`.
```tsx
<PhaseLabel phase="immediate" duration="30 días" />
```

#### ProtocolBadge
IDs de protocolo numerados.
```tsx
<ProtocolBadge id={1} prefix="PROTOCOL_ID" color="primary" />
```

#### NodeIdBadge
IDs de nodos del sistema.
```tsx
<NodeIdBadge id={userId} prefix="NODE_ID" />
```

#### SectionBadge
Etiquetas de categoría/sección.
```tsx
<SectionBadge label="SYSTEM_LOGS" color="info" />
```

### 7.4 TechGridBackground
Wrapper que aplica la textura de rejilla técnica a un contenedor con soporte para hover.

**Props:**
- `children`: ReactNode (opcional)
- `opacity`: 0-100 (default: `10`)
- `hoverOpacity`: 0-100 (efecto hover)
- `radialMask`: boolean (aplica máscara radial)

**Uso:**
```tsx
<TechGridBackground opacity={10} hoverOpacity={20}>
  {/* Contenido */}
</TechGridBackground>
```

## 8. Constantes de Clip-Paths Centralizadas

Ubicadas en `lib/constants/clip-paths.ts`. SIEMPRE usar estas constantes en lugar de valores inline.

```typescript
export const CLIP_PATHS = {
  large: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
  medium: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
  small: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
  hex: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
};
```

## 9. Variables CSS Semánticas

Colores temáticos definidos en `app/globals.css` con soporte automático para light/dark mode:

```css
/* Light Mode */
--warning: oklab(0.75 0.15 70);      /* Ámbar - Advertencias */
--info: oklab(0.65 0.15 240);        /* Azul - Información */
--success: oklab(0.65 0.15 145);     /* Esmeralda - Éxito */
--highlight: oklab(0.7 0.18 85);     /* Amarillo - Resaltar */
--insight: oklab(0.6 0.18 300);      /* Púrpura - Insights */

/* Dark Mode */
--warning: oklab(0.78 0.16 70);
--info: oklab(0.7 0.15 240);
--success: oklab(0.75 0.15 145);
--highlight: oklab(0.8 0.18 85);
--insight: oklab(0.7 0.15 280);
```

**Uso en componentes:**
```tsx
{/* INCORRECTO */}
<div className="bg-red-500 text-amber-500" />

{/* CORRECTO */}
<div className="bg-[hsl(var(--destructive))] text-[hsl(var(--warning))]" />
```

## 10. Reglas de Oro para Desarrolladores

1. **PROHIBIDO** el uso de `rounded-*`. Si parece un círculo, debería ser un hexágono o un octágono.
2. **CAPAS**: Siempre usa `backdrop-blur` en contenedores flotantes para mantener el efecto de "vidrio táctico".
3. **TEXTO**: Si el texto es una instrucción o label, debe ir en mayúsculas. El texto de lectura (body) puede ser mixto.
4. **CONTRASTE**: Bordes brillantes de 1px sobre fondos oscuros profundos (`Ayu Mirage` o `Zinc-950`).
5. **CLIP-PATHS**: Nunca usar valores inline. Siempre importar `CLIP_PATHS` desde `lib/constants/clip-paths.ts`.
6. **COLORES**: Nunca hardcodear colores Tailwind (`red-500`, `blue-500`, etc.). Usar variables CSS semánticas (`hsl(var(--warning))`).
7. **COMPONENTES**: Utilizar `ClippedContainer`, `HexIcon` y badge components en lugar de implemen tar patrones inline.
8. **TIPOGRAFÍA**: Headers y labels SIEMPRE en uppercase con `tracking-[0.2em]` mínimo. Body text puede ser mixto.

## 11. Checklist de Implementación

Para cualquier nueva vista o componente que use el diseño CyberPunk:

- [ ] ¿Se usan `CLIP_PATHS` constantes? (No inline `polygon(...)`)
- [ ] ¿Se usan variables CSS para colores? (No `text-red-500`, usar `text-[hsl(var(--warning))]`)
- [ ] ¿Se usan componentes base? (`ClippedContainer`, `HexIcon`, badges)
- [ ] ¿No hay `rounded-*` en el código?
- [ ] ¿Todo texto técnico está en uppercase?
- [ ] ¿Se aplicó `backdrop-blur` en contenedores flotantes?
- [ ] ¿Se validó el contraste en light y dark mode?

## 12. Migración de Código Existente

Si tienes código que no sigue estos estándares:

### Antes:
```tsx
<div 
  className="p-px bg-blue-500/30"
  style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
>
  <div className="bg-background/95 backdrop-blur-md" style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}>
    {content}
  </div>
</div>
```

### Después:
```tsx
<ClippedContainer
  size="large"
  borderColor="info"
  borderOpacity={30}
>
  {content}
</ClippedContainer>
```

**Resultado**: ~70% menos código, 100% más mantenible.
