# Auditoría de Feedback Questions

## 📊 Resumen Ejecutivo

**Fecha de auditoría**: 21 de diciembre de 2024  
**Archivo auditado**: `prisma/data/feedback-questions.data.ts`  
**Total de preguntas**: 40  
**Opciones por pregunta**: 4  
**Fortalezas cubiertas**: 20/20 ✅

---

## 📈 Análisis de Cobertura

### Distribución de Menciones por Fortaleza

| Rank | Fortaleza | Frecuencia | Dominio | Estado |
|------|-----------|------------|---------|--------|
| 1 | thinker | 38 | Thinking | ✅ Excelente |
| 2 | analyst | 34 | Thinking | ✅ Excelente |
| 3 | catalyst | 32 | Motivating | ✅ Excelente |
| 4 | strategist | 30 | Thinking | ✅ Muy bueno |
| 5 | empathizer | 29 | Feeling | ✅ Muy bueno |
| 6 | coach | 29 | Feeling | ✅ Muy bueno |
| 7 | commander | 28 | Motivating | ✅ Muy bueno |
| 8 | peace-keeper | 27 | Feeling | ✅ Muy bueno |
| 9 | optimist | 25 | Feeling | ✅ Bueno |
| 10 | deliverer | 25 | Doing | ✅ Bueno |
| 11 | winner | 23 | Motivating | ✅ Bueno |
| 12 | focus-expert | 23 | Doing | ✅ Bueno |
| 13 | problem-solver | 22 | Doing | ✅ Bueno |
| 14 | chameleon | 22 | Feeling | ✅ Bueno |
| 15 | brainstormer | 22 | Thinking | ✅ Bueno |
| 16 | self-believer | 21 | Motivating | ✅ Aceptable |
| 17 | storyteller | 20 | Motivating | ✅ Aceptable |
| 18 | philomath | 20 | Thinking | ✅ Aceptable |
| 19 | believer | 18 | Doing | ⚠️ Bajo |
| 20 | time-keeper | 12 | Doing | ⚠️ Crítico |

### Estadísticas

- **Media**: 24.5 menciones
- **Mediana**: 23 menciones
- **Desviación estándar**: 5.8
- **Rango**: 12-38 (26 puntos)

### Distribución por Dominio

| Dominio | Fortalezas | Total Menciones | Promedio | Estado |
|---------|------------|-----------------|----------|--------|
| Thinking | 5 | 144 | 28.8 | ✅ Sobre-representado |
| Feeling | 5 | 132 | 26.4 | ✅ Bien balanceado |
| Motivating | 5 | 124 | 24.8 | ✅ Bien balanceado |
| Doing | 5 | 100 | 20.0 | ⚠️ Sub-representado |

---

## ⚠️ Problemas Identificados

### 1. Desbalance por Dominio

El dominio **Doing** tiene significativamente menos cobertura que **Thinking**:
- Thinking: 144 menciones (28.8 promedio)
- Doing: 100 menciones (20.0 promedio)
- **Diferencia**: 44 menciones (30% menos)

### 2. Fortalezas Críticas

**time-keeper** (12 menciones):
- 51% por debajo de la media
- Puede generar **falsos negativos** para personas con esta fortaleza dominante
- El feedback de pares podría no capturar este talento adecuadamente

**believer** (18 menciones):
- 27% por debajo de la media
- Riesgo de sub-detección en perfiles orientados a valores

### 3. Impacto en Validez

La sub-representación puede causar:
- **Baja sensibilidad**: No detectar fortalezas reales
- **Sesgo de dominio**: Sobre-identificar Thinking vs Doing
- **Inconsistencia test-retest**: Variabilidad alta para fortalezas poco cubiertas

---

## 🎯 Plan de Acción

### Fase 1: Corrección Inmediata (Prioridad Alta)

#### 1.1 Añadir 5 preguntas nuevas enfocadas en Doing

**Objetivo**: Aumentar cobertura de `time-keeper` y `believer`

```typescript
// Propuestas de nuevas preguntas

// Q41: Enfocada en time-keeper
{
  order: 41,
  text: "Cuando hay múltiples deadlines cercanos, esta persona...",
  answerOptions: [
    { id: "q41_a", text: "Crea cronogramas detallados y los sigue rigurosamente", order: 1 },
    { id: "q41_b", text: "Prioriza las tareas más críticas primero", order: 2 },
    { id: "q41_c", text: "Trabaja extra para cumplir con todo", order: 3 },
    { id: "q41_d", text: "Delega para distribuir la carga", order: 4 },
  ],
  strengthMapping: {
    q41_a: { "time-keeper": 0.9, "focus-expert": 0.6, analyst: 0.5 },
    q41_b: { strategist: 0.8, "focus-expert": 0.7, "time-keeper": 0.6 },
    q41_c: { deliverer: 0.9, winner: 0.6, "self-believer": 0.5 },
    q41_d: { commander: 0.8, coach: 0.6, catalyst: 0.5 },
  },
}

// Q42: Enfocada en believer
{
  order: 42,
  text: "Cuando una decisión del equipo contradice sus principios, esta persona...",
  answerOptions: [
    { id: "q42_a", text: "Expresa su desacuerdo basándose en valores fundamentales", order: 1 },
    { id: "q42_b", text: "Se adapta para mantener la armonía del equipo", order: 2 },
    { id: "q42_c", text: "Busca datos objetivos para resolver el dilema", order: 3 },
    { id: "q42_d", text: "Propone alternativas que satisfagan a todos", order: 4 },
  ],
  strengthMapping: {
    q42_a: { believer: 0.9, commander: 0.6, "self-believer": 0.5 },
    q42_b: { chameleon: 0.8, "peace-keeper": 0.7, empathizer: 0.5 },
    q42_c: { analyst: 0.9, thinker: 0.6, strategist: 0.5 },
    q42_d: { "problem-solver": 0.8, brainstormer: 0.6, coach: 0.5 },
  },
}

// Q43: Time-keeper en contexto de proyectos
{
  order: 43,
  text: "En la planificación de proyectos, esta persona aporta...",
  answerOptions: [
    { id: "q43_a", text: "Estimaciones precisas de tiempo y recursos", order: 1 },
    { id: "q43_b", text: "Visión estratégica del panorama completo", order: 2 },
    { id: "q43_c", text: "Energía para iniciar las actividades rápidamente", order: 3 },
    { id: "q43_d", text: "Consideración del impacto en las personas", order: 4 },
  ],
  strengthMapping: {
    q43_a: { "time-keeper": 0.9, analyst: 0.7, "focus-expert": 0.5 },
    q43_b: { strategist: 0.9, thinker: 0.7, philomath: 0.5 },
    q43_c: { catalyst: 0.9, winner: 0.6, commander: 0.5 },
    q43_d: { empathizer: 0.8, coach: 0.7, "peace-keeper": 0.6 },
  },
}

// Q44: Believer en contexto ético
{
  order: 44,
  text: "Cuando se presenta una 'zona gris' ética en el trabajo, esta persona...",
  answerOptions: [
    { id: "q44_a", text: "Consulta sus valores internos para guiar la decisión", order: 1 },
    { id: "q44_b", text: "Analiza las consecuencias de cada opción", order: 2 },
    { id: "q44_c", text: "Busca precedentes y mejores prácticas", order: 3 },
    { id: "q44_d", text: "Consulta con el equipo para llegar a consenso", order: 4 },
  ],
  strengthMapping: {
    q44_a: { believer: 0.9, thinker: 0.6, "self-believer": 0.5 },
    q44_b: { analyst: 0.8, strategist: 0.7, "problem-solver": 0.5 },
    q44_c: { philomath: 0.8, analyst: 0.6, strategist: 0.5 },
    q44_d: { "peace-keeper": 0.8, empathizer: 0.7, coach: 0.5 },
  },
}

// Q45: Time-keeper en seguimiento
{
  order: 45,
  text: "En el seguimiento de tareas pendientes, esta persona...",
  answerOptions: [
    { id: "q45_a", text: "Mantiene listas actualizadas y verifica el progreso regularmente", order: 1 },
    { id: "q45_b", text: "Se asegura de que los compromisos se cumplan", order: 2 },
    { id: "q45_c", text: "Motiva al equipo a mantener el momentum", order: 3 },
    { id: "q45_d", text: "Identifica obstáculos y propone soluciones", order: 4 },
  ],
  strengthMapping: {
    q45_a: { "time-keeper": 0.9, "focus-expert": 0.7, analyst: 0.5 },
    q45_b: { deliverer: 0.9, believer: 0.6, commander: 0.5 },
    q45_c: { catalyst: 0.8, optimist: 0.7, storyteller: 0.5 },
    q45_d: { "problem-solver": 0.9, strategist: 0.6, brainstormer: 0.5 },
  },
}
```

### Fase 2: Redistribución de Pesos (Prioridad Media)

#### 2.1 Aumentar pesos de fortalezas sub-representadas

En preguntas existentes donde `time-keeper` o `believer` aparecen como secundarias, considerar aumentar su peso:

| Pregunta | Cambio Propuesto |
|----------|------------------|
| Q3 (order 3) | `time-keeper: 0.7 → 0.8` |
| Q8 (order 8) | Añadir `time-keeper: 0.5` como terciaria |
| Q10 (order 10) | `time-keeper: 0.8 → 0.85` |
| Q17 (order 17) | `believer: - → 0.6` como secundaria |
| Q30 (order 30) | `believer: 0.6 → 0.7` |

### Fase 3: Validación (Prioridad Baja)

#### 3.1 Test de Cobertura Automatizado

Crear script de validación para CI/CD:

```typescript
// scripts/validate-feedback-coverage.ts
import feedbackQuestions from '../prisma/data/feedback-questions.data';

const MINIMUM_COVERAGE = 18; // Por debajo de este número, warning
const CRITICAL_COVERAGE = 15; // Por debajo de este número, error

function validateCoverage() {
  const strengthCounts: Record<string, number> = {};
  
  for (const question of feedbackQuestions) {
    for (const [answerId, weights] of Object.entries(question.strengthMapping)) {
      for (const strength of Object.keys(weights)) {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
      }
    }
  }
  
  const warnings: string[] = [];
  const errors: string[] = [];
  
  for (const [strength, count] of Object.entries(strengthCounts)) {
    if (count < CRITICAL_COVERAGE) {
      errors.push(`❌ ${strength}: ${count} menciones (crítico)`);
    } else if (count < MINIMUM_COVERAGE) {
      warnings.push(`⚠️ ${strength}: ${count} menciones (bajo)`);
    }
  }
  
  console.log('=== Feedback Coverage Report ===');
  if (errors.length > 0) {
    console.error('\nErrores:');
    errors.forEach(e => console.error(e));
  }
  if (warnings.length > 0) {
    console.warn('\nAdvertencias:');
    warnings.forEach(w => console.warn(w));
  }
  
  return errors.length === 0;
}

validateCoverage();
```

#### 3.2 Métricas de Calidad Post-Implementación

Después de añadir las nuevas preguntas, la cobertura esperada sería:

| Fortaleza | Actual | Proyectado | Cambio |
|-----------|--------|------------|--------|
| time-keeper | 12 | 21 | +75% |
| believer | 18 | 24 | +33% |

**Nueva distribución por dominio**:

| Dominio | Actual | Proyectado |
|---------|--------|------------|
| Doing | 100 (20.0) | 118 (23.6) |
| Thinking | 144 (28.8) | 146 (29.2) |
| Feeling | 132 (26.4) | 135 (27.0) |
| Motivating | 124 (24.8) | 126 (25.2) |

---

## ✅ Checklist de Implementación

### ✅ Inmediato (Sprint Actual) - COMPLETADO

- [x] Añadir Q41: time-keeper en deadlines
- [x] Añadir Q42: believer en conflicto de valores
- [x] Añadir Q43: time-keeper en planificación
- [x] Añadir Q44: believer en ética
- [x] Añadir Q45: time-keeper en seguimiento
- [x] Actualizar header del archivo con nuevas estadísticas
- [x] Ejecutar seed de base de datos en Turso

### ✅ Próximo Sprint - COMPLETADO

- [x] Revisar pesos de preguntas existentes (5 ajustes aplicados)
- [x] Crear script de validación de cobertura (Vitest)
- [x] Test automatizado creado (9 validaciones)
- [x] Scripts de actualización DB creados

### 📊 Estado Final (21 de diciembre de 2024)

**Base de datos:**
- ✅ 45 preguntas actualizadas en Turso
- ✅ 5 preguntas nuevas (Q41-Q45) añadidas
- ✅ 40 preguntas existentes con pesos actualizados

**Cobertura alcanzada:**
- ✅ believer: 18 → 21 menciones (+16.7%)
- ⚠️ time-keeper: 12 → 16 menciones (+33.3%, aún con warning < 18)
- ✅ Promedio general: 27.1 menciones
- ✅ Balance por dominio: todos dentro de ±30%

**Validación:**
- ✅ Test unitario con Vitest (9/9 tests pasando)
- ✅ Ninguna fortaleza en nivel crítico (< 15)
- ✅ Solo 1 fortaleza con warning (time-keeper: 16)

### Backlog

- [ ] Análisis de correlación entre feedback y self-assessment
- [ ] Validación con muestra piloto (n>50)
- [ ] Ajuste de pesos basado en datos reales
- [ ] Añadir 1-2 menciones más de time-keeper para alcanzar umbral de 18

---

## 📚 Referencias

- [ASSESSMENT_METHODOLOGY.md](./ASSESSMENT_METHODOLOGY.md) - Metodología completa del assessment
- [docs/streghts.md](../streghts.md) - Definición canónica de fortalezas y dominios
- [prisma/data/assessment-questions.data.ts](../../prisma/data/assessment-questions.data.ts) - Preguntas de self-assessment

---

**Autor**: Sistema de Auditoría Insight  
**Última actualización**: Diciembre 2024  
**Próxima revisión**: Después de implementar Fase 1
