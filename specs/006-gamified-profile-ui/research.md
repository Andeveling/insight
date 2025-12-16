# Research: Gamified UI Refresh (Profile + Theme)

## Decision 1: Fuente de datos de progreso (nivel/XP/racha)

**Decision**: Para el “header gamificado” del Profile, el payload inicial se obtendrá en servidor (RSC/server actions) y se calcularán campos derivados (progreso %, XP en nivel) desde `lib/constants/xp-levels`. Para componentes cliente reutilizables, se mantiene el endpoint existente `GET /api/gamification/progress` + `useGamificationProgress`.

**Rationale**:
- El Profile ya está implementado como Server Component que llama server actions; mantener el fetch en servidor evita un round-trip HTTP extra.
- `UserGamification` contiene campos como `currentLevelXp`/`nextLevelXpRequired` que pueden estar desactualizados; el endpoint actual los calcula correctamente, y el server-side puede usar la misma fuente de verdad (`xp-levels`).

**Alternatives considered**:
- Usar solo `GET /api/gamification/progress` desde el Profile → añade latencia y estados de carga; duplica fetch.
- Leer `UserGamification` directo de Prisma y confiar en campos derivados → riesgo de “stale data”.

## Decision 2: Recompensas / Achievements (insignias) para el bloque del Profile

**Decision**: Crear un contrato dedicado para “Achievements Summary” que consulte `UserBadge` + `Badge` en Prisma y devuelva: conteo total desbloqueadas, total de badges activos, y una lista limitada de badges recientes (por defecto 3–6). Se prioriza implementar esto como server action del Profile; opcionalmente se expone como endpoint `GET /api/gamification/achievements` si se necesita consumo cliente.

**Rationale**:
- No existe hoy un endpoint de badges; Profile necesita un bloque de “Recompensas/Logros”.
- Prisma ya contiene la verdad de insignias desbloqueadas; no hay que cambiar DB.
- El contrato permite UI consistente (empty states) y evoluciona sin romper el layout.

**Alternatives considered**:
- Reutilizar únicamente acciones de Development (Feature 004) para badges → acopla Profile a otra feature y mezcla reglas (hay duplicación de lógica de badge progress).
- No mostrar logros (solo progreso) → no cumple FR-002.

## Decision 3: Theme “gamificado” sin hardcode de colores

**Decision**: Introducir tokens CSS adicionales (namespace “gamified”) en `app/globals.css` para superficies y gradientes (hero, cards destacadas, glow). Las nuevas piezas de UI usarán clases semánticas (bg-card, text-foreground, etc.) + `var(--gamified-*)` para gradientes/sombras.

**Rationale**:
- El repo ya usa CSS variables en OKLCH para theme; extender por tokens evita “purple-500” hardcodeado.
- Permite light/dark coherentes y reduce deuda visual.

**Alternatives considered**:
- Usar utilidades Tailwind de color (ej. `bg-purple-500`) → contradice guideline de no hardcodear colores en nuevas piezas.
- Crear un theme paralelo por feature → aumenta complejidad y rompe consistencia.

## Decision 4: Composición de Profile con Cache Components + Suspense

**Decision**: Refactorizar el Profile hacia el patrón de “shell estático + `<Suspense>`” para runtime data (sesión, queries, DNA). La página principal renderiza el contenedor y skeleton; el contenido dinámico vive en un componente interno.

**Rationale**:
- Alinea el módulo con el patrón de Next.js 16 Cache Components definido en el repo.
- Mejora UX en redes lentas y evita pantallas en blanco.

**Alternatives considered**:
- Mantener `page.tsx` como `async` que hace todo → anti-pattern según guía del repo.

## Decision 5: SOLID + feature-first como reglas de diseño interno

**Decision**: Separar responsabilidades en el Profile:
- Server actions: construyen “view models” (progreso + achievements + datos perfil) tipados.
- Componentes: renderizan UI, sin Prisma ni sesiones.
- Cada bloque (header gamificado, rewards, strengths, edit) es independiente.

**Rationale**:
- Reduce acoplamiento y facilita iterar UI (que es el objetivo de esta feature).

**Alternatives considered**:
- Un único componente grande con fetch + render → difícil de testear/iterar, rompe SRP.

## Notes / Risks

- Existe uso previo de clases con colores hardcodeados en algunas áreas del repo. Esta feature evitará introducir nuevos hardcodes y, cuando toque código existente, preferirá tokens semánticos.
- `next-themes` se usa en `components/ui/sonner.tsx`; si no existe provider global, puede requerir corrección para evitar runtime issues (validar durante implementación).
