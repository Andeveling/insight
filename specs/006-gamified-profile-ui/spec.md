# Feature Specification: Gamified UI Refresh (Profile + Theme)

**Feature Branch**: `006-gamified-profile-ui`  
**Created**: December 15, 2025  
**Status**: Draft  
**Input**: User description: "Necesitamos refactorizar la vista y el theme de nuestro proyecto, requerimos tener una UI más gamificada empezando por la vista de profile y queremos parecer más al diseño del diseñador"

## Clarifications

### Session 2025-12-15

- Q: ¿El “Ver todo” de logros a dónde navega? → A: A `/dashboard/development/badges` (galería existente)
- Q: ¿Cómo mostrar XP en el header? → A: XP del nivel actual / XP requerido para el siguiente nivel (+ barra de progreso)
- Q: ¿Cuántos logros recientes se muestran por defecto? → A: 3
- Q: ¿El Profile incluye “Siguiente objetivo”? → A: No (solo recientes + conteo)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver un perfil “tipo juego” con resumen de progreso (Priority: P1)

Como usuario autenticado, al abrir “Mi Perfil” quiero ver un encabezado llamativo y gamificado (identidad + progreso) que me diga de inmediato “dónde estoy” (nivel/XP) y “qué he logrado” (recompensas) sin tener que buscar en varios lugares.

**Why this priority**: El perfil es el “home” de identidad personal. Un resumen visual gamificado aumenta motivación, refuerza hábitos de uso y conecta las acciones (assessment/feedback/desarrollo) con progreso visible.

**Independent Test**: Abrir la vista “Mi Perfil” con un usuario que tenga datos básicos y gamificación activa; validar que se muestra un encabezado gamificado con métricas clave y que el usuario entiende su progreso en menos de 10 segundos.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con datos de progreso disponibles, **When** abre “Mi Perfil”, **Then** ve un encabezado gamificado con (a) nombre/identidad, (b) nivel actual, (c) XP actual (o equivalente), y (d) conteo de recompensas visibles.
2. **Given** un usuario autenticado, **When** abre “Mi Perfil” desde un dispositivo móvil, **Then** el encabezado gamificado se adapta sin perder información clave (nivel/XP/recompensas siguen visibles).

**Clarificación de UI (XP)**:
- El XP se muestra como progreso dentro del nivel: `XP en el nivel actual / XP requerido para el siguiente nivel` y una barra de progreso asociada.

---

### User Story 2 - Explorar fortalezas con una presentación más atractiva (Priority: P1)

Como usuario, quiero ver mis fortalezas (y mi “DNA” si aplica) presentadas de forma clara, moderna y coherente con un estilo gamificado, para sentir “progreso” y “identidad” alrededor de mis fortalezas.

**Why this priority**: Las fortalezas son el núcleo del producto. Mejorar su presentación reduce fricción, mejora comprensión, y hace que el usuario vuelva para revisarlas/compartirlas.

**Independent Test**: Con un usuario que tenga fortalezas, abrir “Mi Perfil” y confirmar que el usuario puede identificar sus top fortalezas y su resumen (DNA/insight) sin necesitar ayuda.

**Acceptance Scenarios**:

1. **Given** un usuario con fortalezas registradas, **When** entra al perfil, **Then** puede ver sus fortalezas principales con jerarquía visual (qué es “top” vs secundario) y descripciones legibles.
2. **Given** un usuario con “DNA” disponible, **When** entra al perfil, **Then** el DNA se presenta como una tarjeta/insight destacable y fácil de entender.
3. **Given** un usuario con fortalezas pero sin “DNA” aún, **When** entra al perfil, **Then** no ve errores; el perfil se mantiene completo y consistente, mostrando una alternativa informativa (por ejemplo, “Tu resumen estará disponible pronto”).

---

### User Story 3 - Ver recompensas y logros recientes desde el perfil (Priority: P2)

Como usuario, quiero ver un bloque de “Recompensas/Logros” dentro de mi perfil para entender qué he desbloqueado recientemente y qué me falta para el siguiente logro.

**Why this priority**: Los logros son el “combustible” del engagement. Hacerlos visibles en el perfil refuerza el bucle de motivación.

**Independent Test**: Con un usuario que tenga al menos 1 recompensa, abrir el perfil y verificar que ve un listado reducido (ej. los más recientes) y un camino claro para ver el detalle completo.

**Acceptance Scenarios**:

1. **Given** un usuario con recompensas/logros, **When** abre “Mi Perfil”, **Then** ve un bloque de logros con al menos: icono, nombre, y estado (desbloqueado).
2. **Given** un usuario sin recompensas aún, **When** abre “Mi Perfil”, **Then** ve un estado vacío motivacional que explica cómo conseguir la primera recompensa.
3. **Given** un usuario que quiere profundizar, **When** selecciona “ver todo” (o equivalente), **Then** accede a una vista/listado completo de logros (o navegación a donde esté el detalle) sin perder el contexto.

	- **Clarificación**: “Ver todo” navega a `/dashboard/development/badges`.

**Clarificación de UI (logros recientes)**:
- El bloque de logros muestra **3** logros recientes por defecto.

**Clarificación de UI (siguiente objetivo)**:
- El Profile **no** muestra “Siguiente objetivo” ni porcentaje hacia el próximo logro.

---

### User Story 4 - Mantener edición de perfil sin perder el estilo gamificado (Priority: P3)

Como usuario, quiero seguir pudiendo editar mis datos del perfil (p. ej., información personal) desde la misma pantalla, pero con una apariencia consistente con la nueva UI.

**Why this priority**: Es una capacidad existente que no debe degradarse. El valor aquí es mantener continuidad funcional mientras se mejora la experiencia.

**Independent Test**: Abrir perfil, iniciar edición, guardar cambios y verificar que el flujo se mantiene funcional y claro.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** abre el panel de edición y guarda cambios válidos, **Then** ve confirmación y los cambios se reflejan en el perfil.
2. **Given** un usuario intenta guardar información inválida, **When** confirma, **Then** ve mensajes claros y el sistema no pierde datos ya ingresados.

### Edge Cases

- Usuario no autenticado → se le redirige a iniciar sesión y no se muestra información del perfil.
- Usuario sin fortalezas → el perfil muestra un mensaje guía para completar el test y no rompe el layout.
- Usuario con fortalezas pero con datos incompletos (sin foto, sin nombre visible, etc.) → se usan valores por defecto razonables sin afectar legibilidad.
- Usuario sin datos de gamificación aún → se muestra un estado “progreso no disponible todavía” sin errores.
- Conexión lenta o fallos temporales → se muestran estados de carga y/o mensajes de error recuperables (sin pantallas en blanco).
- Accesibilidad: navegación por teclado y lectura clara de información crítica (nivel/XP/logros) en todos los estados.

## Requirements *(mandatory)*
### Functional Requirements

- **FR-001**: System MUST present a gamified profile header that includes user identity and progress summary (level and XP or equivalent) when the user opens “Mi Perfil”. The XP MUST be presented as progress within the current level (`currentLevelXp / nextLevelXpRequired`) with a progress bar.
- **FR-002**: System MUST display a rewards/achievements summary block on the profile, including an empty state when no achievements exist. The summary MUST display 3 recent achievements by default.
- **FR-003**: Users MUST be able to view their strengths in a clearly prioritized presentation (e.g., top strengths are visually distinct).
- **FR-004**: System MUST show the user “DNA” insight when available and provide a non-breaking alternative when it is not available.
- **FR-005**: Users MUST be able to edit their profile details from the profile page with clear validation feedback.
- **FR-006**: System MUST keep the profile experience usable on mobile and desktop (responsive layout, no horizontal scrolling for primary content).
- **FR-007**: System MUST support both light and dark appearance without reducing readability of key information.
- **FR-008**: System MUST provide clear loading and error states for the profile, without exposing internal errors to end users.
- **FR-009**: System MUST preserve existing content meaning and user tasks (no loss of currently available profile capabilities).
- **FR-010**: System MUST ensure key profile information (identity, progress, strengths) remains perceivable and operable via keyboard navigation.

### Key Entities *(include if feature involves data)*

- **User Profile**: Datos de identidad y preferencias del usuario mostradas y editables desde el perfil.
- **Strength**: Fortalezas del usuario (incluye ranking/prioridad y descripción visible).
- **User DNA**: Resumen/insight derivado de fortalezas (si está disponible).
- **Gamification Summary**: Resumen de progreso del usuario (nivel, XP, y contadores relevantes).
- **Achievement/Badge**: Recompensas desbloqueadas y su estado.

## Success Criteria *(mandatory)*
### Measurable Outcomes

- **SC-001**: Al menos el 80% de usuarios en pruebas internas puede identificar su nivel y progreso (XP o equivalente) en menos de 10 segundos al entrar al perfil.
- **SC-002**: La tasa de finalización de la tarea “ver mis top fortalezas” (en test guiado) alcanza ≥ 90% sin asistencia.
- **SC-003**: La satisfacción percibida del perfil (encuesta interna corta 1–5) aumenta al menos +1.0 puntos frente a la versión anterior.
- **SC-004**: El perfil mantiene funcionalidad crítica (ver fortalezas / editar perfil) con tasa de error de usuario (bloqueos del flujo) ≤ 2% en pruebas internas.
- **SC-005**: En condiciones de red normal, el contenido principal del perfil es utilizable (no vacío) en ≤ 2 segundos en el 95% de las sesiones de prueba.

## Assumptions

- Existe un diseño de referencia (mockups) que define el estilo gamificado deseado y sirve como fuente de verdad visual.
- Los datos de gamificación (nivel/XP/logros) ya existen o pueden presentarse como “no disponibles” sin romper experiencia.
- La vista de perfil actual ya contiene fortalezas, DNA (si aplica) y edición de perfil, y estas capacidades deben mantenerse.

## Scope / Non-goals

- **In scope**: Refresco visual del theme y de la vista “Mi Perfil” para una experiencia más gamificada y consistente.
- **Out of scope**: Cambios en la lógica de cálculo de XP/niveles/logros; creación de nuevas reglas de gamificación; rediseño completo de todos los módulos (solo se inicia por Profile).

**Clarificación**:
- No se crea una nueva página de logros en esta feature; el CTA “Ver todo” reutiliza la galería existente en `/dashboard/development/badges`.

## Dependencies

- Aprobación del diseño final por parte de producto/diseño.
- Disponibilidad de iconografía/estilo visual para “logros/recompensas”.
