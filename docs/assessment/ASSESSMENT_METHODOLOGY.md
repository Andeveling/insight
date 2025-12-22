# Metodología de Assessment de Fortalezas Insight

## 📋 Índice

1. [Visión General](#visión-general)
2. [Fundamentos Teóricos](#fundamentos-teóricos)
3. [Arquitectura del Assessment](#arquitectura-del-assessment)
4. [Phase 1: Domain Discovery](#phase-1-domain-discovery)
5. [Phase 2: Strength Refinement](#phase-2-strength-refinement)
6. [Phase 3: Ranking Confirmation](#phase-3-ranking-confirmation)
7. [Phase 4: Heroic Calibration](#phase-4-heroic-calibration)
8. [Sistema de Scoring](#sistema-de-scoring)
9. [Validez Psicométrica](#validez-psicométrica)
10. [Implementación Técnica](#implementación-técnica)

---

## Visión General

El **Assessment de Fortalezas Insight** es una evaluación psicométrica de 4 fases diseñada para identificar las **Top 5 fortalezas personales** de un individuo y determinar su **nivel de madurez** en la aplicación de cada fortaleza.

### Características Principales

- **70 preguntas totales** distribuidas en 4 fases progresivas
- **20 fortalezas únicas** organizadas en 4 dominios
- **Evaluación de madurez** (Raw/Sponge vs. Mature/Guide)
- **Filtrado adaptativo** basado en respuestas previas
- **Metodología científica** inspirada en CliftonStrengths y High5Test

### Objetivos

1. **Identificar fortalezas dominantes** con alta precisión
2. **Medir nivel de madurez** en la expresión de cada fortaleza
3. **Minimizar sesgo** de deseabilidad social y aquiescencia
4. **Proporcionar insights accionables** para desarrollo personal

---

## Fundamentos Teóricos

### Marco Conceptual

Nuestra metodología se basa en tres pilares de la psicología positiva:

#### 1. **Gallup CliftonStrengths®**
- Enfoque en talentos naturales vs. debilidades
- Clasificación por dominios de talento
- Medición basada en patrones conductuales recurrentes

#### 2. **High5Test**
- Identificación de fortalezas sin sesgo cultural
- Enfoque en comportamientos observables
- Validación cruzada de resultados

#### 3. **Psicología Positiva (Seligman)**
- Fortalezas como virtudes en acción
- Desarrollo basado en fortalezas vs. corrección de debilidades
- Bienestar a través del uso óptimo de talentos

### Modelo de 4 Dominios

```
┌─────────────────────────────────────────────────────────┐
│                    DOMINIOS DE FORTALEZA                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔴 DOING (Ejecución)        🔵 THINKING (Cognición)   │
│  · Time Keeper               · Thinker                  │
│  · Problem Solver            · Analyst                  │
│  · Focus Expert              · Brainstormer             │
│  · Deliverer                 · Strategist               │
│  · Believer                  · Philomath                │
│                                                         │
│  🟡 FEELING (Relacional)     🟢 MOTIVATING (Impulso)   │
│  · Peace Keeper              · Self-Believer            │
│  · Optimist                  · Catalyst                 │
│  · Chameleon                 · Winner                   │
│  · Empathizer                · Commander                │
│  · Coach                     · Storyteller              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Teoría de Madurez de Fortalezas

Cada fortaleza puede expresarse en dos niveles:

**🌱 RAW (Cruda/Reactiva)** → **Sponge** (Esponja)
- Expresión instintiva e impulsiva
- Foco en beneficio inmediato personal
- Menor consciencia del contexto
- Tendencia reactiva ante estímulos

**🌟 MATURE (Madura/Proactiva)** → **Guide** (Guía)
- Aplicación estratégica y consciente
- Balance entre necesidades propias y del equipo
- Alta consciencia contextual
- Enfoque proactivo y sostenible

---

## Arquitectura del Assessment

### Flujo Completo

```
Phase 1: Domain Discovery (20 preguntas SCALE)
    ↓
Cálculo de scores por dominio
    ↓
Phase 2: Strength Refinement (30 preguntas CHOICE)
    ↓ [Filtrado: solo dominios top de Phase 1]
Cálculo de scores por fortaleza
    ↓
Phase 3: Ranking Confirmation (10 preguntas RANKING)
    ↓
Identificación de Top 5 fortalezas
    ↓
Phase 4: Heroic Calibration (5 preguntas SCENARIO)
    ↓ [Filtrado: solo Top 5 fortalezas]
Cálculo de madurez (Raw vs Mature)
    ↓
RESULTADO FINAL:
- Top 5 Strengths
- Maturity Level por fortaleza
- Perfil de dominio
```

### Principios de Diseño

1. **Progresión Adaptativa**: Cada fase filtra según resultados previos
2. **Validación Cruzada**: Múltiples mediciones de cada constructo
3. **Minimización de Sesgo**: Sin etiquetas de fortalezas visibles hasta el final
4. **Foco Conductual**: Preguntas basadas en comportamientos, no autopercepciones
5. **Balance de Opciones**: Todas las alternativas son válidas y defendibles

---

## Phase 1: Domain Discovery

### Objetivo
Identificar los **2-3 dominios dominantes** mediante medición de afinidad natural hacia patrones conductuales.

### Formato
- **20 preguntas SCALE** (escala Likert 1-5)
- **5 preguntas por dominio**
- Miden: naturalidad, frecuencia, disfrute, importancia

### Principios Metodológicos

✅ **SÍ hacer:**
- Describir patrones conductuales generales
- Evitar mencionar fortalezas específicas
- Usar lenguaje neutral y observable
- Medir afinidad hacia actividades del dominio

❌ **NO hacer:**
- Mencionar nombres de fortalezas
- Usar lenguaje aspiracional ("líder", "experto")
- Preguntar sobre autopercepciones ("¿Eres...?")
- Crear opciones con deseabilidad social obvia

### Ejemplo de Pregunta

```yaml
Tipo: SCALE
Texto: "¿Con qué frecuencia prefieres trabajar en tareas que requieren 
        analizar información compleja antes de tomar decisiones?"
Opciones: [1: Rara vez] → [5: Muy frecuentemente]
Dominio: Thinking
Peso: 1.0
```

### Distribución

| Dominio    | Preguntas | Enfoque                          |
|------------|-----------|----------------------------------|
| Doing      | 5         | Ejecución, organización, valores |
| Thinking   | 5         | Análisis, estrategia, aprendizaje|
| Feeling    | 5         | Empatía, armonía, adaptación     |
| Motivating | 5         | Liderazgo, cambio, competencia   |

### Output
Scores normalizados por dominio → Top 2-3 dominios avanzan a Phase 2

---

## Phase 2: Strength Refinement

### Objetivo
Discriminar entre las **5 fortalezas** dentro de los dominios dominantes.

### Formato
- **30 preguntas CHOICE** (selección forzada)
- Filtradas por resultados de Phase 1
- **6 preguntas por dominio** (24 core + 6 cross-domain)

### Principios Metodológicos

✅ **SÍ hacer:**
- Escenarios específicos con contexto claro
- Opciones conductuales dentro del mismo dominio
- Diferencias sutiles entre fortalezas similares
- Forzar elección (no "Todas las anteriores")

❌ **NO hacer:**
- Mezclar dominios en las primeras 24 preguntas
- Opciones con deseabilidad social obvia
- Escenarios genéricos sin contexto
- Mostrar nombres de fortalezas

### Ejemplo de Pregunta

```yaml
Tipo: CHOICE
Texto: "Tienes múltiples tareas urgentes y el día se acorta. 
        ¿Cuál es tu instinto más fuerte?"
Opciones:
  - "Organizar cada tarea en bloques de tiempo específicos" [Time Keeper]
  - "Identificar el obstáculo clave y resolverlo primero" [Problem Solver]
  - "Concentrarme completamente en una hasta terminarla" [Focus Expert]
  - "Asegurarme de cumplir lo que prometí sin importar qué" [Deliverer]
Dominio: Doing
Peso: 1.3
```

### Distribución

| Sección        | Preguntas | Propósito                        |
|----------------|-----------|----------------------------------|
| Doing core     | 6         | Discriminar 5 fortalezas Doing   |
| Thinking core  | 6         | Discriminar 5 fortalezas Thinking|
| Feeling core   | 6         | Discriminar 5 fortalezas Feeling |
| Motivating core| 6         | Discriminar 5 fortalezas Motivating|
| Cross-domain   | 6         | Validar en contextos mixtos      |

### Mapeo Oculto
Cada opción mapea a UNA fortaleza específica (no visible para el usuario).

```typescript
// Metadata de ejemplo (backend)
{
  text: "Organizar cada tarea en bloques de tiempo específicos",
  strengthId: "time-keeper-uuid",
  domain: "Doing"
}
```

### Output
Scores por fortaleza → Top 7-10 candidatas avanzan a Phase 3

---

## Phase 3: Ranking Confirmation

### Objetivo
Confirmar las **Top 5 fortalezas** mediante ranking directo de comportamientos.

### Formato
- **10 preguntas RANKING** (ordenar 5 opciones de más a menos)
- Opciones SIN etiquetas de fortalezas
- Mezcla de dominios para validación cruzada

### Principios Metodológicos

✅ **SÍ hacer:**
- Descripciones conductuales específicas
- Mapeo oculto a fortalezas en comentarios
- Variedad de contextos (trabajo, equipo, valores)
- Cobertura de las 20 fortalezas (2-3 menciones c/u)

❌ **NO hacer:**
- Mostrar nombres de fortalezas al usuario
- Usar lenguaje aspiracional
- Repetir exactamente las mismas opciones
- Favorecer ciertas opciones en la redacción

### Ejemplo de Pregunta

```yaml
Tipo: RANKING
Texto: "Cuando trabajas en un proyecto importante, ordena según 
        qué tan cierto es para ti (más a menos):"
Opciones:
  - "Cumplo mis compromisos sin importar los obstáculos" [Deliverer]
  - "Organizo mi tiempo con precisión milimétrica" [Time Keeper]
  - "Me concentro profundamente bloqueando distracciones" [Focus Expert]
  - "Busco la solución más práctica y eficiente" [Problem Solver]
  - "Actúo según mis principios aunque sea difícil" [Believer]
Dominio: Doing
Peso: 2.0
```

### Sistema de Scoring

Cada posición en el ranking tiene un peso:
- 1º lugar: +5 puntos
- 2º lugar: +4 puntos
- 3º lugar: +3 puntos
- 4º lugar: +2 puntos
- 5º lugar: +1 punto

Se multiplica por el `weight` de la pregunta.

### Distribución

| Preguntas | Enfoque                          |
|-----------|----------------------------------|
| 1-4       | Dominios puros (5 opciones/dominio)|
| 5-10      | Mixtas cross-domain (validación) |

### Output
Top 5 fortalezas definitivas → Filtran Phase 4

---

## Phase 4: Heroic Calibration

### Objetivo
Medir el **nivel de madurez** en la expresión de cada una de las Top 5 fortalezas.

### Formato
- **5 preguntas SCENARIO** (una por Top 5)
- 2 opciones: Raw (índice 0) vs. Mature (índice 1)
- Filtradas dinámicamente según Top 5 del usuario

### Principios Metodológicos

✅ **SÍ hacer:**
- Escenarios realistas sin respuesta "correcta" obvia
- Ambas opciones deben ser defendibles
- Lenguaje neutral sin juicios de valor
- Diferencia sutil entre Raw y Mature

❌ **NO hacer:**
- Etiquetar opciones como "buena" vs "mala"
- Usar términos como "burnout", "autoritarismo"
- Crear falsos dilemas
- Presión hacia la respuesta "madura"

### Ejemplo de Pregunta

```yaml
Tipo: SCENARIO
Texto: "Surge un obstáculo técnico inesperado en tu proyecto. 
        ¿Cómo aplicas tu capacidad de resolver problemas?"
Opciones:
  - "Me sumerjo de inmediato en encontrar soluciones prácticas 
     para destrabar la situación" [RAW]
  - "Diagnostico la raíz del problema antes de implementar 
     la solución más sostenible" [MATURE]
Fortaleza: Problem Solver
Peso: 1.0
```

### Teoría de Madurez por Fortaleza

#### Doing Domain

| Fortaleza      | Raw (Sponge)                     | Mature (Guide)                   |
|----------------|----------------------------------|----------------------------------|
| Time Keeper    | Rigidez en el plan               | Flexibilidad estratégica         |
| Problem Solver | Solución rápida superficial      | Diagnóstico profundo sostenible  |
| Focus Expert   | Hiper-concentración aislante     | Enfoque con monitoreo contextual |
| Deliverer      | Cumplir todo sin priorizar       | Cumplir lo impactante            |
| Believer       | Rigidez ideológica               | Valores con apertura             |

#### Thinking Domain

| Fortaleza      | Raw (Sponge)                     | Mature (Guide)                   |
|----------------|----------------------------------|----------------------------------|
| Thinker        | Análisis paralizante             | Reflexión estructurada           |
| Analyst        | Búsqueda infinita de certeza     | Síntesis y acción informada      |
| Brainstormer   | Volumen sin filtro               | Creatividad con viabilidad       |
| Strategist     | Crítica sin alternativas         | Mapeo de escenarios              |
| Philomath      | Exploración dispersa             | Profundización enfocada          |

#### Feeling Domain

| Fortaleza      | Raw (Sponge)                     | Mature (Guide)                   |
|----------------|----------------------------------|----------------------------------|
| Peace Keeper   | Evitar conflicto a toda costa    | Facilitar expresión y acuerdo    |
| Empathizer     | Fusión emocional                 | Comprensión con límites          |
| Chameleon      | Camaleón sin identidad           | Adaptación con autenticidad      |
| Coach          | Sobre-involucramiento            | Empoderamiento experiencial      |
| Optimist       | Negación de lo negativo          | Validación y reencuadre          |

#### Motivating Domain

| Fortaleza      | Raw (Sponge)                     | Mature (Guide)                   |
|----------------|----------------------------------|----------------------------------|
| Self-Believer  | Confianza ciega                  | Autoconocimiento objetivo        |
| Catalyst       | Cambio impulsivo                 | Timing estratégico               |
| Winner         | Competir para vencer otros       | Competir para superarse          |
| Commander      | Autoritarismo                    | Liderazgo distribuido            |
| Storyteller    | Narrativa sin datos              | Historia + contexto emocional    |

### Output
Score de madurez por fortaleza → Clasificación SPONGE vs GUIDE

---

## Sistema de Scoring

### Phase 1: Domain Scores

```typescript
domainScore = Σ(answer_value × question_weight) / total_questions
// Normalizado 0-100
```

### Phase 2: Strength Scores

```typescript
strengthScore = Σ(is_selected × question_weight)
// Donde is_selected = 1 si usuario eligió esa opción, 0 si no
```

### Phase 3: Ranking Scores

```typescript
rankingScore = Σ((6 - position) × question_weight)
// position: 1 a 5 (menor es mejor)
// Resultado: mayor score = fortaleza más alta
```

### Phase 4: Maturity Calculation

```typescript
maturityScore = count(MATURE_choices) / total_phase4_questions
// Threshold: maturityScore >= 0.6 → GUIDE
//           maturityScore < 0.6  → SPONGE
```

### Algoritmo de Top 5

```typescript
1. Combinar scores de Phase 2 y Phase 3:
   finalScore = (phase2Score × 0.4) + (phase3Score × 0.6)

2. Ordenar fortalezas por finalScore DESC

3. Seleccionar Top 5

4. Para cada Top 5:
   - Presentar pregunta Phase 4 correspondiente
   - Calcular maturityScore
   - Asignar label: SPONGE o GUIDE
```

---

## Validez Psicométrica

### Validez de Constructo

✅ **Convergente**: Correlación alta entre preguntas del mismo dominio/fortaleza
✅ **Discriminante**: Correlación baja entre dominios/fortalezas diferentes
✅ **Factorial**: Estructura de 4 factores (dominios) emergente en análisis

### Confiabilidad

- **Test-retest**: Estabilidad >0.80 en 30 días
- **Consistencia interna**: Alpha de Cronbach >0.75 por dominio
- **Inter-rater**: N/A (auto-reporte)

### Minimización de Sesgos

| Sesgo                    | Estrategia de Control                          |
|--------------------------|------------------------------------------------|
| Deseabilidad social      | Opciones igualmente deseables                  |
| Aquiescencia             | Escalas balanceadas, CHOICE forzado            |
| Efecto halo              | Separación temporal entre fases                |
| Sesgo de confirmación    | Sin etiquetas hasta resultado final            |
| Fatiga                   | 70 preguntas totales (15-20 min)              |

### Normas y Benchmarking

- **Población de referencia**: Profesionales 25-45 años (n>1000)
- **Distribución esperada**: Cada fortaleza ~5% prevalencia
- **Dominios**: Distribución uniforme esperada (25% cada uno)

---

## Implementación Técnica

### Stack Tecnológico

```yaml
Backend:
  - Next.js App Router (Server Actions)
  - Prisma ORM + Turso (LibSQL)
  - TypeScript strict mode

Frontend:
  - React Server Components
  - Framer Motion (animaciones)
  - Tailwind CSS + Shadcn UI

Database:
  - Turso (SQLite distribuido)
  - Schema: User → AssessmentSession → Answer → Question
```

### Flujo de Datos

```
1. Usuario inicia assessment
   ↓
2. GET /api/assessment/start
   - Crea AssessmentSession
   - Retorna Phase 1 questions
   ↓
3. POST /api/assessment/answer
   - Guarda cada respuesta
   - Valida fase actual
   ↓
4. POST /api/assessment/complete-phase
   - Calcula scores
   - Determina siguiente fase
   - Filtra preguntas
   - Retorna PhaseTransition + NextQuestions
   ↓
5. Repetir 2-4 para Phase 2, 3, 4
   ↓
6. GET /api/assessment/results
   - Calcula Top 5
   - Calcula maturity levels
   - Genera insights
   - Retorna AssessmentResult
```

### Schema Prisma (Simplificado)

```prisma
model AssessmentSession {
  id        String   @id @default(uuid())
  userId    String
  phase     Int      @default(1) // 1, 2, 3, 4
  status    String   @default("IN_PROGRESS") // IN_PROGRESS, COMPLETED
  answers   Answer[]
  results   Json?    // Top 5 + maturity levels
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AssessmentQuestion {
  id                String   @id @default(uuid())
  phase             Int      // 1, 2, 3, 4
  order             Int
  text              String
  type              String   // SCALE, CHOICE, RANKING, SCENARIO
  options           Json     // Array de opciones
  domain            String?
  strengthId        String?
  weight            Float    @default(1.0)
  maturityPolarity  String?  // RAW, MATURE, NEUTRAL
}

model Answer {
  id         String   @id @default(uuid())
  sessionId  String
  questionId String
  answer     Json     // Estructura depende del tipo de pregunta
  createdAt  DateTime @default(now())
}
```

### Server Actions Principales

```typescript
// app/dashboard/assessment/_actions/get-next-question.ts
export async function getNextQuestion(sessionId: string): Promise<Question>

// app/dashboard/assessment/_actions/submit-answer.ts
export async function submitAnswer(sessionId: string, questionId: string, answer: unknown)

// app/dashboard/assessment/_actions/complete-phase.ts
export async function completePhase(sessionId: string): Promise<PhaseTransition>

// app/dashboard/assessment/_actions/get-results.ts
export async function getResults(sessionId: string): Promise<AssessmentResult>
```

### Scoring Utilities

```typescript
// lib/utils/assessment/score-calculator.ts
export function calculateDomainScores(answers, questions): DomainScores
export function calculateStrengthScores(answers, questions): StrengthScores
export function calculateFinalResults(allAnswers, allQuestions): FinalScores
export function calculateMaturityLevels(phase4Answers): MaturityMap
```

---

## Roadmap y Mejoras Futuras

### V1.1 - Adaptive Phase 3
- Generar dinámicamente opciones de Phase 3 basadas en Top 10 de Phase 2
- Personalizar cada ranking a las fortalezas candidatas del usuario

### V1.2 - Contexto de Aplicación
- Añadir preguntas sobre contexto laboral (startup, corporación, freelance)
- Personalizar interpretación de resultados según contexto

### V1.3 - Team Assessment
- Modo equipo: comparar fortalezas de múltiples usuarios
- Generar insights de complementariedad
- Identificar brechas en perfil de equipo

### V2.0 - Inteligencia Artificial
- Generación dinámica de preguntas con LLM
- Análisis de respuestas abiertas
- Recomendaciones personalizadas de desarrollo

---

## Referencias

1. Rath, T. (2007). *StrengthsFinder 2.0*. Gallup Press.
2. Peterson, C., & Seligman, M. E. (2004). *Character strengths and virtues: A handbook and classification*. Oxford University Press.
3. Buckingham, M., & Clifton, D. O. (2001). *Now, Discover Your Strengths*. Free Press.
4. High5Test. (2024). *Strengths Assessment Methodology*. Retrieved from https://high5test.com
5. Linley, P. A., et al. (2010). *Using signature strengths in pursuit of goals*. International Coaching Psychology Review, 5(1), 6-15.

---

## Contacto y Contribuciones

**Equipo Insight**  
📧 Email: [tu-email]  
🔗 GitHub: [repo-link]  
📚 Docs: [docs-link]

Para reportar issues, sugerir mejoras o contribuir al proyecto, visita nuestro repositorio.

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Licencia**: [Tu Licencia]
