# Feature Specification: Development Module Refactor - Strength-Focused Learning

**Feature Branch**: `007-development-refactor`  
**Created**: 2025-12-15  
**Status**: Draft  
**Input**: User description: "Replanteamiento del módulo de development para orientarlo exclusivamente a las fortalezas del usuario y su perfil profesional. Incluye: 1) Módulos basados únicamente en el top5 de fortalezas del usuario, 2) Dos tipos de módulos: generales (por fortaleza, reutilizables) y personalizados (específicos por usuario), 3) Eliminación de módulos de dominios completos, 4) Restricción del botón actualizar hasta completar módulos previos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceso a Módulos Basados en Fortalezas Personales (Priority: P1)

Como usuario con fortalezas definidas (Top 5), quiero ver módulos de desarrollo que se enfoquen exclusivamente en mis fortalezas identificadas, para poder desarrollar y potenciar lo que ya soy bueno en lugar de trabajar en áreas ajenas a mi perfil.

**Why this priority**: Esta es la funcionalidad core del refactor. Sin fortalezas definidas, el usuario no puede acceder al módulo de desarrollo. Esto asegura que todo el contenido sea relevante y personalizado.

**Independent Test**: Un usuario con Top 5 definido puede acceder al módulo de desarrollo y ver solo contenido relacionado con sus fortalezas específicas.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado sin fortalezas Top 5 definidas, **When** accede al módulo de desarrollo, **Then** ve un mensaje indicando que debe completar su evaluación de fortalezas primero con un enlace directo al assessment.
2. **Given** un usuario con Top 5 definido (ej: Deliverer, Analyst, Focus Expert, Problem Solver, Time Keeper), **When** accede al módulo de desarrollo, **Then** solo ve módulos relacionados con estas 5 fortalezas específicas.
3. **Given** un usuario con Top 5 definido, **When** revisa la lista de módulos, **Then** NO ve módulos de fortalezas que no están en su Top 5 ni módulos de dominios completos.

---

### User Story 2 - Visualización de Módulos Generales por Fortaleza (Priority: P1)

Como usuario, quiero acceder a módulos generales que profundicen en cada una de mis fortalezas Top 5, para entender mejor cómo funciona cada fortaleza y cómo aplicarla en diferentes contextos.

**Why this priority**: Los módulos generales son la base del sistema de aprendizaje y son reutilizables entre usuarios con las mismas fortalezas, optimizando recursos.

**Independent Test**: Un usuario puede ver y acceder a módulos generales correspondientes a cada una de sus fortalezas Top 5.

**Acceptance Scenarios**:

1. **Given** un usuario con la fortaleza "Deliverer" en su Top 5, **When** ve la lista de módulos, **Then** encuentra un módulo general titulado "Fundamentos de Deliverer" o similar.
2. **Given** un usuario que accede a un módulo general, **When** revisa el contenido, **Then** ve material aplicable a cualquier persona con esa fortaleza (no personalizado).
3. **Given** dos usuarios diferentes con la fortaleza "Analyst", **When** ambos acceden al módulo general de Analyst, **Then** ambos ven el mismo contenido.

---

### User Story 3 - Módulos Personalizados Basados en Perfil Profesional (Priority: P2)

Como usuario, quiero recibir módulos personalizados que consideren mi situación profesional actual y mis metas, para recibir guía específica que me ayude a ser la mejor versión de mí mismo en mi contexto particular.

**Why this priority**: La personalización profunda es lo que diferencia esta plataforma, pero requiere que los módulos generales funcionen primero como base.

**Independent Test**: Un usuario puede responder preguntas sobre su situación profesional y recibir contenido personalizado basado en sus respuestas.

**Acceptance Scenarios**:

1. **Given** un usuario que inicia un módulo personalizado, **When** el sistema le pregunta sobre su satisfacción en su rol actual, **Then** el usuario puede indicar su nivel de satisfacción (satisfecho/insatisfecho/neutral).
2. **Given** un usuario que indica insatisfacción con su rol actual, **When** el sistema genera contenido, **Then** incluye guía específica para identificar roles más alineados con sus fortalezas.
3. **Given** un usuario que indica satisfacción con su rol, **When** el sistema genera contenido, **Then** incluye estrategias para potenciar sus fortalezas en su posición actual.
4. **Given** un módulo personalizado generado para Usuario A, **When** Usuario B accede al sistema, **Then** NO puede ver el módulo personalizado de Usuario A.

---

### User Story 4 - Progresión Secuencial de Módulos (Priority: P2)

Como usuario, quiero completar módulos en un orden lógico antes de poder generar nuevos, para asegurar que construyo conocimiento de manera progresiva y no salto etapas importantes.

**Why this priority**: Asegura que los usuarios obtengan el máximo valor al completar contenido antes de solicitar más, evitando acumulación de módulos sin completar.

**Independent Test**: Un usuario debe completar los módulos existentes antes de poder solicitar la generación de nuevos módulos.

**Acceptance Scenarios**:

1. **Given** un usuario con 3 módulos asignados (2 completados, 1 pendiente), **When** intenta generar nuevos módulos, **Then** ve un mensaje indicando que debe completar el módulo pendiente primero.
2. **Given** un usuario con todos sus módulos actuales completados, **When** solicita nuevos módulos, **Then** el sistema genera el siguiente módulo en la secuencia de su desarrollo.
3. **Given** un usuario que acaba de completar un módulo, **When** el sistema evalúa si puede generar nuevo contenido, **Then** verifica el estado de TODOS los módulos asignados, no solo el último.

---

### User Story 5 - Onboarding de Perfil Profesional (Priority: P3)

Como usuario nuevo en el módulo de desarrollo, quiero responder preguntas sobre mi situación profesional actual, para que el sistema pueda personalizar mi experiencia de aprendizaje desde el inicio.

**Why this priority**: Mejora la calidad de la personalización, pero el sistema puede funcionar con valores por defecto inicialmente.

**Independent Test**: Un usuario puede completar un cuestionario inicial de perfil profesional y ver cómo afecta el contenido sugerido.

**Acceptance Scenarios**:

1. **Given** un usuario con Top 5 definido que accede por primera vez al módulo de desarrollo, **When** entra al área de desarrollo, **Then** ve un cuestionario breve de perfil profesional.
2. **Given** un usuario respondiendo el cuestionario, **When** responde a la pregunta "¿Estás feliz en tu rol actual?", **Then** puede seleccionar entre opciones claras (Sí/No/Parcialmente).
3. **Given** un usuario que completa el cuestionario de perfil, **When** sus respuestas se guardan, **Then** el sistema utiliza esta información para generar módulos personalizados.

---

### Edge Cases

- ¿Qué sucede si un usuario actualiza su Top 5 después de tener módulos asignados? Los módulos generales existentes permanecen pero se desactivan los de fortalezas que ya no están en el Top 5, y se generan nuevos para las nuevas fortalezas.
- ¿Qué sucede si un usuario tiene progreso parcial en un módulo que ya no aplica? El progreso se archiva pero no se elimina, y no cuenta para el desbloqueo de nuevos módulos.
- ¿Qué sucede si el sistema no puede generar contenido personalizado? Se muestra un mensaje de error amigable y se sugiere completar módulos generales mientras tanto.
- ¿Qué sucede si un usuario no responde el cuestionario de perfil? El sistema asume valores neutrales y ofrece completar el cuestionario más adelante.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEBE requerir que el usuario tenga su Top 5 de fortalezas definido antes de acceder al módulo de desarrollo.
- **FR-002**: Sistema DEBE mostrar solo módulos relacionados con las fortalezas del Top 5 del usuario.
- **FR-003**: Sistema DEBE diferenciar entre módulos "generales" (por fortaleza, reutilizables) y "personalizados" (específicos por usuario).
- **FR-004**: Sistema DEBE permitir reutilizar módulos generales entre usuarios que comparten la misma fortaleza.
- **FR-005**: Sistema DEBE generar módulos personalizados únicos por usuario, no compartibles.
- **FR-006**: Sistema DEBE bloquear la generación de nuevos módulos hasta que el usuario complete los módulos pendientes.
- **FR-007**: Sistema DEBE eliminar la visualización de módulos de dominios completos (solo fortalezas individuales).
- **FR-008**: Sistema DEBE recopilar información sobre el perfil profesional del usuario para personalización.
- **FR-009**: Sistema DEBE preguntar sobre la satisfacción del usuario con su rol actual.
- **FR-010**: Sistema DEBE adaptar el contenido de módulos personalizados según las respuestas del perfil profesional.
- **FR-011**: Sistema DEBE mantener un orden secuencial de progresión (uno a uno).
- **FR-012**: Sistema DEBE archivar (no eliminar) el progreso de módulos cuando cambia el Top 5 del usuario.

### Key Entities

- **DevelopmentModule**: Representa un módulo de aprendizaje. Atributos clave: tipo (general/personalizado), fortaleza asociada, contenido, requisitos previos, estado.
- **UserProfessionalProfile**: Información del perfil profesional del usuario. Atributos: satisfacción con rol actual, metas profesionales, contexto laboral.
- **ModuleProgress**: Progreso del usuario en un módulo específico. Atributos: usuario, módulo, estado (no iniciado/en progreso/completado), porcentaje, fecha de inicio/completado.
- **GeneralModuleTemplate**: Plantilla de módulo general por fortaleza, reutilizable entre usuarios.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de los usuarios ven únicamente módulos relacionados con sus fortalezas Top 5.
- **SC-002**: Los módulos generales se reutilizan para usuarios con fortalezas compartidas, reduciendo generación de contenido duplicado.
- **SC-003**: Usuarios completan al menos 80% de los módulos que inician (vs. abandono).
- **SC-004**: El tiempo promedio para completar un módulo no excede 20 minutos.
- **SC-005**: 90% de los usuarios completan el cuestionario de perfil profesional en su primera sesión.
- **SC-006**: Los usuarios reportan mayor relevancia del contenido (medible via feedback o encuesta post-módulo).
- **SC-007**: Reducción de 100% en la visualización de módulos de dominios completos (eliminar feature).

## Assumptions

- Los usuarios ya tienen un mecanismo para completar la evaluación de fortalezas y definir su Top 5.
- El sistema de gamificación existente (XP, badges, niveles) se mantiene y funciona con el nuevo esquema de módulos.
- Los módulos generales serán pre-generados o generados bajo demanda la primera vez y luego cacheados.
- La satisfacción del rol se evalúa con 3 niveles: Satisfecho, Parcialmente satisfecho, Insatisfecho.
- El cuestionario de perfil profesional es opcional pero recomendado (el sistema funciona con valores por defecto).
