# Feature Specification: Contextual Reports System

**Feature Branch**: `009-contextual-reports`  
**Created**: 17 de diciembre de 2025  
**Status**: Draft  
**Input**: User description: "Refactorizar sistema de reportes para que requieran contexto de progreso del usuario (módulos completados, challenges, XP, hitos) antes de poder generarse. Los reportes individuales deben requerir actividad mínima del usuario. Los reportes de equipo deben requerir que los miembros tengan progreso real. Todo debe estar armónicamente conectado con el sistema de development."

---

## Resumen Ejecutivo

El sistema actual de reportes permite generar informes con un simple clic, sin verificar si existe suficiente contexto para producir un análisis significativo. Esta refactorización conecta armónicamente el sistema de reportes con el módulo de development, estableciendo **umbrales mínimos de progreso** antes de habilitar la generación.

### Problema Actual

1. **Reportes vacíos**: Usuarios generan reportes sin haber completado módulos o challenges
2. **Datos pobres**: Reportes de equipo donde nadie tiene progreso real
3. **Desperdicio de AI**: Tokens de OpenAI usados para generar contenido sin sustancia
4. **Desconexión**: Reports y Development son features aisladas sin comunicación

### Solución Propuesta

Sistema de **"Report Readiness"** que evalúa el contexto disponible y:
- Muestra indicadores de progreso hacia la habilitación del reporte
- Bloquea generación hasta cumplir umbrales mínimos
- Recompensa con XP cuando se desbloquea el acceso a reportes
- Integra datos de development como contexto enriquecido para la IA

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver Estado de Readiness del Reporte Individual (Priority: P1)

Como usuario que quiere generar mi reporte individual, necesito ver claramente qué requisitos me faltan para que el reporte tenga valor, así sé qué completar primero.

**Why this priority**: Es la funcionalidad core - sin esto, los usuarios no entienden por qué no pueden generar el reporte.

**Independent Test**: El usuario puede navegar a `/dashboard/reports/individual` y ver un dashboard de readiness con indicadores claros de progreso, incluso sin haber completado ningún módulo.

**Acceptance Scenarios**:

1. **Given** un usuario sin actividad en development, **When** visita la página de reporte individual, **Then** ve una tarjeta de "Report Readiness" mostrando 0% de progreso y los requisitos faltantes.

2. **Given** un usuario con 2 módulos completados y 50 XP, **When** visita la página de reporte individual, **Then** ve el progreso parcial (ej: "2/3 módulos", "50/100 XP") y qué le falta.

3. **Given** un usuario que cumple todos los requisitos mínimos, **When** visita la página de reporte individual, **Then** ve el botón "Generar Reporte" habilitado con un badge de "✓ Listo".

4. **Given** un usuario sin fortalezas asignadas, **When** visita la página de reporte individual, **Then** ve un mensaje indicando que primero debe completar el assessment.

---

### User Story 2 - Desbloquear y Generar Reporte Individual (Priority: P1)

Como usuario que ha alcanzado los requisitos mínimos, quiero generar mi reporte enriquecido con mis datos de progreso para obtener insights más relevantes.

**Why this priority**: Es el objetivo final - generar reportes con contexto significativo.

**Independent Test**: Usuario que cumple requisitos puede generar reporte y recibe contenido que menciona sus módulos completados y challenges realizados.

**Acceptance Scenarios**:

1. **Given** un usuario que cumple requisitos mínimos (≥3 módulos, ≥100 XP, ≥5 challenges), **When** hace clic en "Generar Reporte", **Then** el reporte incluye sección de "Progreso Demostrado" con los módulos y challenges específicos.

2. **Given** un usuario genera su primer reporte, **When** el reporte se completa exitosamente, **Then** recibe +50 XP bonus y notificación de logro "Primer Insight Desbloqueado".

3. **Given** un usuario que ya tiene un reporte generado, **When** completa 3 módulos adicionales, **Then** ve opción de "Actualizar Reporte" con los nuevos datos.

---

### User Story 3 - Ver Estado de Readiness del Reporte de Equipo (Priority: P2)

Como líder de equipo, necesito ver el estado de preparación del reporte de equipo para saber cuántos miembros necesitan completar su desarrollo antes de generar un análisis útil.

**Why this priority**: Reportes de equipo son secundarios a los individuales pero importantes para líderes.

**Independent Test**: El líder puede ver dashboard con porcentaje de miembros listos y quiénes específicamente necesitan más actividad.

**Acceptance Scenarios**:

1. **Given** un equipo de 5 donde solo 1 tiene progreso, **When** el líder visita `/dashboard/reports/team`, **Then** ve "1/5 miembros listos (20%)" y lista de miembros pendientes.

2. **Given** un equipo donde 4/5 miembros tienen progreso suficiente, **When** el líder visita la página, **Then** ve 80% de readiness y opción de generar reporte parcial o esperar al 100%.

3. **Given** un equipo con todos los miembros listos, **When** el líder visita la página, **Then** ve "Equipo 100% listo" y botón de generar habilitado.

---

### User Story 4 - Generar Reporte de Equipo Contextualizado (Priority: P2)

Como líder de equipo con miembros activos, quiero generar un reporte que analice no solo las fortalezas sino también cómo cada miembro las está desarrollando.

**Why this priority**: Completa el ciclo de reportes de equipo con datos enriquecidos.

**Independent Test**: Líder genera reporte y recibe análisis que incluye patrones de desarrollo del equipo.

**Acceptance Scenarios**:

1. **Given** un equipo con ≥60% de miembros listos, **When** el líder genera el reporte, **Then** el reporte incluye sección "Patrones de Desarrollo del Equipo" con módulos más populares, challenges comunes, etc.

2. **Given** el equipo tiene miembros con diferentes niveles de progreso, **When** se genera el reporte, **Then** incluye sección de "Brechas de Desarrollo" identificando quién necesita más apoyo.

3. **Given** es el primer reporte del equipo, **When** se genera exitosamente, **Then** todos los miembros que cumplían requisitos reciben +25 XP por "Contribución al Reporte de Equipo".

---

### User Story 5 - Dashboard de Reports Unificado (Priority: P3)

Como usuario, quiero ver en un solo lugar el estado de todos mis reportes disponibles (individual y de equipos) con su nivel de readiness.

**Why this priority**: Mejora la experiencia pero no es crítico para la funcionalidad core.

**Independent Test**: Usuario ve página `/dashboard/reports` con tarjetas mostrando readiness de cada tipo de reporte.

**Acceptance Scenarios**:

1. **Given** un usuario miembro de 2 equipos, **When** visita `/dashboard/reports`, **Then** ve 3 tarjetas: "Mi Reporte", "Equipo A", "Equipo B" cada una con su % de readiness.

2. **Given** un usuario sin equipos, **When** visita la página, **Then** ve solo la tarjeta de reporte individual y mensaje invitando a unirse a un equipo.

3. **Given** cualquier tarjeta tiene 100% readiness, **When** el usuario la ve, **Then** tiene badge animado de "¡Listo!" con efecto de brillo.

---

### Edge Cases

- **¿Qué pasa cuando un usuario tiene fortalezas pero 0 actividad en development?**
  - Muestra readiness en 0% pero indica que las fortalezas están ✓, solo falta desarrollo activo.

- **¿Qué pasa si un miembro del equipo pierde progreso (delete account)?**
  - El readiness del equipo se recalcula automáticamente. Si baja del umbral, el reporte existente sigue válido pero no se puede regenerar hasta recuperar el umbral.

- **¿Qué pasa con reportes ya generados sin contexto previo?**
  - Migración: reportes existentes se marcan como "v1 (sin contexto)". Nuevos reportes serán "v2 (contextualizado)" y mostrarán badge indicando la mejora.

- **¿Qué pasa si el usuario cumple requisitos pero el sistema de IA falla?**
  - El estado de readiness no cambia. El usuario puede reintentar. Los XP de desbloqueo solo se otorgan cuando el reporte se genera exitosamente.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Readiness Engine

- **FR-001**: Sistema DEBE calcular "Individual Report Readiness Score" basado en: módulos completados, XP total, challenges completados, días de streak.

- **FR-002**: Sistema DEBE definir umbrales mínimos para reporte individual:
  - ≥3 módulos completados
  - ≥100 XP total
  - ≥5 challenges completados
  - Fortalezas asignadas (del assessment)

- **FR-003**: Sistema DEBE calcular "Team Report Readiness Score" basado en: porcentaje de miembros que cumplen requisitos individuales mínimos.

- **FR-004**: Sistema DEBE definir umbral mínimo para reporte de equipo:
  - ≥60% de miembros con readiness individual ≥50%
  - ≥3 miembros activos en el equipo

- **FR-005**: Sistema DEBE bloquear botón de generación cuando readiness < 100% (individual) o < 60% (equipo).

#### Contextual Report Generation

- **FR-006**: Sistema DEBE incluir en el prompt de IA para reportes individuales:
  - Lista de módulos completados con fechas
  - Lista de challenges completados con tipo
  - Nivel actual y XP total
  - Días de streak actual y máximo
  - Badges desbloqueados

- **FR-007**: Sistema DEBE incluir en el prompt de IA para reportes de equipo:
  - Resumen de progreso por miembro
  - Módulos más completados del equipo
  - Distribución de niveles del equipo
  - Challenges colaborativos completados

- **FR-008**: Reportes generados DEBEN incluir nueva sección "Progreso Demostrado" que liste la evidencia usada.

#### Gamification Integration

- **FR-009**: Sistema DEBE otorgar XP bonus al generar primer reporte:
  - Individual: +50 XP
  - Equipo (para quien genera): +75 XP
  - Equipo (para miembros que contribuyeron): +25 XP

- **FR-010**: Sistema DEBE crear badge "Insight Desbloqueado" (individual) e "Insight de Equipo" (equipo) al generar primer reporte contextualizado.

#### UI/UX

- **FR-011**: Página de reporte DEBE mostrar componente "Readiness Dashboard" con:
  - Barra de progreso circular con porcentaje
  - Lista de requisitos con ✓/✗ por cada uno
  - CTA para completar requisitos faltantes (links a modules)

- **FR-012**: Cuando readiness = 100%, sistema DEBE mostrar animación celebratoria y habilitar botón con efecto destacado.

- **FR-013**: Dashboard principal `/dashboard/reports` DEBE mostrar tarjetas con mini-indicadores de readiness para cada reporte disponible.

### Key Entities

- **ReportReadiness**: Representa el estado de preparación de un reporte
  - Tipo (individual/team)
  - Score (0-100)
  - Requisitos cumplidos (array)
  - Requisitos pendientes (array)
  - Fecha de último cálculo

- **ReportContext**: Datos de progreso incluidos en el reporte
  - Módulos completados
  - Challenges completados
  - XP al momento de generación
  - Nivel al momento de generación
  - Badges al momento de generación

- **ReportVersion**: Diferencia entre reportes v1 (sin contexto) y v2 (contextualizados)
  - Versión del schema
  - Tipo de contexto incluido
  - Fecha de migración

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de reportes nuevos incluyen sección "Progreso Demostrado" con ≥3 items de evidencia.

- **SC-002**: Reducción del 80% en reportes generados sin actividad previa (de X/mes a X*0.2/mes).

- **SC-003**: Usuarios que ven readiness < 100% completan ≥1 módulo adicional en las siguientes 48 horas (tasa de conversión ≥30%).

- **SC-004**: Tiempo promedio desde registro hasta primer reporte individual aumenta de 5 minutos a 7+ días (indicando engagement real).

- **SC-005**: Satisfacción con reportes (si se mide) aumenta al incluir contexto de desarrollo real.

- **SC-006**: 90% de usuarios entienden qué les falta para desbloquear el reporte en ≤10 segundos de ver la página.

---

## Assumptions

- El sistema de gamificación (XP, levels, badges) ya está completamente implementado y funcional.
- Los módulos de development tienen estructura consistente para queries de progreso.
- Los prompts de IA pueden extenderse sin exceder límites de tokens.
- Los usuarios prefieren reportes con sustancia sobre reportes vacíos inmediatos.
- El umbral de 3 módulos/100 XP es alcanzable en 1-2 semanas de uso moderado.

---

## Out of Scope

- Cambios al sistema de assessment (ya completo)
- Nuevos tipos de reportes (solo individual y team)
- Integración con sistemas externos (Slack, email)
- Reportes programados/automáticos (solo on-demand con requisitos)
- Cambios a la estructura de módulos o challenges

---

## Dependencies

- `app/dashboard/development/_actions/get-user-progress.ts` - Para obtener stats de gamificación
- `app/dashboard/development/_actions/get-modules.ts` - Para listar módulos completados
- `lib/services/level-calculator.service.ts` - Para cálculos de nivel
- `lib/services/xp-calculator.service.ts` - Para formateo de XP
- Sistema de badges existente para nuevos badges de "Insight"
