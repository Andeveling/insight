# Feature Specification: Sistema de Niveles de Madurez para Fortalezas

**Feature Branch**: `012-strength-levels`  
**Created**: 21 de diciembre de 2025  
**Status**: Draft  
**Input**: User description: "Sistema de niveles de madurez para fortalezas con misiones, XP y combos entre fortalezas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar Nivel de Madurez de Fortaleza (Priority: P1)

Un usuario con fortalezas identificadas desde HIGH5 necesita comprender que sus fortalezas no son rasgos estáticos sino habilidades que requieren cultivo. Al acceder a su perfil de fortalezas, el usuario ve el nivel actual de madurez de cada una (Esponja/Inmaduro, Conector/Adepto, Guía/Maduro, Alquimista/Maestro) basado en el Espectro de Uso, con una barra de progreso visual que muestra cuánto XP le falta para el siguiente nivel.

**Why this priority**: Esta es la base conceptual del sistema. Sin la visualización de niveles, el usuario no entiende que existe un sistema de progresión, haciendo que el resto del feature carezca de contexto.

**Independent Test**: Puede testearse creando un usuario con fortalezas y verificando que se muestre el nivel inicial (Esponja) con una barra de progreso en 0% para cada fortaleza.

**Acceptance Scenarios**:

1. **Given** un usuario ha completado el test HIGH5 y tiene 5 fortalezas identificadas, **When** accede a su perfil de fortalezas, **Then** ve cada fortaleza con su nivel actual (Esponja por defecto), una barra de progreso de XP, y el XP actual/necesario para próximo nivel (ej: "120/500 XP")
2. **Given** un usuario tiene una fortaleza con 450 XP (nivel Esponja requiere 500 XP para Conector), **When** visualiza esa fortaleza, **Then** la barra de progreso muestra 90% de llenado y un indicador visual de "próximo a subir de nivel"
3. **Given** un usuario tiene una fortaleza en nivel Maestro (máximo), **When** visualiza esa fortaleza, **Then** ve un badge especial "MAESTRO", sin barra de progreso, y un contador de XP total acumulado

---

### User Story 2 - Completar Misiones Diarias para Ganar XP (Priority: P2)

Un usuario quiere mejorar conscientemente el uso de sus fortalezas. El sistema le presenta 1-3 misiones diarias personalizadas por fortaleza (ej: para Catalizador: "Inicia una conversación necesaria que otros están evitando"). Al completar una misión (marcándola manualmente como completada), gana XP para esa fortaleza específica, con retroalimentación visual inmediata (animación de +XP, actualización de barra).

**Why this priority**: Las misiones son el mecanismo de engagement principal. Sin ellas, el sistema de XP no tiene forma de alimentarse y se convierte en un número estático.

**Independent Test**: Puede testearse asignando misiones a un usuario y verificando que al marcar como completada, se incrementa el XP de la fortaleza correspondiente y se registra la fecha de completitud.

**Acceptance Scenarios**:

1. **Given** un usuario tiene fortalezas identificadas, **When** accede al dashboard en un nuevo día, **Then** ve 1-3 misiones diarias disponibles (una por cada fortaleza activa), cada una con descripción, XP a ganar (+50 XP base), y botón "Completar"
2. **Given** un usuario marca una misión diaria como completada, **When** confirma la acción, **Then** gana el XP especificado, ve una animación de +XP volando hacia la barra de progreso, la barra se actualiza, y la misión desaparece de la lista de pendientes
3. **Given** un usuario completó todas sus misiones del día, **When** regresa al dashboard, **Then** ve un mensaje "Misiones de hoy completadas. Nuevas misiones disponibles mañana" con un contador regresivo
4. **Given** un usuario no completó sus misiones del día anterior, **When** accede al día siguiente, **Then** las misiones anteriores expiran (desaparecen) y se generan nuevas misiones para el día actual

---

### User Story 3 - Enfrentar Boss Battles (Misiones de Sótano) (Priority: P3)

Un usuario con fortalezas en nivel Conector o superior puede acceder a "Boss Battles", misiones especiales que desafían el lado oscuro ("Sótano") de su fortaleza. Por ejemplo, para Solucionador: "Deja que otros resuelvan un problema sin intervenir para ver cómo lo hacen". Estas misiones otorgan 3x XP (+150 XP) pero solo están disponibles 1 vez por semana por fortaleza.

**Why this priority**: Las Boss Battles añaden profundidad al sistema de madurez al introducir el concepto de autoconciencia del lado oscuro. Sin embargo, son opcionales para el funcionamiento básico del sistema.

**Independent Test**: Puede testearse creando un usuario con fortaleza en nivel Conector, verificando que aparezca una Boss Battle disponible, completándola, y verificando el cooldown semanal.

**Acceptance Scenarios**:

1. **Given** un usuario tiene al menos una fortaleza en nivel Conector, **When** accede a la sección de misiones, **Then** ve una sección especial "Boss Battles" con 1 misión disponible por fortaleza elegible, marcada con badge "3x XP"
2. **Given** un usuario completa una Boss Battle, **When** marca como completada, **Then** gana 3x XP (+150 XP), ve una animación especial de "Boss Defeated", y esa misión entra en cooldown de 7 días
3. **Given** un usuario tiene una Boss Battle en cooldown, **When** accede a la sección Boss Battles, **Then** ve la misión bloqueada con contador regresivo "Disponible en 4 días, 12 horas"

---

### User Story 4 - Desbloquear Combo Breakers (Sinergias entre Fortalezas) (Priority: P3)

Un usuario con múltiples fortalezas puede activar "Combos" al usar dos fortalezas simultáneamente en una misión cooperativa. Por ejemplo, Combo "Visión Ejecutora" (Estratega + Catalizador): "Planifica y comienza un proyecto en menos de 24 horas" otorga +100 XP a ambas fortalezas. Los combos se desbloquean automáticamente al tener las fortalezas requeridas en nivel Conector o superior.

**Why this priority**: Los Combo Breakers añaden un layer de gamificación avanzado que incentiva el uso holístico de fortalezas. Son opcionales pero mejoran la retención a largo plazo.

**Independent Test**: Puede testearse creando un usuario con dos fortalezas específicas (ej: Estratega + Catalizador) en nivel Conector, verificando que aparezca el combo disponible, completándolo, y verificando que ambas fortalezas ganen XP.

**Acceptance Scenarios**:

1. **Given** un usuario tiene dos fortalezas compatibles en nivel Conector o superior, **When** accede a la sección de misiones, **Then** ve una sección "Combo Breakers" con combos disponibles listados con nombres épicos, iconos de ambas fortalezas, y descripción de la misión
2. **Given** un usuario completa un Combo Breaker, **When** marca como completado, **Then** ambas fortalezas ganan +100 XP, ve una animación especial de "Combo x2", y el combo entra en cooldown de 72 horas
3. **Given** un usuario tiene 3+ fortalezas en nivel Guía, **When** accede a Combo Breakers, **Then** ve combos avanzados de 3 fortalezas (Triple Combo) que otorgan +200 XP total

---

### User Story 5 - Misiones Cooperativas para Ayudar a Otros (Priority: P4)

Un usuario dentro de un equipo puede aceptar misiones cooperativas que requieren usar su fortaleza para ayudar a un compañero. Por ejemplo, para Empatizador: "Ayuda a un colega estresado a identificar la raíz de su frustración". La misión se completa cuando el compañero confirma la ayuda recibida, otorgando +75 XP al ayudador y +25 XP al ayudado.

**Why this priority**: Las misiones cooperativas añaden un componente social valioso pero requieren que exista un sistema de equipos funcional. Son opcionales para usuarios individuales.

**Independent Test**: Puede testearse creando dos usuarios en un equipo, asignando una misión cooperativa a uno, completándola, y verificando que el otro usuario confirme y ambos ganen XP.

**Acceptance Scenarios**:

1. **Given** un usuario está en un equipo, **When** accede a misiones, **Then** ve una sección "Misiones de Equipo" con misiones cooperativas disponibles, cada una indicando qué compañero puede ayudar
2. **Given** un usuario completa una misión cooperativa, **When** marca como completada, **Then** se envía una notificación al compañero ayudado solicitando confirmación con pregunta "¿[Nombre] te ayudó con [descripción]?"
3. **Given** un compañero confirma la ayuda recibida, **When** acepta la confirmación, **Then** el usuario ayudador gana +75 XP, el ayudado gana +25 XP, y ambos ven una notificación de "Colaboración exitosa"
4. **Given** un compañero rechaza o no confirma en 48 horas, **When** expira el tiempo, **Then** la misión se marca como "No verificada" y se otorga solo +25 XP al ayudador (sin bonus)

---

### Edge Cases

- ¿Qué pasa si un usuario sube de nivel (ej: de Esponja a Conector) mientras tiene misiones activas? → Las misiones actuales se mantienen, pero las nuevas misiones del siguiente día reflejan el nuevo nivel de dificultad.
- ¿Cómo maneja el sistema si un usuario marca todas las misiones como completadas sin realmente hacerlas (gaming del sistema)? → Las misiones cooperativas requieren confirmación externa. Para misiones individuales, se incluye una pregunta de reflexión opcional ("¿Cómo te sentiste al hacerlo?") que no bloquea el XP pero mejora la conciencia.
- ¿Qué sucede si un usuario pierde la racha de misiones diarias? → No hay penalización negativa (no se resta XP). El objetivo es fomentar progreso, no castigar ausencia.
- ¿Puede un usuario "farmear" XP completando solo misiones fáciles y evitando Boss Battles? → Sí, pero el progreso será más lento. Boss Battles y Combos tienen mejor ratio XP/tiempo, incentivando la diversidad de actividades.
- ¿Qué pasa si dos usuarios reclaman la misma misión cooperativa al mismo tiempo? → El sistema asigna misiones cooperativas por par usuario-usuario, no globalmente. Cada usuario tiene su propia instancia de la misión.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEBE asociar cada fortaleza HIGH5 de un usuario con un nivel de madurez (Esponja, Conector, Guía, Alquimista) y un contador de XP acumulado
- **FR-002**: Sistema DEBE calcular el XP necesario para subir de nivel según progresión exponencial: Esponja→Conector (500 XP), Conector→Guía (1500 XP), Guía→Alquimista (5000 XP)
- **FR-003**: Sistema DEBE generar misiones diarias personalizadas (1-3 misiones) para cada fortaleza activa del usuario, renovándose cada 24 horas a las 00:00 UTC
- **FR-004**: Usuario DEBE poder marcar misiones como completadas manualmente, ganando el XP especificado para la fortaleza correspondiente
- **FR-005**: Sistema DEBE actualizar en tiempo real la barra de progreso de XP al completar una misión, mostrando animación de incremento
- **FR-006**: Sistema DEBE desbloquear Boss Battles (misiones de Sótano) para fortalezas en nivel Conector o superior, limitadas a 1 por semana por fortaleza
- **FR-007**: Sistema DEBE otorgar 3x XP (+150 XP base) al completar Boss Battles versus 1x XP (+50 XP base) para misiones diarias
- **FR-008**: Sistema DEBE identificar automáticamente combinaciones de fortalezas elegibles para Combo Breakers según un catálogo predefinido de sinergias (ej: Estratega+Catalizador → Visión Ejecutora)
- **FR-009**: Sistema DEBE otorgar XP a ambas fortalezas participantes en un Combo Breaker (+100 XP cada una)
- **FR-010**: Sistema DEBE implementar cooldowns: Boss Battles (7 días), Combo Breakers (72 horas), Misiones Cooperativas (48 horas para confirmación)
- **FR-011**: Usuario DEBE poder visualizar el historial de misiones completadas con fecha, XP ganado, y tipo de misión
- **FR-012**: Sistema DEBE persistir el progreso de XP y nivel de madurez de cada fortaleza de forma permanente
- **FR-013**: Sistema DEBE notificar al usuario cuando sube de nivel en una fortaleza con un mensaje de celebración y descripción del nuevo nivel desbloqueado
- **FR-014**: Para misiones cooperativas, sistema DEBE enviar solicitud de confirmación al compañero ayudado con timeout de 48 horas
- **FR-015**: Sistema DEBE registrar eventos de gamificación (misión completada, nivel subido, combo activado) para análisis posterior

### Key Entities

- **StrengthMaturityLevel**: Representa el nivel de madurez de una fortaleza específica de un usuario. Atributos: fortaleza HIGH5 (ej: Catalizador), nivel actual (Esponja/Conector/Guía/Alquimista), XP acumulado, fecha de último nivel alcanzado.
- **Quest**: Representa una misión asignable a un usuario. Atributos: tipo (Diaria/Boss Battle/Combo Breaker/Cooperativa), fortaleza(s) objetivo, descripción de la acción, XP a otorgar, estado (Disponible/En Progreso/Completada/Expirada), fecha de expiración.
- **QuestCompletion**: Registro de una misión completada por un usuario. Atributos: misión referenciada, usuario, fecha/hora de completitud, XP ganado, confirmación externa (para cooperativas).
- **ComboBreaker**: Define una sinergia entre 2+ fortalezas. Atributos: nombre del combo, fortalezas requeridas, nivel mínimo requerido, descripción de misión, XP a distribuir, cooldown (en horas).
- **MaturityLevelDefinition**: Catálogo de niveles de madurez del sistema. Atributos: nombre (Esponja/Conector/Guía/Alquimista), descripción del comportamiento típico, XP necesario para alcanzar este nivel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuarios completan en promedio 60% de sus misiones diarias disponibles en los primeros 30 días de uso del sistema
- **SC-002**: Al menos una fortaleza de cada usuario sube de Esponja a Conector dentro de las primeras 2 semanas de uso activo
- **SC-003**: 80% de usuarios que alcanzan nivel Conector en una fortaleza intentan al menos una Boss Battle en los siguientes 7 días
- **SC-004**: Usuarios con 2+ fortalezas compatibles activan al menos 1 Combo Breaker en su primer mes
- **SC-005**: Tasa de retención semanal aumenta en 25% comparado con usuarios sin el sistema de niveles
- **SC-006**: Usuarios en equipos completan al menos 1 misión cooperativa confirmada por mes
- **SC-007**: Tiempo promedio desde login hasta completar primera misión diaria es menor a 3 minutos
- **SC-008**: Usuarios reportan 85% de satisfacción (escala Likert 4-5/5) con la claridad de las descripciones de misiones en encuestas post-uso
