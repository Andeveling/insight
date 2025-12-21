# CyberPunk UI Design System (Tech/Stealth)

## Concepto
El sistema de diseño de **Insight** adopta una estética **CyberPunk / Tech / Stealth**. El objetivo es transmitir una sensación de tecnología avanzada, precisión y modernidad, inspirada en interfaces de usuario de ciencia ficción (FUI) y entornos de desarrollo de alto rendimiento.

Este estilo se caracteriza por el uso de formas geométricas agresivas, efectos de brillo sutiles (glow), y una paleta de colores vibrantes sobre fondos extremadamente oscuros.

## Elementos Clave

### 1. Esquinas Recortadas (Clip-Paths)
En lugar de bordes redondeados tradicionales, utilizamos `clip-path` para crear esquinas recortadas que evocan un diseño industrial y tecnológico.

**Ejemplo de uso:**
```css
/* Esquinas de 16px */
clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);

/* Esquinas de 8px (para botones) */
clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
```

### 2. Bordes de Precisión (Layered Borders)
Para lograr bordes extremadamente finos y brillantes que sigan la forma del `clip-path`, utilizamos una técnica de capas:
1. **Capa Exterior (Borde)**: Un contenedor con `p-px` y un fondo degradado o color sólido.
2. **Capa Interior (Contenido)**: El contenedor principal con el fondo oscuro de la aplicación.

Ambas capas deben compartir el mismo `clip-path`.

### 3. Fondos y Texturas
- **Base**: `bg-zinc-950` o `bg-black`.
- **Glassmorphism**: Uso de `backdrop-blur-sm` con opacidades bajas (ej. `bg-zinc-950/70`) para dar profundidad.
- **Grids**: Patrones de rejilla sutiles de 20px creados con gradientes lineales para reforzar la estética de "plano técnico".

### 4. Paleta de Colores (Acentos)
Los colores se utilizan para indicar niveles de dificultad, estados de progreso o importancia:
- **Principiante (Emerald)**: `#10b981` - Crecimiento y seguridad.
- **Intermedio (Amber)**: `#f59e0b` - Energía y enfoque.
- **Avanzado (Purple)**: `#a855f7` - Maestría y complejidad.
- **Recomendado (Indigo)**: `#6366f1` - Prioridad y sistema.

### 5. Tipografía y Etiquetas
- **Labels**: Uso de `uppercase`, `tracking-wider` y fuentes `bold`.
- **Badges**: Estilo minimalista con bordes sutiles y fondos transparentes.

## Guía de Implementación

Para mantener la consistencia, cualquier componente nuevo (Cards, Modales, Botones) debe seguir este patrón:

```tsx
<div 
  className="p-px bg-linear-to-br from-emerald-500/50 to-emerald-900/20"
  style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
>
  <div 
    className="bg-zinc-950/90 backdrop-blur-sm p-6"
    style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
  >
    {/* Contenido */}
  </div>
</div>
```

## Animaciones
Utilizamos `motion/react` para:
- **Entradas**: Desplazamientos suaves en el eje Y con cambios de opacidad.
- **Hover**: Elevación sutil (`y: -4`) y aumento de la intensidad de los brillos en los bordes.
