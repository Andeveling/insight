# GamifiedBadge Component

Componente reusable de badge gamificado con efectos neon/glow.

## Uso Básico

```tsx
import { GamifiedBadge } from "@/components/gamification";
import { Sparkles, Flame, Trophy } from "lucide-react";

// Badge de nivel
<GamifiedBadge
  icon={Sparkles}
  value={12}
  label="Lvl"
  variant="cyan"
  size="lg"
/>

// Badge de racha con ícono relleno
<GamifiedBadge
  icon={Flame}
  value={5}
  variant="orange"
  iconFill
  size="md"
/>

// Badge de trofeos
<GamifiedBadge
  icon={Trophy}
  value={28}
  variant="gold"
  size="sm"
/>
```

## Props

### GamifiedBadge

| Prop        | Tipo                                                 | Default  | Descripción                             |
| ----------- | ---------------------------------------------------- | -------- | --------------------------------------- |
| `icon`      | `LucideIcon`                                         | -        | Ícono de lucide-react                   |
| `value`     | `string \| number`                                   | -        | Valor a mostrar                         |
| `label`     | `string`                                             | -        | Etiqueta opcional (ej: "Lvl", "XP")     |
| `variant`   | `"cyan" \| "orange" \| "teal" \| "purple" \| "gold"` | `"cyan"` | Tema de color                           |
| `iconFill`  | `boolean`                                            | `false`  | Si el ícono debe tener relleno de color |
| `size`      | `"sm" \| "md" \| "lg"`                               | `"md"`   | Tamaño del badge                        |
| `className` | `string`                                             | -        | Clases CSS adicionales                  |

## Variantes de Color

- **cyan**: Azul/cyan con glow cyan (nivel, XP)
- **orange**: Naranja/rojo con glow naranja (racha, fuego)
- **teal**: Teal/cyan con glow teal (moneda, gemas)
- **purple**: Púrpura/violeta con glow púrpura (premium, especial)
- **gold**: Dorado/amarillo con glow dorado (logros, oro)

## Tamaños

- **sm**: Pequeño (botones, inline)
- **md**: Mediano (cards, headers)
- **lg**: Grande (destacados, hero sections)

## Ejemplo Completo

```tsx
"use client";

import { GamifiedBadge } from "@/components/gamification";
import { Sparkles, Flame, Diamond, Trophy, Zap } from "lucide-react";

export function UserStatsBar() {
  return (
    <div className="flex items-center gap-3">
      {/* Nivel */}
      <GamifiedBadge
        icon={Sparkles}
        value={12}
        label="Lvl"
        variant="cyan"
        size="lg"
      />
      
      {/* Racha */}
      <GamifiedBadge
        icon={Flame}
        value={5}
        variant="orange"
        iconFill
        size="lg"
      />
      
      {/* Moneda/Gemas */}
      <GamifiedBadge
        icon={Diamond}
        value={450}
        variant="teal"
        iconFill
        size="lg"
      />
      
      {/* Logros */}
      <GamifiedBadge
        icon={Trophy}
        value={28}
        variant="gold"
        size="md"
      />
      
      {/* XP */}
      <GamifiedBadge
        icon={Zap}
        value="1250 XP"
        variant="purple"
        size="sm"
      />
    </div>
  );
}
```

## GamifiedIconBadge

Versión simplificada solo con ícono y valor (sin fondo de ícono):

```tsx
<GamifiedIconBadge
  icon={Flame}
  value={5}
  variant="orange"
  iconFill
  size="md"
/>
```

## Efectos Visuales

- **Glow/Resplandor**: Efecto de resplandor con blur en los bordes
- **Gradientes**: Fondo con gradiente dark
- **Bordes neon**: Bordes brillantes con transparencia
- **Hover**: Aumenta la opacidad del glow al pasar el mouse
- **Sombras**: Drop shadows en íconos y texto
- **Glassmorphism**: Backdrop blur para efecto de cristal
