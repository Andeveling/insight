# Quickstart — 006 Gamified Profile UI

## Prerrequisitos

- Bun instalado
- Variables de entorno configuradas (DB/Auth) según `docs/ENVIRONMENTS.md`

## Ejecutar en local

- Instalar deps: `bun install`
- Levantar dev: `bun dev`

## Verificación manual (aceptación)

1. Ir a `Dashboard → Profile`.
2. Verificar que el header muestra:
   - Nombre / email del usuario
   - Progreso (nivel, `XP en el nivel / XP requerido`, barra de progreso)
   - Racha (streak) y multiplicador si aplica
3. Verificar bloque de logros (achievements):
   - Muestra **3** badges recientes o un empty-state motivacional
   - Los textos están en español y tono “positive psychology”
   - No aparece “Siguiente objetivo” (ni % hacia próximo logro)
   - El CTA “Ver todo” navega a `/dashboard/development/badges`
4. Dark mode:
   - Alternar tema (si existe toggle en la app) y confirmar contraste legible.
   - Confirmar que no hay colores hardcodeados que rompan el tema.

## Validación técnica

- Typecheck/build/lint (según scripts del repo):
  - `bun run lint`
  - `bun run build`

## Notas

- El contrato existente `GET /api/gamification/progress` está documentado en `contracts/openapi.yaml`.
- Si se implementa `GET /api/gamification/achievements`, mantenerlo opcional: el Profile puede renderizar logros vía server actions/RSC.
