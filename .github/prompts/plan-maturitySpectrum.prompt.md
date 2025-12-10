# Plan: Sistema de Espectro de Madurez de Fortalezas

Crear un sistema interactivo que ayude a los usuarios a identificar si están usando sus fortalezas en el "Balcón" (uso maduro) o en el "Sótano" (sobreuso/uso inmaduro), con estrategias de desarrollo personalizadas.

## Pasos

### 1. Extender Schema Prisma

Agregar modelo `StrengthMaturityAssessment` para guardar autoevaluaciones del usuario sobre cada una de sus 5 fortalezas (nivel de madurez, situaciones de uso, puntos ciegos identificados).

**Campos del modelo:**
- `id` - UUID
- `userId` - String (FK a User)
- `strengthId` - String (FK a Strength)
- `maturityLevel` - Enum: BALCONY, MIDDLE_ZONE, BASEMENT
- `consciousUseFrequency` - Int (1-5 escala)
- `energyImpact` - Int (-5 a +5, negativo=drena, positivo=genera energía)
- `situationsBalcony` - String (JSON - situaciones donde se usa bien)
- `situationsBasement` - String (JSON - situaciones de sobreuso)
- `blindSpots` - String (JSON - puntos ciegos identificados)
- `feedbackReceived` - String (JSON - feedback positivo/negativo)
- `developmentGoals` - String (JSON - objetivos de desarrollo)
- `compensationStrategies` - String (JSON - estrategias usando otras fortalezas)
- `lastAssessmentAt` - DateTime
- `createdAt` - DateTime
- `updatedAt` - DateTime

**Relaciones:**
- `@@unique([userId, strengthId])` - Una evaluación por fortaleza por usuario
- Relación a `User` y `Strength`

### 2. Crear Tipos y Schemas

Definir en `app/_shared/types/maturity.ts`:

```typescript
export enum MaturityLevel {
  BALCONY = "BALCONY",     // Uso maduro
  MIDDLE_ZONE = "MIDDLE_ZONE", // Uso intermedio
  BASEMENT = "BASEMENT"     // Sobreuso/inmaduro
}

export const MaturityAssessmentSchema = z.object({
  strengthId: z.string(),
  consciousUseFrequency: z.number().min(1).max(5),
  energyImpact: z.number().min(-5).max(5),
  situationsBalcony: z.array(z.string()),
  situationsBasement: z.array(z.string()),
  blindSpots: z.array(z.string()).optional(),
  feedbackReceived: z.object({
    positive: z.array(z.string()),
    negative: z.array(z.string())
  })
});

export const MaturityInsightsSchema = z.object({
  overallMaturityLevel: z.enum(["BALCONY", "MIDDLE_ZONE", "BASEMENT"]),
  strengthAnalysis: z.array(z.object({
    strengthName: z.string(),
    currentLevel: z.enum(["BALCONY", "MIDDLE_ZONE", "BASEMENT"]),
    keyIndicators: z.array(z.string()),
    riskFactors: z.array(z.string()),
    developmentStrategy: z.string(),
    compensationUsingOtherStrengths: z.array(z.object({
      strengthToUse: z.string(),
      howToApply: z.string()
    }))
  })),
  actionPlan: z.array(z.object({
    priority: z.number(),
    action: z.string(),
    timeframe: z.string()
  })),
  progressCheckpoints: z.array(z.object({
    date: z.string(),
    whatToObserve: z.string()
  }))
});
```

### 3. Generar Prompt AI

Crear `.github/prompts/generate-maturity-insights.prompt.md`:

**Objetivo:** Analizar las respuestas de autoevaluación del usuario y generar insights personalizados sobre su espectro de uso de fortalezas, con estrategias de desarrollo que aprovechen su Top 5.

**Entrada:**
- Usuario con sus 5 fortalezas rankeadas
- Respuestas de autoevaluación por cada fortaleza
- Datos de `watchOuts` y `strengthsDynamics` de cada fortaleza
- ADN del usuario (para contexto de cómo se combinan sus fortalezas)

**Salida esperada:**
- Nivel de madurez por fortaleza (Balcón/Zona Media/Sótano)
- Indicadores clave de cada nivel
- Estrategias de compensación usando otras fortalezas del Top 5
- Plan de acción priorizado
- Checkpoints de progreso

**Directrices:**
- Tono: Constructivo y empoderador, no crítico
- Enfocarse en autoconciencia y práctica deliberada
- Las estrategias deben ser accionables y específicas
- Relacionar con el contexto del ADN del usuario

### 4. Implementar Server Actions

Crear en `app/dashboard/profile/_actions/`:

#### `save-maturity-assessment.action.ts`
```typescript
export async function saveMaturityAssessment(
  userId: string,
  assessments: MaturityAssessmentInput[]
) {
  // Guardar o actualizar evaluaciones para cada fortaleza
  // Calcular maturityLevel basado en respuestas
  // Actualizar lastAssessmentAt
}
```

#### `generate-maturity-insights.action.ts`
```typescript
export async function generateMaturityInsights(userId: string) {
  // 1. Obtener usuario con fortalezas y evaluaciones
  // 2. Obtener ADN del usuario para contexto
  // 3. Preparar prompt con todos los datos
  // 4. Llamar a generateObject con MaturityInsightsSchema
  // 5. Guardar insights en la evaluación (campo compensationStrategies, developmentGoals)
  // 6. Retornar insights
}
```

#### `get-maturity-data.action.ts`
```typescript
export async function getMaturityData(userId: string) {
  // Obtener todas las evaluaciones del usuario con fortalezas relacionadas
  // Incluir datos de watchOuts y strengthsDynamics
  // Retornar estructura completa para visualización
}
```

### 5. Crear Componentes UI

Desarrollar en `app/dashboard/profile/_components/`:

#### `maturity-spectrum-card.tsx`
**Propósito:** Visualización del espectro de madurez por fortaleza

**Características:**
- Slider visual horizontal: 🏛️ Balcón ← Zona Media → 🔻 Sótano
- Indicador de posición actual
- Colores: Verde (Balcón), Amarillo (Media), Rojo (Sótano)
- Tooltips con ejemplos de comportamiento en cada nivel
- Ícono de la fortaleza + dominio

**Props:**
```typescript
interface MaturitySpectrumCardProps {
  strengthName: string;
  maturityLevel: MaturityLevel;
  energyImpact: number;
  situationsBalcony: string[];
  situationsBasement: string[];
}
```

#### `maturity-assessment-form.tsx`
**Propósito:** Cuestionario interactivo de autoevaluación

**Características:**
- Multi-step form (una fortaleza a la vez)
- 5 preguntas por fortaleza:
  1. ¿Con qué frecuencia usas esta fortaleza de forma consciente? (1-5)
  2. ¿Cómo te sientes después de usar esta fortaleza? (energizado +5 / agotado -5)
  3. Describe una situación reciente donde la usaste muy bien (Balcón)
  4. Describe una situación donde la sobreutilizaste o usaste inapropiadamente (Sótano)
  5. ¿Qué feedback has recibido sobre esta fortaleza? (positivo/negativo)
- Progress bar
- Validación con Zod
- Auto-save

**Props:**
```typescript
interface MaturityAssessmentFormProps {
  userStrengths: UserStrengthWithDetails[];
  onComplete: (assessments: MaturityAssessmentInput[]) => Promise<void>;
}
```

#### `maturity-insights-panel.tsx`
**Propósito:** Panel con estrategias de desarrollo personalizadas

**Características:**
- Accordion por fortaleza mostrando:
  - Nivel actual con visualización clara
  - Indicadores clave de tu uso actual
  - Riesgos de sobreuso identificados
  - Estrategia de desarrollo (cómo mover del Sótano al Balcón)
  - Compensación usando otras fortalezas del Top 5
- Sección de "Plan de Acción" con pasos priorizados
- Checkpoints de progreso (recordatorios para reevaluar)
- Botón para regenerar insights si cambió la evaluación

**Props:**
```typescript
interface MaturityInsightsPanelProps {
  insights: MaturityInsights;
  onRegenerate: () => Promise<void>;
}
```

### 6. Integrar en Perfil

Modificar `app/dashboard/profile/page.tsx`:

**Estructura propuesta:**
```tsx
<div className="lg:col-span-2 space-y-6">
  {dna && <UserDnaCard dna={dna} />}
  
  {/* Nueva sección: Espectro de Madurez */}
  {maturityData && (
    <Card>
      <CardHeader>
        <CardTitle>Espectro de Madurez de tus Fortalezas</CardTitle>
        <CardDescription>
          Descubre si estás usando tus fortalezas en el "Balcón" (uso maduro) 
          o en el "Sótano" (sobreuso). Desarrolla autoconciencia y control.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs>
          <TabsList>
            {user.strengths.map(s => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.nameEs}
              </TabsTrigger>
            ))}
          </TabsList>
          {user.strengths.map(s => (
            <TabsContent key={s.id} value={s.id}>
              <MaturitySpectrumCard {...maturityData[s.id]} />
            </TabsContent>
          ))}
        </Tabs>
        
        {insights && <MaturityInsightsPanel insights={insights} />}
        
        {!hasAssessment && (
          <Button onClick={() => setShowAssessment(true)}>
            Evaluar mi Espectro de Madurez
          </Button>
        )}
      </CardContent>
    </Card>
  )}
  
  <UserStrengthProfile user={user} />
</div>
```

**Lógica:**
```typescript
const maturityData = await getMaturityData(user.id);
const hasAssessment = maturityData && maturityData.lastAssessmentAt;
const insights = hasAssessment 
  ? await generateMaturityInsights(user.id)
  : null;
```

## Consideraciones Adicionales

### 1. Estructura de Evaluación

Cuestionario breve (5 preguntas por fortaleza) que identifique:
- **Frecuencia de uso consciente vs automático**: Escala 1-5
- **Impacto energético**: Escala -5 (drena) a +5 (genera energía)
- **Situaciones donde genera energía vs donde drena**: Texto libre
- **Feedback recibido**: Positivo/Negativo (opcional)
- **Puntos ciegos percibidos**: Texto libre (opcional)

### 2. Visualización

- **Espectro visual**: Slider horizontal con 3 zonas claramente marcadas
- **Colores semánticos**: 
  - Verde (#10b981) - Balcón
  - Amarillo (#f59e0b) - Zona Media
  - Rojo (#ef4444) - Sótano
- **Iconografía**: 
  - 🏛️ Balcón (uso maduro, consciente, genera energía)
  - ⚖️ Zona Media (uso intermedio, desarrollo en progreso)
  - 🔻 Sótano (sobreuso, automático, drena energía)
- **Gráfico de radar**: Mostrar las 5 fortalezas en un radar para ver balance general

### 3. Recomendaciones IA

Generar estrategias de compensación usando otras fortalezas del Top 5:

**Ejemplo (Empatizador en el Sótano):**
- **Problema identificado**: Te ahogas en emociones ajenas, te sientes agotado
- **Estrategia**: Usa tu **Estratega** para mantener objetividad y tomar decisiones lógicas después de conectar emocionalmente
- **Acción específica**: Después de una conversación emocional, toma 5 minutos para analizar los hechos objetivamente antes de actuar
- **Compensación con Creyente**: Usa tus valores para establecer límites claros sobre cuándo y cómo ayudas

### 4. Progreso Temporal

- **Reevaluación sugerida**: Cada 30-90 días
- **Tracking de evolución**: Guardar histórico de evaluaciones
- **Gráfico de progreso**: Línea temporal mostrando evolución del nivel de madurez
- **Recordatorios**: Notificación/email para reevaluar después de 60 días
- **Comparación**: Mostrar cambios entre evaluaciones (antes/después)

### 5. Gamificación (Opcional - Fase 2)

- **Badges de Madurez**: 
  - "Autoconsciente" - Primera evaluación completada
  - "En Desarrollo" - 2+ evaluaciones mostrando progreso
  - "Maestro del Balcón" - Todas las fortalezas en nivel Balcón
- **Streak de Práctica Deliberada**: Días consecutivos practicando uso consciente
- **Desafíos semanales**: "Esta semana, practica usar [Fortaleza] solo cuando sea necesario"

### 6. Integración con otros módulos

- **Reportes individuales**: Incluir sección de madurez en reportes generados
- **Reportes de equipo**: Mostrar madurez promedio del equipo por dominio
- **Coach virtual**: Sugerencias automáticas basadas en el nivel de madurez
- **Dashboard insights**: Widget mostrando la fortaleza que más necesita desarrollo

## Flujo de Usuario

1. Usuario completa evaluación inicial (15-20 minutos)
2. Sistema calcula nivel de madurez por fortaleza
3. IA genera insights personalizados con estrategias
4. Usuario visualiza su espectro y lee recomendaciones
5. Usuario implementa estrategias durante 30-90 días
6. Usuario reevalúa para medir progreso
7. Sistema muestra evolución y ajusta recomendaciones

## Métricas de Éxito

- Tasa de completación de evaluaciones
- Tiempo promedio de evaluación
- Frecuencia de reevaluación
- Mejora del nivel de madurez entre evaluaciones
- Engagement con las estrategias de desarrollo
- Feedback cualitativo de usuarios sobre utilidad
