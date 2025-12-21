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

## 7. Reglas de Oro para Desarrolladores

1. **PROHIBIDO** el uso de `rounded-*`. Si parece un círculo, debería ser un hexágono o un octágono.
2. **CAPAS**: Siempre usa `backdrop-blur` en contenedores flotantes para mantener el efecto de "vidrio táctico".
3. **TEXTO**: Si el texto es una instrucción o label, debe ir en mayúsculas. El texto de lectura (body) puede ser mixto.
4. **CONTRASTE**: Bordes brillantes de 1px sobre fondos oscuros profundos (`Ayu Mirage` o `Zinc-950`).
