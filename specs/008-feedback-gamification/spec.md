# Feature Specification: Integración Gamificada del Sistema de Feedback

**Feature Branch**: `008-feedback-gamification`  
**Created**: 15 de diciembre de 2025  
**Status**: Draft  
**Input**: User description: "Necesitamos integrar el módulo de feedback al sistema gamificado para integrarlo como una actividad que da experiencia, debemos ofrecer una experiencia totalmente gamificada e integrada con el sistema actual"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recibir XP inmediatamente al completar feedback (Priority: P1)

Como usuario que completa una solicitud de feedback, quiero ver inmediatamente cuánto XP gané y si subí de nivel o desbloqueé logros, para sentir que mi esfuerzo tiene un impacto directo en mi progreso gamificado.

**Why this priority**: La retroalimentación inmediata es fundamental para el engagement gamificado. Si el usuario completa feedback y no ve recompensa visible, la motivación para futuras interacciones disminuye significativamente.

**Independent Test**: Un usuario completa un cuestionario de feedback (5 preguntas respondidas), envía las respuestas, y el sistema muestra una pantalla de celebración con XP ganado, nivel actual/nuevo, y cualquier logro desbloqueado. Esto puede testearse completamente sin implementar otras historias.

**Acceptance Scenarios**:

1. **Given** un usuario completa las 5 preguntas de feedback, **When** confirma el envío, **Then** ve una pantalla de éxito que muestra: (a) XP ganado por dar feedback, (b) progreso hacia el siguiente nivel con barra visual, (c) notificación de subida de nivel si aplica, (d) logros desbloqueados si aplica.
2. **Given** un usuario completa feedback y sube de nivel, **When** ve la pantalla de éxito, **Then** aparece una animación/modal celebrando el nuevo nivel con detalles del logro.
3. **Given** un usuario completa feedback y desbloquea un logro (ej. "Espejo Generoso" - primera vez dando feedback), **When** ve la pantalla de éxito, **Then** aparece una notificación destacada del nuevo logro con icono y descripción.

---

### User Story 2 - Ver indicadores de XP pendiente antes de dar feedback (Priority: P1)

Como usuario que tiene solicitudes de feedback pendientes, quiero ver cuánto XP puedo ganar si las completo, para motivarme a responderlas y entender el valor de mi participación.

**Why this priority**: La anticipación de recompensa aumenta la tasa de respuesta. Mostrar XP potencial convierte solicitudes pendientes en oportunidades visibles de progreso.

**Independent Test**: Con un usuario que tiene 3 solicitudes pendientes, verificar que en el dashboard de feedback aparece un indicador claro del XP total disponible (ej. "120 XP disponibles") y que cada solicitud individual muestra su recompensa potencial.

**Acceptance Scenarios**:

1. **Given** un usuario con solicitudes de feedback pendientes, **When** abre el dashboard de feedback, **Then** ve un banner/indicador destacado mostrando XP total disponible por completar todas las solicitudes.
2. **Given** un usuario navega por su lista de solicitudes pendientes, **When** ve cada solicitud individual, **Then** cada tarjeta muestra el XP que ganará al completarla (ej. badge "+30 XP").
3. **Given** un usuario sin solicitudes pendientes, **When** abre el dashboard de feedback, **Then** el indicador de XP pendiente no aparece o muestra "0 XP pendientes" sin romper el diseño.

---

### User Story 3 - Recibir XP bonus al generar insights de feedback (Priority: P2)

Como usuario que recibe feedback de múltiples personas, quiero obtener XP adicional cuando el sistema genera mis insights personalizados, para reconocer mi inversión en el proceso completo de mejora personal.

**Why this priority**: Incentiva completar el ciclo completo de feedback (no solo dar, sino también recibir y revisar insights). Es secundario porque el usuario es receptor pasivo aquí.

**Independent Test**: Un usuario solicita feedback a 3 personas, las 3 completan sus respuestas, el sistema genera insights automáticamente y otorga XP bonus. Verificar que el usuario recibe notificación del XP bonus y puede ver el registro en su historial de gamificación.

**Acceptance Scenarios**:

1. **Given** un usuario ha recibido feedback de 3+ personas, **When** el sistema genera sus insights, **Then** el usuario recibe XP bonus automáticamente sin acción manual requerida.
2. **Given** un usuario recibe XP bonus por insights, **When** visita su perfil o historial de XP, **Then** puede ver el registro del bonus con descripción clara (ej. "Bonus por Insights Generados: +50 XP").
3. **Given** un usuario aún no tiene suficiente feedback para generar insights, **When** revisa sus solicitudes, **Then** ve un indicador de progreso hacia el umbral de insights (ej. "2/3 respuestas recibidas - Bonus de 50 XP al completar").

---

### User Story 4 - Racha de participación activa en feedback (Priority: P2)

Como usuario regular del sistema, quiero que mis rachas diarias/semanales se vean reforzadas al dar feedback, para mantener mi compromiso constante con el crecimiento del equipo.

**Why this priority**: Las rachas impulsan hábitos a largo plazo. Vincular feedback con racha existente aumenta el valor percibido de cada interacción.

**Independent Test**: Un usuario con racha activa de 5 días da feedback un día, no da feedback al día siguiente. Verificar que el día que dio feedback cuenta para mantener la racha, y el día sin actividad rompe la racha o la pone en riesgo.

**Acceptance Scenarios**:

1. **Given** un usuario con racha activa, **When** completa una solicitud de feedback en un día, **Then** ese día cuenta como día activo para la racha y el sistema aplica multiplicador de racha al XP ganado.
2. **Given** un usuario sin actividad de feedback en 24h, **When** su racha está en riesgo, **Then** recibe notificación/recordatorio de que puede mantener su racha completando una solicitud pendiente si tiene alguna disponible.
3. **Given** un usuario completa feedback con racha activa de 7+ días, **When** gana XP, **Then** ve claramente el bonus de racha aplicado (ej. "30 XP base + 9 XP bonus racha (x1.3) = 39 XP total").

---

### User Story 5 - Visualización de historial de XP por feedback (Priority: P3)

Como usuario que participa regularmente en feedback, quiero ver un historial detallado de todo el XP ganado por actividades de feedback, para entender mi contribución histórica y patrones de participación.

**Why this priority**: Es valioso para usuarios comprometidos pero no crítico para el MVP. Mejora transparencia y permite reflexión personal sobre hábitos.

**Independent Test**: Con un usuario que ha completado 10+ solicitudes de feedback en el pasado, abrir la vista de historial de feedback y verificar que muestra todas las transacciones de XP relacionadas con feedback con fechas, cantidades y contexto.

**Acceptance Scenarios**:

1. **Given** un usuario accede a su historial de feedback, **When** navega a la sección de XP, **Then** ve una lista cronológica de todas las ganancias de XP relacionadas con feedback (dado, recibido, insights, bonus).
2. **Given** un usuario filtra su historial, **When** selecciona "solo feedback", **Then** la vista muestra únicamente transacciones de XP de feedback y oculta otras fuentes (módulos, desafíos, etc.).
3. **Given** un usuario exporta su historial, **When** selecciona exportar datos, **Then** el archivo descargado incluye todas las transacciones de XP con timestamps y descripciones legibles.

---

### User Story 6 - Logros específicos de feedback con progreso visible (Priority: P2)

Como usuario que da feedback regularmente, quiero ver logros específicos de feedback con progreso claro hacia su desbloqueo, para tener metas concretas que alcanzar en esta área.

**Why this priority**: Los logros específicos crean mini-metas que guían comportamiento. Son especialmente efectivos para usuarios orientados a completar colecciones.

**Independent Test**: Un usuario que nunca ha dado feedback completa su primera solicitud y desbloquea "Espejo Generoso". Luego, al dar 5 feedback más, desbloquea el siguiente logro de la cadena. Verificar que ambos desbloqueos son visibles con animaciones y se registran correctamente.

**Acceptance Scenarios**:

1. **Given** un usuario visualiza logros relacionados con feedback, **When** abre la galería de logros, **Then** ve al menos 3 logros de feedback con indicadores claros de progreso (ej. "3/10 feedback completados para 'Consejero Experto'").
2. **Given** un usuario desbloquea un logro de feedback, **When** completa la acción que lo desbloquea, **Then** ve una celebración visual inmediata (modal/toast) y el logro aparece marcado en su perfil.
3. **Given** un usuario sin logros de feedback desbloqueados, **When** ve la galería de logros, **Then** los logros relacionados con feedback están visibles pero bloqueados, con descripción de cómo desbloquearlos (ej. "Completa tu primer feedback").

---

### User Story 7 - Incentivos visuales en solicitudes sin responder (Priority: P3)

Como usuario que recibe solicitudes de feedback, quiero ver elementos visuales gamificados (XP, iconos, barras de progreso) directamente en las tarjetas de solicitudes, para hacer más atractiva la acción de responder.

**Why this priority**: Reduce fricción cognitiva al tomar decisión de participar. Es complementario pero no crítico si ya existe el indicador de XP pendiente general.

**Independent Test**: Con 5 solicitudes pendientes, verificar que cada tarjeta tiene elementos gamificados consistentes (ej. icono de moneda XP, barra de rareza, estado visual de urgencia si aplica).

**Acceptance Scenarios**:

1. **Given** un usuario visualiza sus solicitudes pendientes, **When** ve cada tarjeta de solicitud, **Then** cada una tiene: (a) badge de XP potencial, (b) indicador visual de urgencia si está cerca de expirar, (c) icono de racha si aplica bonus.
2. **Given** un usuario con solicitudes de diferentes urgencias, **When** las ordena por prioridad, **Then** las solicitudes más urgentes (cerca de expirar o con bonus temporal) aparecen primero con estilos visuales distintivos.
3. **Given** un usuario interactúa con una solicitud gamificada, **When** hace hover o click, **Then** ve un preview del XP desglosado (base + bonus racha + bonus insights futuros si aplica).

---

### Edge Cases

- **Usuario sin datos de gamificación**: Si un usuario nunca activó gamificación, las solicitudes de feedback funcionan normalmente pero no muestran indicadores de XP; se muestra un call-to-action para activar gamificación.
- **Solicitud expirada**: Si una solicitud de feedback expira sin respuesta, el usuario pierde el XP potencial y esto se refleja visualmente (XP tachado o marcado como "perdido").
- **Intentos múltiples de otorgar XP**: El sistema previene duplicación de XP por la misma solicitud mediante checks de idempotencia basados en el estado `COMPLETED` de `FeedbackRequest`.
- **Desconexión durante envío**: Si el usuario pierde conexión al enviar feedback, el sistema reintenta el envío y otorga XP solo una vez al confirmar éxito.
- **Generación de insights fallida**: Si el proceso de generación de insights falla, el usuario no recibe el bonus de XP pero recibe notificación del error sin perder XP ya ganado por dar feedback.
- **Cambios de nivel durante feedback**: Si el usuario sube de nivel exactamente al dar feedback, la celebración de nivel nuevo toma prioridad visual sobre la notificación estándar de XP ganado.
- **Feedback con racha rota**: Si un usuario da feedback el mismo día que su racha se rompe, no recibe bonus de racha pero sí el XP base; el sistema le notifica que puede reiniciar su racha con esta acción.
- **Múltiples logros simultáneos**: Si un usuario desbloquea múltiples logros con una sola acción de feedback (ej. "Primera vez" + "10 feedback"), ambos se muestran en secuencia sin sobreponerse.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE otorgar XP inmediatamente cuando un usuario completa exitosamente una solicitud de feedback (todas las preguntas respondidas y enviadas).
- **FR-002**: El sistema DEBE mostrar una pantalla de éxito/celebración al completar feedback que incluya: XP ganado, progreso de nivel con barra visual, indicación de subida de nivel si aplica, y logros desbloqueados si aplica.
- **FR-003**: El dashboard de feedback DEBE mostrar un indicador destacado del total de XP disponible por completar todas las solicitudes pendientes del usuario.
- **FR-004**: Cada solicitud de feedback pendiente DEBE mostrar visiblemente cuánto XP otorgará al completarse.
- **FR-005**: El sistema DEBE prevenir otorgar XP duplicado por la misma solicitud de feedback mediante verificación de estado `COMPLETED` en `FeedbackRequest`.
- **FR-006**: El sistema DEBE otorgar XP bonus automáticamente cuando se generan insights de feedback para un usuario (después de recibir 3+ respuestas).
- **FR-007**: El sistema DEBE aplicar multiplicador de racha al XP ganado por feedback si el usuario tiene una racha activa al momento de completar la solicitud.
- **FR-008**: El sistema DEBE contar la actividad de dar feedback como acción válida para mantener/extender la racha diaria del usuario.
- **FR-009**: El sistema DEBE registrar todas las transacciones de XP relacionadas con feedback con timestamps, fuente (feedback_given, feedback_insights, etc.) y contexto.
- **FR-010**: El sistema DEBE verificar desbloqueo de logros específicos de feedback inmediatamente después de otorgar XP (ej. "Espejo Generoso" al primer feedback).
- **FR-011**: El sistema DEBE mostrar logros relacionados con feedback en la galería de logros con indicadores de progreso (ej. "5/10 feedback completados").
- **FR-012**: El sistema DEBE mostrar animaciones/modales de celebración al desbloquear logros de feedback, sin interrumpir el flujo de navegación principal.
- **FR-013**: El dashboard de feedback DEBE adaptar su visualización si el usuario no tiene gamificación activa, mostrando call-to-action para activarla en lugar de indicadores de XP.
- **FR-014**: Las solicitudes de feedback DEBE incluir elementos visuales gamificados: badge de XP, indicador de urgencia si expira pronto, icono de bonus de racha si aplica.
- **FR-015**: El sistema DEBE ordenar solicitudes pendientes por prioridad gamificada: urgentes (cerca de expirar) primero, luego por XP potencial más alto.

### Key Entities

- **UserGamification**: Entidad existente que almacena XP, nivel, racha y estadísticas del usuario. Se actualiza con cada transacción de feedback.
- **FeedbackRequest**: Entidad existente que representa solicitudes de feedback entre usuarios. Campo `status` (`PENDING`, `COMPLETED`, `EXPIRED`) controla idempotencia de XP.
- **Badge**: Entidad existente de logros. Se crean badges específicos para hitos de feedback (primer feedback, 10 feedback, 50 feedback, etc.).
- **UserBadge**: Relación many-to-many que registra qué logros ha desbloqueado cada usuario, incluyendo timestamp de desbloqueo.
- **FeedbackSummary**: Entidad existente que almacena insights generados. Su creación exitosa dispara el bonus de XP por insights.
- **XP Transaction Log** (implícito): Registro de todas las transacciones de XP con fuente, cantidad, timestamp y metadata (racha, bonus, etc.).

### Non-Functional Requirements

- **NFR-001**: Las transacciones de XP DEBEN completarse en menos de 500ms para mantener la sensación de inmediatez.
- **NFR-002**: Las animaciones de celebración (nivel, logros) DEBEN durar máximo 3 segundos para no interrumpir el flujo del usuario.
- **NFR-003**: El sistema DEBE manejar idempotencia de XP con verificaciones a nivel de base de datos para prevenir race conditions.
- **NFR-004**: Las notificaciones de XP/logros DEBEN ser persistentes: si el usuario cierra el navegador antes de verlas, se muestran en su próxima sesión.
- **NFR-005**: El cálculo de bonus de racha y multiplicadores DEBE ser consistente con el resto del sistema gamificado (usar misma lógica que módulos y desafíos).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 80% de usuarios que completan una solicitud de feedback ven la pantalla de celebración de XP en menos de 1 segundo después de enviar.
- **SC-002**: La tasa de respuesta a solicitudes de feedback aumenta en 40% después de implementar indicadores de XP pendiente.
- **SC-003**: El 95% de usuarios entienden cuánto XP ganaron por dar feedback sin necesidad de buscar en otra sección (medido por encuestas post-acción).
- **SC-004**: El tiempo promedio para completar una solicitud de feedback disminuye en 25% al hacer el proceso más atractivo visualmente.
- **SC-005**: El 90% de usuarios con racha activa que dan feedback reportan que el bonus de racha fue claramente visible en la notificación de XP.
- **SC-006**: Cero casos de XP duplicado por la misma solicitud en producción después del primer mes (idempotencia 100% efectiva).
- **SC-007**: El 70% de usuarios que reciben insights de feedback notan el bonus de XP y lo asocian correctamente con la generación de insights (medido por awareness en encuestas).
- **SC-008**: El engagement con logros de feedback aumenta en 50% medido por usuarios que visualizan la galería de logros al menos una vez por semana.

## Assumptions *(mandatory)*

- **ASMP-001**: Los usuarios ya tienen familiaridad con el sistema de gamificación base (XP, niveles, rachas) de módulos y desafíos.
- **ASMP-002**: El sistema actual de feedback (`FeedbackRequest`, `FeedbackResponse`) funciona correctamente y es estable.
- **ASMP-003**: Los usuarios tienen gamificación activa por defecto; usuarios sin gamificación son casos edge.
- **ASMP-004**: Las recompensas de XP por feedback son suficientemente atractivas: 30 XP por dar feedback, 50 XP bonus por insights generados (valores estándar basados en esfuerzo requerido).
- **ASMP-005**: La generación de insights requiere mínimo 3 respuestas de feedback; esto no cambia con esta feature.
- **ASMP-006**: Los logros de feedback siguen la misma estructura visual y UX que logros de módulos (hexágonos, animaciones, etc.).
- **ASMP-007**: El flujo de dar feedback (navegación, formulario, envío) no requiere cambios sustanciales; solo se añaden capas visuales gamificadas.
- **ASMP-008**: Los usuarios pueden tener múltiples solicitudes pendientes simultáneamente; no hay límite de solicitudes activas.

## Dependencies *(mandatory)*

- **DEP-001**: Feature 005 (Gamification Integration) - El sistema de gamificación base debe estar operativo con XP, niveles, rachas y logros funcionando.
- **DEP-002**: Feature 001 (Peer Feedback) - El flujo completo de solicitudes de feedback debe estar implementado y estable.
- **DEP-003**: Gamification Service (`/lib/services/gamification.service`) - Funciones `awardXp()` y `checkBadgeUnlocks()` deben soportar fuentes de feedback.
- **DEP-004**: Feedback constants - Archivo de constantes para recompensas de XP (`FEEDBACK_XP_REWARDS`) debe existir o crearse.
- **DEP-005**: Badge definitions - Los logros específicos de feedback ("Espejo Generoso", "Consejero", "Mentor", etc.) deben estar definidos en la base de datos.
- **DEP-006**: Notification system - Sistema de notificaciones (toasts/modals) debe soportar mostrar XP, niveles y logros con animaciones.

## Out of Scope *(mandatory)*

- **OOS-001**: Sistema de recompensas tangibles (puntos canjeables por premios físicos) - solo XP virtual.
- **OOS-002**: Gamificación de solicitudes de feedback salientes (XP por pedir feedback) - solo se gamifica dar y recibir feedback.
- **OOS-003**: Leaderboards de feedback (comparación entre usuarios) - no se incluyen tablas de posiciones.
- **OOS-004**: Notificaciones push móviles para recordar feedback pendiente - solo notificaciones in-app.
- **OOS-005**: Sistema de penalización por no responder feedback (pérdida de XP o racha) - solo se pierden oportunidades, no hay castigos activos.
- **OOS-006**: Personalización de cantidad de XP por feedback (usuarios power-up) - valores son fijos para todos.
- **OOS-007**: Integración con sistemas externos de reconocimiento (Slack badges, Teams achievements) - solo interno a Insight.
- **OOS-008**: Gamificación de calidad de feedback (XP extra por respuestas detalladas) - XP es fijo independiente de longitud/detalle.
- **OOS-009**: Sistema de "amigos" o conexiones sociales para comparar progreso en feedback - no hay features sociales comparativas.
- **OOS-010**: Logros colaborativos de equipo por feedback (ej. "equipo dio 100 feedback colectivos") - solo logros individuales.

## Risk Assessment *(optional)*

### High Risk

- **RISK-001**: **Race conditions en otorgamiento de XP**: Si múltiples procesos intentan otorgar XP por la misma solicitud simultáneamente, podría duplicarse XP.
  - *Mitigation*: Usar transacciones de base de datos atómicas con verificación de estado `COMPLETED` como lock optimista.

- **RISK-002**: **Abuso del sistema (farming de XP)**: Usuarios podrían intentar crear solicitudes falsas para ganar XP rápidamente.
  - *Mitigation*: Limitar solicitudes de feedback a miembros del mismo equipo, agregar cooldowns entre solicitudes al mismo usuario (ej. 1 solicitud por par de usuarios cada 7 días).

### Medium Risk

- **RISK-003**: **Desincentivo si XP es muy bajo**: Si los usuarios perciben que el XP por feedback no vale el esfuerzo (5 preguntas = 30 XP), la gamificación podría no motivar.
  - *Mitigation*: Validar valores de XP con usuarios beta; ajustar basado en tiempo promedio de completar feedback vs XP de otras actividades.

- **RISK-004**: **Saturación de notificaciones**: Usuarios con múltiples solicitudes pendientes podrían sentirse abrumados por recordatorios de XP disponible.
  - *Mitigation*: Agrupar notificaciones de XP pendiente (máximo 1 recordatorio diario), permitir desactivar recordatorios sin desactivar gamificación.

### Low Risk

- **RISK-005**: **Inconsistencia visual con otros módulos gamificados**: Si los estilos de feedback no coinciden con módulos/desafíos, la experiencia se siente fragmentada.
  - *Mitigation*: Usar componentes compartidos de UI gamificada (`XpGainToast`, `LevelUpNotification`, `BadgeUnlockModal`), seguir design system estrictamente.

## Technical Constraints *(optional)*

- **TC-001**: El sistema debe mantener compatibilidad con el esquema de base de datos existente de Prisma; no se permiten cambios breaking en modelos `User`, `FeedbackRequest`, `UserGamification`.
- **TC-002**: Las queries de XP y logros deben optimizarse para no agregar más de 100ms de latencia al flujo de envío de feedback.
- **TC-003**: El frontend debe soportar progressive enhancement: si JavaScript falla, el feedback debe poderse enviar sin gamificación visible pero con XP otorgado en backend.
- **TC-004**: Los bonus de racha deben calcularse server-side para prevenir manipulación client-side (seguridad de integridad de datos).
- **TC-005**: El sistema debe funcionar con SQLite (Turso) y su limitación de transacciones concurrentes; diseñar para minimizar contención de locks.
