# Feature Specification: Rutas de Desarrollo de Fortalezas (Gamificadas)

**Feature Branch**: `004-strength-pathways`  
**Created**: 14 de diciembre de 2025  
**Status**: Draft  
**Input**: User description: "Sistema de rutas de desarrollo de fortalezas gamificado con módulos de aprendizaje, desafíos semanales, seguimiento de progreso, aprendizaje entre pares y coach de IA que otorga XP e insignias por completar actividades"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar y Comenzar un Módulo de Desarrollo (Priority: P1)

Un usuario con fortalezas identificadas quiere comenzar a desarrollar una de ellas de manera estructurada. Navega a la sección "Desarrollo" en su perfil, explora los módulos disponibles para sus fortalezas principales, y comienza con el módulo de nivel principiante.

**Why this priority**: Esta es la funcionalidad núcleo que proporciona valor inmediato. Sin la capacidad de explorar y comenzar módulos, no hay feature. Es el MVP que permite a los usuarios empezar su viaje de desarrollo.

**Independent Test**: Puede probarse completamente permitiendo al usuario navegar a "Desarrollo", ver módulos categorizados por fortaleza y nivel, y hacer clic en "Comenzar Módulo" para iniciar el contenido de aprendizaje.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con al menos una fortaleza en su perfil, **When** navega a la sección "Desarrollo", **Then** ve una lista de módulos organizados por sus fortalezas principales con indicadores de nivel (Principiante, Intermedio, Avanzado).

2. **Given** el usuario está viendo los módulos disponibles, **When** selecciona un módulo de nivel Principiante, **Then** ve el contenido del módulo con descripción, duración estimada, y un botón "Comenzar Módulo".

3. **Given** el usuario hace clic en "Comenzar Módulo", **When** el sistema registra el inicio, **Then** el usuario ve el contenido en formato legible (Markdown renderizado) y su progreso se marca como "en_progreso".

---

### User Story 2 - Completar Desafíos y Ganar XP (Priority: P1)

Mientras completa un módulo, el usuario encuentra desafíos prácticos que debe completar. Al finalizar un desafío, el sistema le otorga puntos de experiencia (XP) visibles inmediatamente, motivándolo a continuar.

**Why this priority**: Los desafíos y el sistema de XP son el corazón de la gamificación. Sin esto, la feature no tiene el engagement esperado y se convierte en contenido pasivo.

**Independent Test**: Puede probarse mostrando desafíos dentro de un módulo, permitiendo al usuario marcarlos como completados, y verificando que el XP se otorga y muestra correctamente.

**Acceptance Scenarios**:

1. **Given** el usuario está en un módulo activo, **When** llega a un desafío, **Then** ve el título, descripción, tipo de desafío (reflexión/acción/colaboración) y el XP que otorga.

2. **Given** el usuario completa un desafío, **When** marca el desafío como completado, **Then** recibe una notificación visual de "+[X] XP ganados" y su XP total se actualiza en la barra de progreso.

3. **Given** el usuario completa todos los desafíos de un módulo, **When** el sistema calcula el progreso, **Then** el módulo se marca como "completado" y el XP total del módulo se suma al perfil del usuario.

---

### User Story 3 - Visualizar Progreso y Barra de XP (Priority: P1)

El usuario quiere ver su progreso general en el sistema de desarrollo. Accede a un dashboard donde ve su XP total, nivel actual, progreso hacia el siguiente nivel, y un resumen de módulos completados.

**Why this priority**: La visibilidad del progreso es crucial para mantener la motivación. Sin feedback claro sobre avance, los usuarios pierden interés.

**Independent Test**: Puede probarse mostrando un dashboard con métricas de XP, nivel, módulos completados, y desafíos totales realizados.

**Acceptance Scenarios**:

1. **Given** un usuario con progreso en módulos, **When** accede a su dashboard de desarrollo, **Then** ve su XP total, nivel actual, y una barra de progreso hacia el siguiente nivel.

2. **Given** el usuario está en el dashboard, **When** revisa sus estadísticas, **Then** ve el número de módulos completados, desafíos finalizados, e insignias ganadas.

3. **Given** el usuario gana suficiente XP para subir de nivel, **When** alcanza el umbral, **Then** recibe una notificación de "¡Subiste de nivel!" con animación visual.

---

### User Story 4 - Desbloquear Insignias por Logros (Priority: P2)

Al completar hitos específicos (como finalizar un módulo de nivel Avanzado o completar un desafío colaborativo), el usuario desbloquea insignias que se muestran en su perfil público.

**Why this priority**: Las insignias añaden reconocimiento social y motivación extrínseca, pero no son esenciales para el funcionamiento básico del sistema.

**Independent Test**: Puede probarse configurando reglas de insignias, completando las acciones requeridas, y verificando que la insignia se otorga y muestra correctamente.

**Acceptance Scenarios**:

1. **Given** el usuario completa un módulo de nivel Principiante, **When** el sistema valida la finalización, **Then** el usuario desbloquea la insignia "Explorador" y recibe una notificación.

2. **Given** el usuario completa un módulo de nivel Avanzado, **When** el sistema valida la finalización, **Then** el usuario desbloquea la insignia "Maestro" y se muestra en su perfil.

3. **Given** el usuario completa un desafío colaborativo, **When** el sistema registra la colaboración, **Then** el usuario gana XP bonus y avanza hacia la insignia "Aliado".

---

### User Story 5 - Recomendaciones del AI Coach (Priority: P2)

El usuario recibe sugerencias personalizadas del AI Coach basadas en su progreso actual, fortalezas identificadas, y patrones de uso. El coach sugiere módulos específicos o desafíos que ayudarán a alcanzar objetivos de XP o desbloquear insignias.

**Why this priority**: Mejora la experiencia pero no es bloqueante para el uso básico. Añade personalización inteligente pero el usuario puede navegar manualmente.

**Independent Test**: Puede probarse generando recomendaciones basadas en el perfil del usuario y mostrándolas en el dashboard.

**Acceptance Scenarios**:

1. **Given** un usuario con progreso limitado en una fortaleza específica, **When** accede al dashboard, **Then** el AI Coach sugiere módulos relacionados con esa fortaleza con una explicación del por qué.

2. **Given** el usuario está cerca de desbloquear una insignia, **When** revisa las recomendaciones, **Then** el AI Coach le indica qué desafíos completar para obtenerla.

3. **Given** el usuario ha completado varios módulos de un nivel, **When** el AI Coach analiza su progreso, **Then** sugiere avanzar al siguiente nivel con un mensaje motivacional.

---

### User Story 6 - Conectar con Otros Usuarios (Aprendizaje Peer) (Priority: P3)

Los usuarios pueden ver quién más está desarrollando la misma fortaleza, conectarse con ellos, y completar desafíos colaborativos juntos para ganar XP bonus.

**Why this priority**: Añade dimensión social valiosa, pero el sistema funciona completamente sin ella. Es una mejora de engagement a largo plazo.

**Independent Test**: Puede probarse mostrando una lista de usuarios en la misma ruta, permitiendo conexiones, y validando que los desafíos colaborativos otorgan XP correctamente.

**Acceptance Scenarios**:

1. **Given** el usuario está en un módulo específico, **When** accede a la sección "Comunidad", **Then** ve otros usuarios trabajando en la misma fortaleza.

2. **Given** el usuario completa un desafío marcado como "colaborativo" con otro usuario, **When** ambos lo finalizan, **Then** reciben XP bonus y progreso hacia la insignia "Aliado".

3. **Given** el usuario se conecta con otro aprendiz, **When** revisan su progreso mutuo, **Then** pueden ver los módulos completados del otro y compartir reflexiones.

---

### Edge Cases

- ¿Qué sucede si un usuario abandona un módulo a la mitad? El progreso debe guardarse y permitir reanudación sin perder XP ganado.
- ¿Cómo maneja el sistema múltiples usuarios completando el mismo desafío colaborativo al mismo tiempo? Debe evitar duplicación de XP.
- ¿Qué pasa si un usuario intenta comenzar un módulo Avanzado sin haber completado los requisitos? El sistema debe mostrar un mensaje informativo sugiriendo completar niveles previos.
- ¿Cómo se manejan las insignias cuando un usuario completa simultáneamente múltiples requisitos? Deben otorgarse todas de manera consistente.
- ¿Qué sucede si el contenido del módulo no se puede cargar? Debe mostrarse un mensaje de error amigable con opción de reintentar.
- ¿Cómo se comporta el sistema si un usuario no tiene fortalezas identificadas aún? Debe redirigir al assessment o mostrar un mensaje guía.

## Requirements *(mandatory)*

### Functional Requirements

#### Módulos de Desarrollo

- **FR-001**: El sistema DEBE mostrar módulos de desarrollo organizados por fortaleza del usuario.
- **FR-002**: El sistema DEBE categorizar módulos en tres niveles: Principiante, Intermedio y Avanzado.
- **FR-003**: Los usuarios DEBEN poder ver la descripción, duración estimada, y número de desafíos de cada módulo antes de comenzarlo.
- **FR-004**: El sistema DEBE permitir a los usuarios comenzar, pausar, y reanudar módulos en cualquier momento.
- **FR-005**: El sistema DEBE guardar automáticamente el progreso del usuario en cada módulo.
- **FR-006**: El contenido del módulo DEBE mostrarse en formato legible con soporte para texto enriquecido (Markdown).

#### Desafíos y XP

- **FR-007**: El sistema DEBE presentar desafíos dentro de cada módulo con título, descripción, tipo (reflexión/acción/colaboración), y XP asignado.
- **FR-008**: Los usuarios DEBEN poder marcar desafíos como completados.
- **FR-009**: El sistema DEBE otorgar XP inmediatamente al completar un desafío.
- **FR-010**: El sistema DEBE mostrar una notificación visual al otorgar XP indicando la cantidad ganada.
- **FR-011**: Los desafíos de tipo "colaboración" DEBEN otorgar XP bonus (50-100% más que desafíos individuales).
- **FR-012**: El sistema DEBE validar que un desafío no se complete múltiples veces por el mismo usuario.

#### Sistema de Gamificación

- **FR-013**: El sistema DEBE mantener un contador de XP total por usuario.
- **FR-014**: El sistema DEBE calcular y mostrar el nivel actual del usuario basado en su XP total.
- **FR-015**: El sistema DEBE mostrar una barra de progreso visual hacia el siguiente nivel.
- **FR-016**: El sistema DEBE notificar al usuario cuando sube de nivel con una animación o mensaje destacado.
- **FR-017**: El sistema DEBE otorgar insignias automáticamente al completar hitos específicos (completar un nivel de módulo, alcanzar cierto XP, completar desafíos colaborativos).
- **FR-018**: Las insignias DEBEN mostrarse en el perfil del usuario y en su dashboard de desarrollo.

#### Dashboard de Progreso

- **FR-019**: El sistema DEBE proporcionar un dashboard que muestre XP total, nivel actual, módulos completados, y desafíos finalizados.
- **FR-020**: El dashboard DEBE mostrar una visualización del progreso general (ej. mapa de viaje o timeline).
- **FR-021**: Los usuarios DEBEN poder acceder al historial de módulos completados con fechas de finalización.
- **FR-022**: El sistema DEBE mostrar estadísticas de tiempo invertido en desarrollo.

#### AI Coach

- **FR-023**: El sistema DEBE generar recomendaciones personalizadas de módulos basadas en las fortalezas del usuario.
- **FR-024**: El AI Coach DEBE sugerir rutas de desarrollo para alcanzar objetivos de XP específicos.
- **FR-025**: El sistema DEBE identificar insignias cercanas a desbloquearse y sugerir acciones para obtenerlas.
- **FR-026**: Las recomendaciones DEBEN actualizarse dinámicamente conforme el usuario progresa.

#### Aprendizaje entre Pares

- **FR-027**: El sistema DEBE mostrar una lista de usuarios que están desarrollando la misma fortaleza.
- **FR-028**: Los usuarios DEBEN poder ver información pública de otros aprendices (nombre, nivel, módulos completados).
- **FR-029**: El sistema DEBE permitir completar desafíos colaborativos con otros usuarios.
- **FR-030**: El sistema DEBE otorgar XP bonus cuando dos usuarios completan un desafío colaborativo juntos.
- **FR-031**: El sistema DEBE validar que ambos usuarios confirmen la finalización del desafío colaborativo.

#### Requisitos de Interfaz (UI en Español)

- **FR-032**: Toda la interfaz de usuario DEBE estar en español.
- **FR-033**: Los mensajes, notificaciones, y contenido del sistema DEBEN usar lenguaje claro y motivacional.
- **FR-034**: Las animaciones y transiciones DEBEN ser suaves y no invasivas (duración máxima 300ms).
- **FR-035**: El sistema DEBE ser responsive y funcionar correctamente en dispositivos móviles, tablets y desktop.

#### Seguridad y Validación

- **FR-036**: El sistema DEBE validar que el usuario esté autenticado antes de permitir acceso a módulos.
- **FR-037**: El sistema DEBE verificar que el usuario tenga al menos una fortaleza identificada antes de mostrar módulos.
- **FR-038**: El sistema DEBE prevenir manipulación manual de XP o insignias (validación server-side).
- **FR-039**: El sistema DEBE registrar un log de actividades de gamificación para auditoría (otorgamiento de XP, insignias, etc.).

### Key Entities

- **DevelopmentModule**: Representa un módulo de aprendizaje para una fortaleza específica. Atributos: identificador único, fortaleza asociada, nivel (principiante/intermedio/avanzado), título, descripción, contenido educativo, duración estimada, lista de desafíos asociados.

- **Challenge**: Representa un desafío práctico dentro de un módulo. Atributos: identificador único, módulo al que pertenece, título, descripción, tipo (reflexión/acción/colaboración), XP que otorga, insignia opcional asociada.

- **UserProgress**: Rastrea el progreso de un usuario en un módulo específico. Atributos: identificador único, usuario, módulo, estado (no_iniciado/en_progreso/completado), número de desafíos completados, total de desafíos, XP ganado en este módulo, fecha de inicio, fecha de finalización.

- **UserGamification**: Perfil de gamificación del usuario. Atributos: usuario (único), XP total acumulado, nivel actual, lista de insignias ganadas, estadísticas adicionales (módulos completados, desafíos totales, tiempo invertido).

- **Badge**: Representa una insignia que puede ser desbloqueada. Atributos: identificador único, nombre, descripción, imagen/icono, criterios de desbloqueo, tipo (nivel de módulo, colaboración, hito de XP).

- **CollaborativeChallenge**: Registro de desafíos colaborativos completados entre usuarios. Atributos: identificador único, desafío, usuarios participantes, estado de confirmación por cada usuario, XP bonus otorgado, fecha de finalización.

## Dependencies and Assumptions

### Dependencies

- **Sistema de Gamificación Base**: Esta feature requiere la implementación previa o paralela del sistema de XP y Badges (Épica de Gamificación). Sin este sistema, los usuarios no podrán acumular XP ni desbloquear insignias.

- **Sistema de Autenticación**: Requiere que los usuarios estén autenticados para acceder a módulos y guardar progreso.

- **Perfil de Fortalezas**: Los usuarios deben tener al menos una fortaleza identificada (mediante assessment o HIGH5) para ver módulos relevantes.

### Assumptions

- **Contenido de Módulos**: Se asume que el contenido educativo de los módulos estará disponible en formato Markdown al momento del lanzamiento. La creación de este contenido es responsabilidad del equipo de contenido.

- **Estructura de Niveles de XP**: Se asume una estructura de niveles con umbrales de XP predefinidos (ej. Nivel 1: 0-500 XP, Nivel 2: 500-1500 XP, etc.). Los valores específicos serán definidos durante la planificación.

- **Tipos de Insignias**: Se asume un conjunto inicial de 10-15 insignias con criterios claros de desbloqueo. Nuevas insignias pueden agregarse posteriormente.

- **Duración de Módulos**: Se asume que los módulos de nivel Principiante toman entre 60-90 minutos, Intermedio entre 90-120 minutos, y Avanzado entre 120-180 minutos.

- **Límite de Desafíos Colaborativos**: Se asume que un desafío colaborativo puede completarse con un máximo de 2 usuarios simultáneamente en la versión inicial.

- **Frecuencia de Recomendaciones del AI Coach**: Se asume que las recomendaciones se generan cuando el usuario accede al dashboard y se actualizan una vez por día como máximo para optimizar costos de IA.

- **Idioma**: Toda la interfaz y contenido está en español para el mercado objetivo hispanohablante.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos el 45% de los usuarios inicia un módulo de desarrollo dentro del primer mes de uso de la plataforma.
- **SC-002**: El 65% de los usuarios que inician un módulo lo completan dentro de 30 días.
- **SC-003**: Los usuarios activos completan un promedio de 4 o más desafíos por semana.
- **SC-004**: El tiempo promedio para completar un módulo de nivel Principiante es menor a 90 minutos.
- **SC-005**: El 20% de los usuarios alcanzan el nivel intermedio de XP (definido como 1000+ XP) en su primer trimestre.
- **SC-006**: Los desafíos colaborativos representan al menos el 15% de los desafíos completados totales.
- **SC-007**: El 80% de los usuarios reportan que el sistema de XP e insignias aumenta su motivación para continuar el desarrollo.
- **SC-008**: El sistema mantiene un tiempo de respuesta menor a 2 segundos al otorgar XP y actualizar progreso.
- **SC-009**: El 90% de los usuarios entienden cómo ganar XP e insignias sin necesidad de soporte adicional.
- **SC-010**: La tasa de retención de usuarios (regreso después de 7 días) aumenta en un 30% comparado con usuarios sin acceso a módulos de desarrollo.
- **SC-011**: El 50% de los usuarios siguen las recomendaciones del AI Coach al menos una vez por mes.
- **SC-012**: El sistema soporta al menos 500 usuarios completando desafíos simultáneamente sin degradación de rendimiento.
