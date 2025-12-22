# Copilot Instructions - Insight Project

Documentación completa para GitHub Copilot y desarrolladores sobre los patrones, convenciones y arquitectura del proyecto Insight, con énasis especial en **Cache Components de Next.js 16**.

## 📚 Archivos Principales

### 🎯 **START HERE** - Punto de entrada recomendado
1. **[`EXECUTIVE-SUMMARY.md`](./EXECUTIVE-SUMMARY.md)** (5 min read)
   - El problema que se resolvió
   - La solución (Cache Components pattern)
   - Checklists y quick reference
   - FAQs

### 📖 Documentación Principal

2. **[`copilot-instructions.md`](./copilot-instructions.md)** (Referencia completa)
   - Tech stack exacto (versiones)
   - Convenciones de nombres
   - Patrones de código
   - Directrices de TypeScript, Prisma, Tailwind
   - Seguridad y testing

3. **[`cache-components.md`](./cache-components.md)** (Guía core)
   - Pattern base: Static Shell + Dynamic Content + Suspense
   - Plantillas listas para copiar
   - Reglas críticas (DO/DON'T)
   - Manejo de errores de prerendering
   - Migration checklist

4. **[`cache-components-build-errors.md`](./cache-components-build-errors.md)** (Troubleshooting)
   - Por qué ocurren los errores
   - Soluciones paso a paso
   - Comparativas (❌ vs ✅)
   - Interpretación de warnings

### 💻 Ejemplos y Referencia Rápida

5. **[`cache-components-examples.md`](./cache-components-examples.md)** (Código real del proyecto)
   - Ejemplo 1: Dashboard Layout ✅
   - Ejemplo 2: Server Actions
   - Ejemplo 3: Rutas dinámicas
   - Ejemplo 4: API routes
   - Ejemplo 5: Formularios (React Hook Form + Zod)
   - Ejemplo 6: Prisma queries

6. **[`quick-reference.md`](./quick-reference.md)** (Templates copy-paste)
   - 8 templates listos para adaptar
   - Checklist pre-commit
   - Errores comunes y cómo evitarlos

---

## 🚀 Flujo de Lectura

### Para Nuevo Desarrollador
```
1. EXECUTIVE-SUMMARY.md (5 min)
   ↓
2. cache-components.md - Sección "Core Pattern" (10 min)
   ↓
3. cache-components-examples.md - Ejemplo 1 Dashboard (10 min)
   ↓
Ready to code ✅
```

### Para Implementar Nueva Página
```
1. cache-components.md - "Template Base"
   ↓
2. quick-reference.md - Selecciona template
   ↓
3. Adapta código, run: bun run build
   ↓
4. Verifica: ◐ (Partial Prerender) en output ✅
```

### Cuando Obtienes Error en Build
```
1. cache-components-build-errors.md - "Problem Summary"
   ↓
2. Busca tu patrón en "Implementation Checklist"
   ↓
3. Consulta cache-components.md - "Error Handling"
   ↓
4. Rerun: bun run build ✅
```

---

## 🎯 Lo Más Importante (TL;DR)

### El Pattern (CRÍTICO)
```typescript
// ❌ NO HAGAS ESTO
export default async function Page() {
  const session = await getSession();
}

// ✅ HAZ ESTO
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  const session = await getSession();
}
```

### Por Qué
- Next.js 16 con Cache Components pre-renderiza rutas
- `getSession()` accede a `headers()` (runtime API)
- Esto causa error si no está en Suspense
- Suspense separa static (prerendering) de dynamic (request-time)

### Build Output Esperado
```
✓ Generating static pages (38/38)
✓ Finalizing page optimization

├ ◐ /dashboard           ← CORRECTO (Partial Prerender)
├ ◐ /dashboard/reports   ← CORRECTO (Partial Prerender)
└ ◐ /dashboard/team      ← CORRECTO (Partial Prerender)

Warnings sobre headers(): NORMALES Y ESPERADOS ✅
```

---

## 📋 Checklist para Nueva Página

Copia y pega antes de hacer commit:

```
[ ] Main component es SYNC (no async)
[ ] Componente async está en función separada
[ ] Función async wrapped en <Suspense>
[ ] Suspense tiene fallback={<Skeleton />}
[ ] getSession() está DENTRO del componente async
[ ] cookies() está DENTRO del componente async
[ ] Database queries DENTRO del componente async
[ ] Para [id] rutas: const { id } = await params;
[ ] Build completa: bun run build
[ ] Ruta es ◐ o ○ en build output (not ƒ)
```

---

## 🛠️ Tech Stack (Exacto)

```
Next.js 16.0.7          ← App Router + Cache Components ⭐
├─ React 19.2.0
├─ TypeScript (ES2017, strict mode)
├─ Prisma 7.1.0         ← ORM (libSQL para Turso)
├─ Tailwind CSS          ← Tema CyberPunk personalizado
├─ React Hook Form       ← Formularios
├─ Zod                   ← Validación
└─ BetterAuth            ← Autenticación
```

---

## 📁 Convenciones Clave

| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Archivos | kebab-case | `user-profile.tsx` |
| Componentes | PascalCase | `UserCard.tsx` |
| Funciones | camelCase | `getUserData()` |
| Constantes | UPPER_SNAKE | `MAX_RETRIES` |
| Booleanos | verb-based | `isLoading`, `hasPermission` |

---

## 🎨 Estilos

```typescript
// ❌ NO hardcodees colores
<div className="text-red-500 bg-blue-400">

// ✅ USA variables de tema
<div className="text-error bg-primary">

// ❌ NO concat strings
className={`base ${active ? 'active' : ''}`}

// ✅ USA cn() utility
className={cn('base', active && 'active')}
```

---

## 🚨 Problemas Comunes

| Problema | Solución |
|----------|----------|
| Error: "headers() rejects during prerendering" | Wrap en Suspense → ver cache-components-build-errors.md |
| Ruta no se prerendeirza (marked as ◐) | OK NORMAL - es Partial Prerender |
| Error: "dynamic not compatible with cacheComponents" | Remover `export const dynamic`, usar Suspense |
| Session undefined en página | Component no está dentro de Suspense |
| TypeScript error con props | Declara `interface ComponentProps` |

---

## 📖 Referencia Rápida

- **Archivos documentados**: `.github/copilot/`
- **Configuración**: `next.config.ts` (cacheComponents: true)
- **Prisma**: `lib/prisma.db.ts` (singleton pattern)
- **Auth**: `lib/auth.ts` (getSession function)
- **Ejemplo correcto**: `app/dashboard/layout.tsx`

---

## 🔗 Enlaces Internos

```
.github/copilot/
├── EXECUTIVE-SUMMARY.md          ← START HERE
├── copilot-instructions.md        ← Referencia completa
├── cache-components.md            ← Patrones core
├── cache-components-build-errors.md ← Troubleshooting
├── cache-components-examples.md   ← Código real
├── quick-reference.md             ← Templates copy-paste
└── README.md                       ← Este archivo
```

---

## 🌐 Referencias Externas

- [Next.js 16 Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [React 19 Suspense](https://react.dev/reference/react/Suspense)
- [Prisma Documentation](https://prisma.io/docs)
- [Zod Validation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 💡 El Punto Principal

> **Cache Components = separar contenido STATIC (prerendered) de contenido DYNAMIC (streamed)**

Resultado:
- ⚡ Shell HTML se sirve inmediatamente desde edge
- ✨ Usuarios ven estructura inmediatamente
- 🔄 Contenido carga en background
- 📊 Mejor Core Web Vitals (TTFB, FCP)

---

## ✅ Validación

Tu implementación es correcta cuando:
1. ✅ `bun run build` completa sin errores
2. ✅ Rutas /dashboard mostradas como `◐ (Partial Prerender)`
3. ✅ Warnings sobre `headers()` aparecen (NORMAL)
4. ✅ Página carga con Skeleton primero
5. ✅ Contenido se carga smoothly después

---

**Documentación finalizada**: 22 de diciembre de 2025

Toda la información para dominar Cache Components en Next.js 16 está aquí.
Para comenzar: abre **`EXECUTIVE-SUMMARY.md`**


### 1. [`copilot-instructions.md`](./copilot-instructions.md)
**Documento principal de referencia**

Contiene:
- Todas las versiones exactas del proyecto (Next.js 16.0.7, React 19.2.0, etc.)
- Convenciones de nombres (archivos, componentes, funciones)
- Patrones de código del codebase
- Directrices de TypeScript
- Guía de Prisma ORM
- Patrones de Tailwind + tema CyberPunk
- Seguridad, testing, y best practices

**Cuando leer**: Referencia general para entender la estructura y convenciones del proyecto.

---

### 2. [`cache-components.md`](./cache-components.md)
**Guía core de Cache Components en Next.js 16**

Contiene:
- Pattern base: Static Shell + Dynamic Content + Suspense
- Plantillas listas para copiar/pegar
- Reglas críticas (DO/DON'T)
- Patrones para rutas dinámicas
- Manejo de errores durante prerendering
- Símbolos de build output (○, ◐, ƒ)
- Migration checklist
- Tips de performance

**Cuando leer**: 
- Cada vez que crees una página o layout
- Cuando recibas errores de prerendering
- Para entender por qué una ruta debe tener Suspense

---

### 3. [`cache-components-build-errors.md`](./cache-components-build-errors.md)
**Guía de troubleshooting de errores de build**

Contiene:
- Por qué ocurren los errores de `headers()` durante prerendering
- Explicación detallada de la raíz del problema
- Soluciones paso a paso
- Comparativas (❌ WRONG vs ✅ CORRECT)
- Checklist de implementación
- Por qué NO usar `export const dynamic = "force-dynamic"`
- Interpretación de warnings en build output

**Cuando leer**: Cuando recibas errores como "During prerendering, headers() rejects..."

---

### 4. [`cache-components-examples.md`](./cache-components-examples.md)
**Ejemplos reales del codebase del proyecto**

Contiene:
- Ejemplo 1: Dashboard Layout (implementación correcta)
- Ejemplo 2: Server Actions con revalidación
- Ejemplo 3: Rutas dinámicas con parámetros
- Ejemplo 4: API routes con headers()
- Ejemplo 5: Formularios con React Hook Form + Zod
- Ejemplo 6: Patrones de queries Prisma
- Checklist de patrones

**Cuando leer**: Necesitas ver código real similar a lo que vas a escribir.

---

## Flujo de Lectura Recomendado

### Para nuevo desarrollador en el proyecto
1. Lee: [`copilot-instructions.md`](./copilot-instructions.md) - Secciones "Tech Stack" + "Architecture Overview"
2. Lee: [`cache-components.md`](./cache-components.md) - Sección "Core Pattern"
3. Consulta: [`cache-components-examples.md`](./cache-components-examples.md) - Ejemplo 1 (Dashboard Layout)

### Para implementar una nueva página
1. Consulta: [`cache-components.md`](./cache-components.md) - Sección "Template Base"
2. Adapta: Código de [`cache-components-examples.md`](./cache-components-examples.md)
3. Verifica: Checklist en [`cache-components.md`](./cache-components.md) - "Migration Checklist"

### Cuando obtienes error durante build
1. Lee: [`cache-components-build-errors.md`](./cache-components-build-errors.md) - "Problem Summary"
2. Encuentra: Tu patrón específico en "Implementation Checklist"
3. Consulta: [`cache-components.md`](./cache-components.md) - "Error Handling During Prerendering"

### Para implementar un formulario
1. Consulta: [`copilot-instructions.md`](./copilot-instructions.md) - "Form Handling (React Hook Form + Zod)"
2. Copia: Ejemplo de [`cache-components-examples.md`](./cache-components-examples.md) - "Ejemplo 5: Formularios"

### Para trabajar con la base de datos
1. Lee: [`copilot-instructions.md`](./copilot-instructions.md) - "Database & Prisma Patterns"
2. Consulta: [`cache-components-examples.md`](./cache-components-examples.md) - "Ejemplo 6: Prisma"

---

## Resumen Rápido

### Tecnologías Clave
- **Next.js 16.0.7** - Framework principal con Cache Components
- **React 19.2.0** - Library UI
- **TypeScript** - Lenguaje (strict mode)
- **Prisma 7.1.0** - ORM para SQLite/Turso
- **Tailwind CSS** - Estilos (tema CyberPunk personalizado)
- **React Hook Form + Zod** - Formularios y validación

### Patrón Principal (CRÍTICO)
```typescript
// ❌ NO HAGAS ESTO
export default async function Page() {
  const session = await getSession();
}

// ✅ HAZ ESTO
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  );
}

async function PageContent() {
  const session = await getSession();
}
```

### Convenciones Clave
| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Archivos | kebab-case | `user-profile.tsx` |
| Componentes | PascalCase | `UserCard.tsx` |
| Funciones | camelCase | `getUserData()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Booleanos | verb-based | `isLoading`, `hasPermission` |

### Build Output
```
○ (Static)          - Prerendered at build time (no runtime APIs)
◐ (Partial)         - Shell static + content dynamic (normal para dashboard)
ƒ (Dynamic)         - Server-rendered on demand (APIs)
```

---

## Archivos Relacionados en el Proyecto

### Configuración
- `next.config.ts` - Configuración con `cacheComponents: true`
- `tsconfig.json` - TypeScript configuration (ES2017, strict mode)
- `tailwind.config.ts` - Configuración de Tailwind
- `globals.css` - Variables de tema CyberPunk

### Estructura Principal
- `app/` - App Router de Next.js
- `app/dashboard/layout.tsx` - Implementación correcta de Cache Components
- `components/` - Componentes reutilizables
- `lib/` - Utilitarios y servicios
- `prisma/schema.prisma` - Modelos de base de datos

### Referencia de Código
- `lib/auth.ts` - Función `getSession()` (usa headers())
- `lib/prisma.db.ts` - Cliente Prisma singleton
- `lib/cn.ts` - Utilidad classNames

---

## Reglas de Oro

1. **Cache Components**: NUNCA accedas a `headers()`, `cookies()`, o `params` fuera de Suspense
2. **Tipos**: SIEMPRE tipos explícitos, nunca `any`
3. **Nombres**: Sigue las convenciones (kebab-case archivos, camelCase funciones, PascalCase componentes)
4. **Colores**: USA variables de tema, NO hardcodea colores en clases
5. **Build**: Los warnings sobre `headers()` son NORMALES y ESPERADOS
6. **Suspense**: SIEMPRE proporciona un fallback (Skeleton) rápido
7. **Prisma**: SIEMPRE usa `select` para limitar campos, NO `SELECT *`
8. **Validación**: USA Zod para toda validación de inputs

---

## Troubleshooting Rápido

| Problema | Solución | Referencia |
|----------|----------|-----------|
| Error "headers() rejects during prerendering" | Wrap en Suspense | [cache-components-build-errors.md](./cache-components-build-errors.md) |
| Ruta no se prerendeirza | OK normal - está en Partial Prerender | [cache-components.md](./cache-components.md) |
| "dynamic is not compatible with cacheComponents" | Remover `export const dynamic` | [copilot-instructions.md](./copilot-instructions.md) |
| TypeScript errors en props | Usa `interface ComponentProps` | [copilot-instructions.md](./copilot-instructions.md) |
| Colores no aplican | Usa variables de tema, no clases hardcodeadas | [copilot-instructions.md](./copilot-instructions.md) |

---

## Cómo GitHub Copilot Usa Esta Documentación

1. **Análisis de patrones**: Copilot analiza estos archivos para entender tu arquitectura
2. **Generación de código**: Genera código consistente con los patrones documentados
3. **Validación**: Verifica que el código siga las convenciones
4. **Warnings**: Te advierte si algo se desvía del patrón

**Asegúrate de que Copilot tenga acceso a estos archivos** para mejor precisión.

---

## Actualización de Esta Documentación

Estos archivos son **documentación viva**. Si encuentras:
- Patrones no documentados
- Errores en la documentación
- Mejoras a sugerir

Actualiza los archivos relevantes para mantenerlos sincronizados con la evolución del proyecto.

---

## Recursos Externos

- [Next.js 16 Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [React 19 Suspense](https://react.dev/reference/react/Suspense)
- [Prisma Docs](https://prisma.io/docs)
- [Zod Validation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Última actualización**: 22 de diciembre de 2025

Documentación para evitar problemas futuros con Cache Components en Next.js 16.
