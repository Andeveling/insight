# Feature Specification: Learning Path Flow - Roadmap Visual Interactivo

**Feature Branch**: `010-learning-path-flow`  
**Created**: 18 de diciembre de 2025  
**Status**: Draft  
**Input**: User description: "Transformar la vista de módulos de desarrollo en un roadmap visual interactivo estilo Duolingo/Battle Pass usando React Flow, mostrando el progreso del usuario con nodos conectados por paths, indicadores de completado y estados de desbloqueo"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar Roadmap de Desarrollo (Priority: P1)

Un usuario accede a la sección de Desarrollo y en lugar de ver una lista plana de tarjetas, visualiza un camino vertical/serpentino interactivo donde cada módulo es un nodo conectado. Los nodos muestran claramente su estado: completados (verdes con checkmark), en progreso (amarillos con porcentaje), o bloqueados (grises con candado). El usuario puede hacer scroll/zoom para navegar todo el camino.

**Why this priority**: Esta es la funcionalidad core que transforma completamente la experiencia. Sin la visualización de flujo, la feature no existe. Entrega el valor principal de orientación y sensación de progreso.

**Independent Test**: Puede probarse cargando `/dashboard/development` y verificando que los módulos se muestran como nodos conectados en un flujo visual en lugar de una grilla de tarjetas.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con fortalezas configuradas, **When** navega a `/dashboard/development`, **Then** ve un canvas interactivo con nodos conectados representando los módulos disponibles.

2. **Given** el usuario tiene módulos completados, en progreso y no iniciados, **When** ve el roadmap, **Then** cada nodo muestra su estado visual distintivo (completado=verde+check, en progreso=amarillo+%, no iniciado=gris).

3. **Given** el usuario está viendo el roadmap, **When** hace zoom out, **Then** puede ver la vista panorámica de todo su camino de desarrollo con todos los nodos visibles.

4. **Given** el roadmap tiene más nodos de los que caben en pantalla, **When** el usuario hace scroll o drag, **Then** puede navegar fluidamente por todo el camino.

---

### User Story 2 - Interactuar con Nodos de Módulos (Priority: P1)

El usuario puede hacer clic en cualquier nodo del roadmap para ver detalles del módulo. Si el módulo está disponible (no bloqueado), puede iniciarlo directamente desde el modal de preview. Los nodos muestran información contextual como XP, duración estimada y nivel de dificultad.

**Why this priority**: La interactividad es esencial para que el roadmap sea útil y no solo decorativo. Permite al usuario navegar a módulos específicos sin perder el contexto visual del camino.

**Independent Test**: Puede probarse haciendo clic en un nodo del roadmap y verificando que aparece un modal/panel con los detalles del módulo y opciones de acción.

**Acceptance Scenarios**:

1. **Given** el usuario ve el roadmap, **When** hace clic en un nodo de módulo disponible, **Then** aparece un panel lateral o modal con título, descripción, XP, duración y botón "Comenzar/Continuar".

2. **Given** el usuario abre el preview de un módulo en progreso, **When** ve el panel, **Then** muestra el porcentaje completado y botón "Continuar" que navega a `/dashboard/development/[moduleId]`.

3. **Given** el usuario hace clic en un nodo bloqueado, **When** ve el panel, **Then** muestra qué prerrequisito le falta completar para desbloquear el módulo.

4. **Given** el usuario hace hover sobre un nodo, **When** el cursor está sobre el nodo, **Then** ve un tooltip con información resumida (nombre, XP, estado).

---

### User Story 3 - Visualizar Progreso General y Secciones (Priority: P2)

El roadmap organiza los módulos en secciones temáticas (por dominio o fortaleza) con separadores visuales y títulos. El usuario puede ver claramente qué porcentaje de cada sección ha completado y cuántos nodos faltan en cada área.

**Why this priority**: La organización por secciones mejora la navegación y orienta al usuario sobre qué áreas desarrollar. Sin esto, el camino puede sentirse como una lista larga sin estructura.

**Independent Test**: Puede probarse verificando que el roadmap muestra separadores entre dominios/fortalezas con indicadores de progreso por sección.

**Acceptance Scenarios**:

1. **Given** el usuario tiene módulos de múltiples dominios/fortalezas, **When** ve el roadmap, **Then** los módulos están agrupados en secciones con título del dominio/fortaleza.

2. **Given** una sección tiene 5 módulos y el usuario completó 2, **When** ve el separador de sección, **Then** muestra "2/5 completados" o barra de progreso equivalente.

3. **Given** el usuario hace clic en un título de sección, **When** el roadmap responde, **Then** hace zoom/scroll automático para centrar esa sección en pantalla.

---

### User Story 4 - Modo Compacto vs Expandido (Priority: P3)

El usuario puede alternar entre vista "Roadmap" (flujo visual completo) y vista "Lista" (la grilla actual de tarjetas) según su preferencia. La preferencia se guarda para futuras visitas.

**Why this priority**: Algunos usuarios pueden preferir la vista tradicional de lista por familiaridad o accesibilidad. Ofrecer ambas opciones aumenta la adopción.

**Independent Test**: Puede probarse alternando entre vistas con un toggle y verificando que la preferencia persiste al recargar la página.

**Acceptance Scenarios**:

1. **Given** el usuario está en la vista de desarrollo, **When** hace clic en el toggle de vista, **Then** alterna entre "Roadmap" y "Lista".

2. **Given** el usuario selecciona vista "Lista", **When** recarga la página, **Then** la vista se mantiene en "Lista" (preferencia guardada).

3. **Given** el usuario está en vista "Roadmap", **When** cambia a "Lista", **Then** ve la grilla de tarjetas actual con la misma información de progreso.

---

### Edge Cases

- ¿Qué pasa cuando el usuario no tiene ningún módulo disponible? → Mostrar mensaje motivacional y sugerencia de completar fortalezas.
- ¿Cómo manejar si hay demasiados módulos (50+)? → Implementar agrupación colapsable por secciones y lazy loading de nodos.
- ¿Qué ocurre en dispositivos móviles? → El roadmap debe ser responsive con controles touch-friendly para zoom/pan.
- ¿Cómo manejar módulos personalizados vs generales? → Los personalizados aparecen en una sección especial "Para Ti" al inicio del camino.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEBE renderizar módulos como nodos en un canvas interactivo usando React Flow.
- **FR-002**: Cada nodo DEBE mostrar estado visual distintivo (completado, en progreso, no iniciado, bloqueado).
- **FR-003**: Los nodos DEBEN estar conectados por edges que muestran el flujo/orden sugerido de completado.
- **FR-004**: El canvas DEBE soportar zoom (in/out), pan (arrastrar), y fit-to-view.
- **FR-005**: Al hacer clic en un nodo, DEBE mostrar panel con detalles del módulo y acciones disponibles.
- **FR-006**: Los módulos DEBEN organizarse en secciones visuales por dominio o fortaleza.
- **FR-007**: Cada sección DEBE mostrar indicador de progreso (X de Y completados).
- **FR-008**: Sistema DEBE mantener las mismas acciones disponibles que en la vista actual (comenzar, continuar, ver progreso).
- **FR-009**: La visualización DEBE ser responsive y funcional en dispositivos móviles con gestos touch.
- **FR-010**: Sistema DEBE ofrecer toggle para alternar entre vista "Roadmap" y vista "Lista" tradicional.
- **FR-011**: La preferencia de vista DEBE persistir entre sesiones del usuario.

### Key Entities

- **RoadmapNode**: Representación visual de un módulo con posición (x, y), estado, datos del módulo, y conexiones.
- **RoadmapEdge**: Conexión entre nodos que indica flujo/relación de prerequisito.
- **RoadmapSection**: Agrupación de nodos por dominio/fortaleza con metadata de progreso.
- **ViewPreference**: Preferencia del usuario para vista (roadmap | list) almacenada en localStorage o base de datos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los usuarios pueden identificar visualmente su progreso general en menos de 3 segundos al cargar la vista.
- **SC-002**: El tiempo para encontrar y acceder a un módulo específico se reduce comparado con la vista de lista.
- **SC-003**: El 80% de los usuarios pueden navegar el roadmap sin instrucciones previas (intuitividad).
- **SC-004**: La vista de roadmap carga completamente en menos de 2 segundos con 20+ módulos.
- **SC-005**: El engagement con módulos aumenta medido por tasa de inicio de nuevos módulos.
- **SC-006**: La tasa de abandono en la página de desarrollo disminuye (usuarios no se sienten perdidos).

## Assumptions

- Los módulos tienen un orden lógico determinado por el campo `order` existente.
- Los módulos pueden tener prerrequisitos implícitos basados en nivel (beginner → intermediate → advanced).
- La librería `@xyflow/react` ya está instalada y es compatible con el stack actual.
- Los dominios de fortalezas (Hacer, Sentir, Motivar, Pensar, Relacionar) servirán como secciones principales.
- Para MVP, la disposición de nodos será calculada algorítmicamente (no manual).
