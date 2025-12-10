# Prompt: Generar ADN del Usuario - Análisis de Fortalezas HIGH5

## Objetivo

Generar una descripción única y coherente del "ADN del Usuario" - la identidad combinada que surge de sus 5 fortalezas principales del test HIGH5. Este perfil debe ser inspirador, personalizado y reflejar cómo estas fortalezas interactúan sinérgicamente.

## Entrada Requerida

```json
{
  "userId": "string",
  "userName": "string",
  "topFiveStrengths": [
    {
      "name": "string (nombre en inglés)",
      "spanishName": "string (nombre en español)",
      "domain": "Doing | Thinking | Feeling | Motivating",
      "description": "string (descripción de la fortaleza)"
    }
  ],
  "userContext": {
    "role": "string (opcional: rol o puesto)",
    "industry": "string (opcional: industria o sector)",
    "teamSize": "number (opcional: tamaño del equipo)"
  }
}
```

## Estructura del ADN del Usuario

El prompt debe generar:

### 1. Título del ADN (Una frase corta y memorable)

**Formato:** "[Descriptor 1] + [Descriptor 2] impulsado por [Descriptor 3]"
**Ejemplo:** "Estratega Emocional y de Acción impulsado por Valores"

### 2. Resumen Ejecutivo (2-3 párrafos)

- Síntesis coherente de cómo las 5 fortalezas se combinan
- El propósito central que define al usuario
- El impacto único que genera en su entorno

### 3. Análisis por Dimensiones (máximo 4 dimensiones)

Agrupar las fortalezas por cómo se manifiestan:

- **Pensamiento:** Cómo procesan información y toman decisiones
- **Acción/Ejecución:** Cómo convierten ideas en realidad
- **Conexión/Impacto:** Cómo influyen en otros
- **Propósito:** Qué los motiva fundamentalmente

**Formato de cada dimensión:**

```
**[Nombre de Dimensión]**
[Fortalezas involucradas]: [Descripción de cómo interactúan estas fortalezas en esta dimensión]
```

### 4. Fortalezas Sinérgicas (El corazón del ADN)

Explicar cómo 2-3 pares de fortalezas crean un efecto multiplicador:

**Formato:**

```
**[Fortaleza 1] + [Fortaleza 2] = [Efecto Sinérgico]**
[Descripción de cómo estas dos fortalezas se potencian mutuamente]
```

### 5. El Rol Ideal para Este ADN (2-3 puntos)

- Qué tipo de desafíos están diseñados para resolver
- Dónde su combinación de fortalezas es más valiosa
- Cómo contribuyen al equipo o organización

### 6. Reflexión de Propósito

Una frase inspiradora que encapsule su propósito único en el contexto de sus fortalezas.

**Ejemplo:** "Eres la brújula que convierte estrategia en movimiento, manteniendo a tu equipo alineado con lo que realmente importa."

## Directrices de Tono y Estilo

- **Tono:** Inspirador pero auténtico, evitar clichés
- **Lenguaje:** Claro, directo, evitar jerga excesiva
- **Personalización:** Usar los datos específicos del usuario, no genérico
- **Idioma:** Español

## Contexto del Dominio HIGH5

### Los 4 Dominios Principales

`/data/domains.data.ts` |

### Las 20 Fortalezas (Referencia)

`/data/strenghts.data.ts`

### Culturas

`/data/cultures.data.ts`

### Focos

`/data/focus.data.ts`

- Mostrar en perfil del usuario
- Base para reportes de fortalezas personalizados
- Párrafo introductorio en reportes de equipo
- Ayuda a usuarios a entender su identidad profesional única

## Validaciones

✅ Todas las 5 fortalezas están mencionadas en la salida
✅ Hay al menos 1 efecto sinérgico identificado entre fortalezas
✅ El texto está libre de jerga corporativa hueca
✅ La salida es inspiradora pero creíble
✅ Las dimensiones agrupan lógicamente las fortalezas
