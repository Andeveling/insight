# Feature Specification: Sub-Team Builder & Match Analyzer

**Feature Branch**: `003-subteam-builder`  
**Created**: 13 de diciembre de 2025  
**Status**: Draft  
**Input**: User description: "Sub-Team Builder & Match Analyzer - A sub-team composition tool that allows creating virtual teams and analyzing their strength match for specific project types"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear Sub-Equipo para Proyecto (Priority: P1)

Como líder de equipo, quiero crear un sub-equipo seleccionando miembros de mi equipo principal y definiendo el tipo de proyecto, para poder asignar las personas correctas a iniciativas específicas.

**Why this priority**: Esta es la funcionalidad core del feature. Sin la capacidad de crear sub-equipos, ninguna otra funcionalidad tiene sentido. Permite a los líderes organizar recursos humanos de manera efectiva.

**Independent Test**: Puede probarse completamente creando un sub-equipo con nombre, seleccionando miembros y guardando la configuración. Entrega valor inmediato al permitir documentar composiciones de equipo para proyectos.

**Acceptance Scenarios**:

1. **Given** un usuario está en la vista de su equipo principal con 10 miembros, **When** hace clic en "Crear Sub-Equipo" y completa el formulario con nombre "Lanzamiento Q1", tipo de proyecto "Ejecución" y selecciona 5 miembros, **Then** el sistema guarda el sub-equipo y lo muestra en la lista de sub-equipos activos.

2. **Given** un usuario está creando un sub-equipo, **When** intenta guardarlo sin seleccionar al menos 2 miembros, **Then** el sistema muestra un mensaje indicando que se requieren mínimo 2 miembros.

3. **Given** un usuario ha creado un sub-equipo, **When** regresa a la lista de sub-equipos, **Then** ve el sub-equipo recién creado con su nombre, tipo de proyecto y cantidad de miembros.

---

### User Story 2 - Visualizar Match Score del Sub-Equipo (Priority: P2)

Como líder de equipo, quiero ver una puntuación de compatibilidad calculada automáticamente cuando creo un sub-equipo, para entender qué tan bien se complementan las fortalezas de los miembros seleccionados para el tipo de proyecto.

**Why this priority**: El match score es el diferenciador clave de esta funcionalidad. Sin embargo, se puede crear y usar sub-equipos incluso sin esta métrica. Agrega inteligencia al proceso de selección.

**Independent Test**: Puede probarse seleccionando diferentes combinaciones de miembros y verificando que el score se actualiza en tiempo real, mostrando valores entre 0-100.

**Acceptance Scenarios**:

1. **Given** un usuario está creando un sub-equipo y ha seleccionado un tipo de proyecto, **When** agrega o quita miembros del selector, **Then** el match score se recalcula y actualiza visualmente en menos de 2 segundos.

2. **Given** un sub-equipo tiene un match score calculado, **When** el usuario visualiza el detalle, **Then** ve el puntaje total (0-100) con un desglose por categorías: cobertura de fortalezas, balance de dominios, ajuste cultural y tamaño del equipo.

---

### User Story 3 - Análisis de Brechas de Fortalezas (Priority: P2)

Como líder de equipo, quiero ver qué fortalezas críticas faltan en mi sub-equipo según el tipo de proyecto, para poder tomar decisiones informadas sobre agregar miembros o ajustar el alcance.

**Why this priority**: Complementa el match score con información accionable. Permite entender no solo el "qué" (score) sino el "por qué" y "cómo mejorar".

**Independent Test**: Puede probarse creando un sub-equipo incompleto y verificando que se muestran las fortalezas faltantes específicas para el tipo de proyecto seleccionado.

**Acceptance Scenarios**:

1. **Given** un sub-equipo creado para un proyecto de tipo "Innovación" carece de miembros con fortaleza "Estratega", **When** el usuario ve el análisis de brechas, **Then** el sistema muestra "Fortaleza faltante: Estratega - Recomendado para planificación a largo plazo".

2. **Given** un sub-equipo tiene todas las fortalezas críticas cubiertas, **When** el usuario ve el análisis de brechas, **Then** el sistema muestra "Equipo completo: Todas las fortalezas críticas están representadas".

---

### User Story 4 - Simulador "What-If" (Priority: P3)

Como líder de equipo, quiero poder simular el impacto de intercambiar miembros antes de guardar cambios, para explorar diferentes composiciones sin afectar la configuración actual.

**Why this priority**: Funcionalidad avanzada que mejora la experiencia pero no es esencial para el uso básico. Permite exploración sin consecuencias.

**Independent Test**: Puede probarse intercambiando miembros en modo simulación y verificando que el score original no cambia hasta confirmar.

**Acceptance Scenarios**:

1. **Given** un sub-equipo existente con 5 miembros y un match score de 75, **When** el usuario activa el modo "What-If" e intercambia a María por Juan, **Then** ve el nuevo score proyectado sin que se guarde el cambio.

2. **Given** un usuario está en modo "What-If", **When** hace clic en "Cancelar simulación", **Then** regresa al estado original del sub-equipo sin cambios aplicados.

---

### User Story 5 - Compartir Reporte de Sub-Equipo (Priority: P3)

Como líder de equipo, quiero generar y compartir un reporte del sub-equipo con stakeholders, para comunicar la composición y justificación del equipo asignado al proyecto.

**Why this priority**: Funcionalidad de comunicación que agrega valor pero no es parte del flujo core de creación y análisis.

**Independent Test**: Puede probarse generando un reporte y verificando que contiene información del equipo, match score y análisis de brechas.

**Acceptance Scenarios**:

1. **Given** un sub-equipo guardado con match score calculado, **When** el usuario hace clic en "Generar Reporte", **Then** se genera un documento visual con: nombre del proyecto, miembros con sus fortalezas, match score y recomendaciones.

2. **Given** un reporte generado, **When** el usuario hace clic en "Compartir", **Then** puede copiar un enlace único o descargar el reporte en formato visual.

---

### Edge Cases

- ¿Qué sucede cuando un miembro del sub-equipo es removido del equipo principal? El sistema debe notificar al creador del sub-equipo y actualizar el match score.
- ¿Qué sucede cuando se intenta crear un sub-equipo pero el usuario no tiene permisos de liderazgo en el equipo? Se muestra mensaje de permisos insuficientes.
- ¿Qué sucede si se seleccionan más de 10 miembros? El sistema debe advertir sobre el tamaño grande del equipo (penalización en match score).
- ¿Qué sucede si el equipo principal tiene menos de 3 miembros? No se permite crear sub-equipos, se indica que el equipo es muy pequeño.
- ¿Qué sucede con sub-equipos cuyos proyectos ya terminaron? Permanecen como histórico, marcados como "archivados".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir a usuarios con rol de liderazgo crear sub-equipos a partir de un equipo principal.
- **FR-002**: El sistema DEBE requerir un nombre único y un tipo de proyecto para cada sub-equipo.
- **FR-003**: El sistema DEBE validar que cada sub-equipo tenga entre 2 y 10 miembros.
- **FR-004**: El sistema DEBE calcular un match score (0-100) basado en: cobertura de fortalezas (30%), balance de dominios (25%), ajuste cultural (20%), tamaño óptimo (15%) y penalización por redundancia (10%).
- **FR-005**: El sistema DEBE mostrar análisis de brechas identificando fortalezas críticas faltantes según el tipo de proyecto.
- **FR-006**: El sistema DEBE actualizar el match score en tiempo real mientras el usuario modifica la composición del sub-equipo.
- **FR-007**: El sistema DEBE permitir archivar sub-equipos cuando los proyectos terminan.
- **FR-008**: El sistema DEBE mantener un historial de sub-equipos creados por cada equipo principal.
- **FR-009**: El sistema DEBE soportar los siguientes tipos de proyecto predefinidos: Innovación, Ejecución, Crisis y Crecimiento.
- **FR-010**: El sistema DEBE permitir generar reportes visuales del sub-equipo con su composición y análisis.
- **FR-011**: El sistema DEBE ofrecer un modo "What-If" para simular cambios sin persistirlos.
- **FR-012**: El sistema DEBE notificar a los creadores de sub-equipos cuando un miembro es removido del equipo principal.

### Key Entities

- **Sub-Equipo (SubTeam)**: Representa un grupo temporal de miembros del equipo principal asignados a un proyecto específico. Atributos clave: nombre, descripción, tipo de proyecto, lista de miembros, match score, análisis detallado, creador, fechas de creación/actualización.

- **Perfil de Tipo de Proyecto (ProjectTypeProfile)**: Define las características ideales para cada tipo de iniciativa. Atributos clave: tipo (innovación, ejecución, crisis, crecimiento), nombre, fortalezas ideales, dominios críticos, preferencias culturales, descripción.

- **Análisis de Match**: Resultado calculado que incluye puntaje total, desglose por categorías, fortalezas cubiertas, brechas identificadas y recomendaciones generadas.

## Assumptions

- Los usuarios ya tienen perfiles de fortalezas configurados (ya sea vía HIGH5 o el quiz interno).
- El equipo principal ya existe con miembros que tienen fortalezas asignadas.
- Los tipos de proyecto predefinidos son suficientes para la mayoría de casos de uso (no se requiere personalización inicial).
- El cálculo del match score puede realizarse en el cliente sin necesidad de llamadas adicionales al servidor una vez cargados los datos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los usuarios pueden crear un sub-equipo completo en menos de 3 minutos.
- **SC-002**: El match score se calcula y muestra en menos de 2 segundos después de cada cambio de composición.
- **SC-003**: Al menos 30 sub-equipos son creados por mes por organización después de 3 meses de lanzamiento.
- **SC-004**: 70% de los usuarios encuestados reportan que la herramienta mejoró su proceso de formación de equipos de proyecto.
- **SC-005**: 50% o más de los sub-equipos creados alcanzan un match score de 75 o superior.
- **SC-006**: La tasa de completación del flujo de creación de sub-equipo es mayor al 80% (usuarios que inician vs. que guardan).
