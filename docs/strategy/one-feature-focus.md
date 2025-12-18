# One Feature Focus: Public Strength Portfolio

**Version**: 1.0.0  
**Created**: 17 de diciembre de 2025  
**Author**: Andres Parra  
**Status**: Strategic Vision

---

## El Principio de Guillermo Rauch

> "Be the best at ONE small thing. Then expand from that strength."

Este documento define **LA feature única** en la que Insight debe ser excepcional, y cómo esta feature conecta directamente con la fórmula de Naval Ravikant para generar riqueza.

---

## 🎯 La Feature: Public Strength Portfolio

**"La forma más creíble de demostrar tus fortalezas es mostrando evidencia pública de que las has aplicado."**

### Concepto Central

Un **perfil público personalizable** donde cada usuario demuestra sus Top 5 fortalezas mediante evidencia concreta: proyectos completados, challenges resueltos, módulos dominados, y artefactos publicados.

**URL ejemplo**: `insight.app/@andres`

---

## 🔥 Por Qué Esta Es LA Feature Correcta

### 1. Diferenciación Radical

| Competidor              | Qué Hacen                         | Qué NO Hacen                           |
| ----------------------- | --------------------------------- | -------------------------------------- |
| HIGH5                   | Assessment + informe PDF estático | Portfolio público con evidencia        |
| Gallup CliftonStrengths | Test + reporte personal           | Mostrar aplicación real de fortalezas  |
| 16Personalities         | Perfil de personalidad            | Tracking de desarrollo + progreso      |
| **Insight**             | Assessment + Desarrollo           | **Portfolio público gamificado**       |

**Nadie más conecta:**
- Descubrimiento de fortalezas
- Desarrollo gamificado
- Evidencia pública de aplicación
- Portfolio como herramienta de reputación

### 2. Conexión Directa con Naval Ravikant

La fórmula de Naval traducida a Insight:

```
(Conocimiento Específico + Responsabilidad) × Apalancamiento = Riqueza
```

**Mapeo a la feature:**

| Elemento Naval              | Implementación en Insight                              |
| --------------------------- | ------------------------------------------------------ |
| **Conocimiento Específico** | Top 5 Fortalezas identificadas + módulos completados   |
| **Responsabilidad**         | Publicar portfolio público = poner tu nombre en juego  |
| **Apalancamiento**          | URL pública funciona 24/7, cada view es un lead        |
| **Riqueza**                 | Reputación + oportunidades + libertad profesional      |

### 3. Viral por Diseño

**Loop de crecimiento orgánico:**

1. Usuario completa assessment → obtiene Top 5
2. Usuario desarrolla fortalezas → gana XP + badges
3. Usuario publica portfolio → obtiene URL pública
4. Portfolio se comparte en LinkedIn/Twitter
5. Viewers ven el portfolio → CTR a "Descubre tus fortalezas"
6. Nuevos usuarios → Loop reinicia

**Cada perfil público es un anuncio gratuito.**

### 4. Monetización Natural (Freemium)

**Free Tier:**
- Assessment básico
- Perfil público con URL genérica (`insight.app/u/abc123`)
- Max 3 artefactos publicados

**Pro Tier ($9/mes):**
- URL personalizada (`insight.app/@andres`)
- Artefactos ilimitados
- Analytics de perfil (views, engagement)
- Exportar a PDF premium
- Badges exclusivos

**Team Tier ($49/mes):**
- Portfolios de equipo
- Sub-team matching
- Org-level analytics

### 5. Simple pero Profundo

**MVP mínimo (2 semanas):**
- Ruta pública: `app/[username]/page.tsx`
- 4 secciones: Hero (Top 5), Stats (XP, nivel), Achievements (badges), Evidence (releases)
- Share buttons (Twitter, LinkedIn)

**Expansiones naturales:**
- Themes y customización
- Embeddable widgets
- Portfolio comparisons
- Testimonials/endorsements

---

## 📐 Arquitectura de la Feature

### Modelo de Datos (Prisma)

```prisma
model PublicProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  username        String   @unique  // @andres
  slug            String   @unique  // andres (for URL)
  displayName     String
  bio             String?
  isPublic        Boolean  @default(true)
  customDomain    String?  // Pro feature
  
  // Analytics
  viewCount       Int      @default(0)
  uniqueViewers   Int      @default(0)
  lastViewedAt    DateTime?
  
  // Customization (Pro)
  themeColor      String   @default("default")
  layout          String   @default("standard") // standard | compact | showcase
  
  // SEO
  metaTitle       String?
  metaDescription String?
  ogImage         String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  releases        PortfolioRelease[]
  views           ProfileView[]
  
  @@index([slug])
  @@index([isPublic])
  @@index([viewCount])
}

model PortfolioRelease {
  id              String   @id @default(uuid())
  profileId       String
  userId          String
  
  title           String
  description     String
  content         String?  // Markdown
  
  // Type
  artifactType    String   // "project" | "challenge" | "reflection" | "case-study"
  
  // Linked Resources
  moduleId        String?
  challengeId     String?
  strengthKeys    String[] // Array de fortalezas aplicadas
  
  // External Links
  githubUrl       String?
  liveUrl         String?
  mediaUrls       String[] // Screenshots, videos
  
  // Engagement
  viewCount       Int      @default(0)
  shareCount      Int      @default(0)
  
  // XP Reward
  xpAwarded       Int
  reputationBonus Int      @default(0)
  
  publishedAt     DateTime
  featuredUntil   DateTime? // Destacado en homepage
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  profile         PublicProfile          @relation(fields: [profileId], references: [id], onDelete: Cascade)
  user            User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  module          DevelopmentModule?     @relation(fields: [moduleId], references: [id])
  challenge       Challenge?             @relation(fields: [challengeId], references: [id])
  
  @@index([profileId, publishedAt])
  @@index([publishedAt, featuredUntil])
  @@index([artifactType])
}

model ProfileView {
  id              String   @id @default(uuid())
  profileId       String
  viewerIp        String?  // Hashed for privacy
  viewerUserId    String?  // If logged in
  referer         String?
  userAgent       String?
  viewedAt        DateTime @default(now())
  
  profile         PublicProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  @@index([profileId, viewedAt])
  @@index([viewerUserId])
}
```

### Rutas y Páginas

```typescript
// Public Routes
app/[username]/page.tsx                      // Public profile viewer
app/[username]/releases/[slug]/page.tsx      // Individual release detail
app/explore/page.tsx                         // Featured profiles discovery

// Private Dashboard Routes
app/dashboard/portfolio/page.tsx             // Portfolio manager
app/dashboard/portfolio/releases/page.tsx    // Releases list
app/dashboard/portfolio/releases/new/page.tsx // Create new release
app/dashboard/portfolio/settings/page.tsx    // Customize profile
app/dashboard/portfolio/analytics/page.tsx   // Pro: detailed analytics
```

### Server Actions

```typescript
// app/dashboard/portfolio/_actions/

export async function createPublicProfile(data: CreateProfileInput) {
  // 1. Check username availability
  // 2. Validate username format (@username)
  // 3. Create PublicProfile record
  // 4. Set default settings
  // 5. Award "Publisher" badge
  // 6. Return profile URL
}

export async function publishRelease(data: ReleaseInput) {
  // 1. Validate user has completed related module/challenge
  // 2. Create PortfolioRelease
  // 3. Award Reputation XP (100 base + views)
  // 4. Check for "Publisher" badge unlock
  // 5. Update user gamification stats
  // 6. Return release URL for sharing
}

export async function trackProfileView(profileSlug: string) {
  // 1. Increment viewCount
  // 2. Track unique viewer (cookie/IP hash)
  // 3. Log ProfileView for analytics
  // 4. Award reputation XP to profile owner (1 XP per unique view, max 10/day)
  // 5. Return view metadata
}

export async function updateProfileSettings(settings: ProfileSettings) {
  // 1. Validate Pro features if used (custom URL, themes)
  // 2. Update PublicProfile
  // 3. Regenerate OG image if needed
  // 4. Purge CDN cache for public URL
  // 5. Return updated profile
}

export async function getProfileAnalytics(profileId: string) {
  // Pro feature
  // 1. Aggregate ProfileView data
  // 2. Calculate engagement metrics
  // 3. Return analytics dashboard data
}
```

---

## 🚀 Roadmap de Implementación (4 Semanas)

### Fase 0: Fundamentos (Días 1-3)

**Objetivo**: Modelos y rutas básicas funcionando

- [ ] Crear carpeta `/docs/strategy/`
- [ ] Schema Prisma: `PublicProfile`, `PortfolioRelease`, `ProfileView`
- [ ] Migration: `bunx prisma migrate dev --name add-public-portfolio`
- [ ] Seed 3 portfolios demo: @andres, @dani, @edwar
- [ ] Server action: `createPublicProfile` con validación de username

**Validación**: Poder crear un profile público desde Prisma Studio

---

### Fase 1: MVP Público (Días 4-7)

**Objetivo**: Perfil público funcional y compartible

**Componentes UI:**
- [ ] `PublicProfileHero` - Top 5 + nivel + XP + bio
- [ ] `PublicProfileStats` - Módulos completados, challenges, badges count
- [ ] `PortfolioReleaseCard` - Tarjeta de evidencia con links externos
- [ ] `ShareButtons` - Twitter, LinkedIn, Copy URL con toast
- [ ] `PublicProfileLayout` - Layout limpio para perfiles públicos

**Páginas:**
- [ ] `app/[username]/page.tsx` - Perfil público completo
- [ ] `app/dashboard/portfolio/page.tsx` - Manager privado (vista overview)
- [ ] `app/dashboard/portfolio/releases/new/page.tsx` - Form crear release

**Features:**
- [ ] Username claim en onboarding (opcional, default auto-generated)
- [ ] Botón "Ver mi portfolio público" en profile dashboard
- [ ] Share URL con OG tags (Open Graph para redes sociales)
- [ ] Analytics básico (view count visible en dashboard)

**Validación**: Crear portfolio público, compartir URL, ver en otra ventana

---

### Fase 2: Integración Gamificación (Días 8-11)

**Objetivo**: Conectar portfolio con sistema XP/badges existente

**Mecánicas XP:**
- [ ] **Reputation XP**: 100 XP por primer release publicado
- [ ] **View Bonus**: +1 XP por unique view (max 10 XP/día)
- [ ] **Quality Bonus**: +50 XP si release tiene GitHub URL o Live URL
- [ ] **Streak**: publicar 1 release/semana durante 4 semanas = +500 XP

**Badges Nuevos:**
- [ ] "Publisher" (Bronze): primer release publicado
- [ ] "Builder" (Silver): 10 releases publicados
- [ ] "Influencer" (Gold): 100 unique views totales
- [ ] "Consistent Builder" (Silver): 4 semanas streak
- [ ] "Master Builder" (Gold): 25 releases + 500 views

**Integraciones:**
- [ ] Botón "Publicar en Portfolio" en module completion screen
- [ ] Botón "Publicar en Portfolio" en challenge completion modal
- [ ] Auto-suggest vincular release a module/challenge completado recientemente
- [ ] Toast XP gain al publicar release
- [ ] Badge unlock modal si se desbloquea badge

**Validación**: Completar module → publicar release → ganar XP + ver badge

---

### Fase 3: Viralidad & Discovery (Días 12-15)

**Objetivo**: Maximizar compartidos y conversión de viewers

**Features de Viralidad:**
- [ ] OG images dinámicos con Vercel OG (@vercel/og)
- [ ] Twitter Card optimization (summary_large_image)
- [ ] LinkedIn unfurl optimization
- [ ] Página `/explore` - Featured profiles públicos
- [ ] Leaderboard: Top 10 Builders del Mes (por releases + views)
- [ ] Embed widget: `<iframe src="insight.app/@andres/embed">`

**CTAs para Conversión:**
- [ ] Footer en perfiles públicos: "Descubre tus fortalezas → Start Free"
- [ ] Modal en viewers no-logged: "¿Quieres crear tu portfolio?" (después 30s)
- [ ] Banner en `/explore`: "Join 100+ builders showcasing their strengths"

**SEO & Performance:**
- [ ] Sitemap para perfiles públicos
- [ ] Meta tags optimizados por perfil
- [ ] Static generation para perfiles populares (ISR)
- [ ] CDN caching para public profiles

**Validación**: Compartir en Twitter/LinkedIn → ver preview card → click → signup

---

### Fase 4: Monetización Pro (Días 16-20)

**Objetivo**: Lanzar Pro tier y validar willingness to pay

**Pro Features Implementadas:**
- [ ] Custom username (`@andres` en vez de `/u/abc123`)
- [ ] Unlimited releases (free tier = max 3 releases)
- [ ] Portfolio analytics dashboard (views, referrers, top releases)
- [ ] Custom theme colors (3 themes premium)
- [ ] Portfolio export to PDF (diseño profesional)
- [ ] Priority listing en `/explore` (aparece primero)
- [ ] Remove "Powered by Insight" footer

**Stripe Integration:**
- [ ] Stripe account setup
- [ ] Subscription plans: Pro ($9/mes) y Team ($49/mes)
- [ ] Checkout flow desde `/dashboard/portfolio/settings`
- [ ] Webhook handling (subscription.created, subscription.updated, etc.)
- [ ] Feature gates en UI (mostrar "Upgrade to Pro" en features bloqueadas)

**Upgrade Prompts:**
- [ ] Al intentar crear 4° release en free tier
- [ ] Al intentar cambiar username
- [ ] Banner en analytics: "Unlock detailed analytics with Pro"
- [ ] Tooltip en custom themes: "Pro feature"

**Validación**: Intentar feature Pro → ver prompt → completar checkout → acceder

---

### Post-Launch: Iteración Continua (Semanas 5-8)

**Semana 5: Recoger Feedback**
- [ ] User interviews: 10 usuarios que publicaron portfolio
- [ ] Analytics review: ¿qué releases tienen más views?
- [ ] Conversion funnel: viewer → signup rate
- [ ] Identificar friction points

**Semana 6: Optimización UI/UX**
- [ ] Iterar diseño de `PublicProfileHero` basado en heatmaps
- [ ] Mejorar CTA placement
- [ ] A/B test: diferentes versiones de upgrade prompt
- [ ] Reducir time-to-first-release

**Semana 7: Expansión de Features**
- [ ] Portfolio testimonials/endorsements (peer validation)
- [ ] Release comments (permitir feedback en releases)
- [ ] Portfolio templates (3 layouts predefinidos)
- [ ] Badge showcase customization

**Semana 8: Growth Experiments**
- [ ] Referral program: "Invite a friend, both get 1 month Pro"
- [ ] Content marketing: 5 blog posts sobre portfolios de fortalezas
- [ ] Partner outreach: coaches, consultores, escuelas
- [ ] Product Hunt re-launch con Pro tier

---

## 🎮 Mecánicas de Gamificación Detalladas

### XP Economy

| Acción                           | XP Base | Bonus/Condiciones                       |
| -------------------------------- | ------- | --------------------------------------- |
| Crear primer release             | 100     | +50 si linked a module advanced         |
| Release con GitHub/Live URL      | 150     | Evidencia externa = calidad premium     |
| Release visualizado (único)      | 1       | Max 10 XP/día por profile               |
| Release compartido con conversión| 25      | Si viewer hace signup y menciona tu URL |
| Release featured en `/explore`   | 250     | Seleccionado manualmente por equipo     |
| Streak 4 semanas (1 release/sem) | 500     | + Badge "Consistent Builder"            |
| 10 releases publicados           | 300     | Milestone achievement                   |
| 100 unique views en portfolio    | 200     | Influencer status reached               |

### Badges Exclusivos de Portfolio

| Badge                  | Criterio                                | Tier     | XP Reward |
| ---------------------- | --------------------------------------- | -------- | --------- |
| **Publisher**          | Primer release publicado                | Bronze   | 50        |
| **Builder**            | 10 releases publicados                  | Silver   | 150       |
| **Influencer**         | 100 unique views en portfolio total     | Gold     | 200       |
| **Master Builder**     | 25 releases + 500 views                 | Gold     | 300       |
| **Consistent**         | 4 semanas seguidas publicando           | Silver   | 200       |
| **Showcase Star**      | Featured en `/explore` 3 veces          | Platinum | 500       |
| **Force Multiplier**   | 5 collaborative challenges publicados   | Gold     | 250       |
| **Thought Leader**     | 10 releases con >50 views cada uno      | Platinum | 400       |

### Reputation Score System

**Reputation Score** = fórmula calculada:

```typescript
reputationScore = 
  (releases × 10) +
  (uniqueViews × 0.5) +
  (sharesWithConversion × 20) +
  (featuredCount × 50) +
  (endorsements × 15) // future feature
```

**Niveles de Reputación:**

1. **Emerging** (0-100): perfil nuevo, primeros pasos
2. **Known** (100-500): varios releases, audiencia inicial
3. **Recognized** (500-1500): audiencia activa, impacto visible
4. **Influential** (1500-5000): referente en su área
5. **Legendary** (5000+): top 1% builders, mentor natural

**UI Indicators:**
- Badge de reputación junto al username
- Progress bar hacia siguiente nivel
- Leaderboard placement visible

---

## 📊 Métricas de Éxito

### North Star Metric

**"Número de portfolios públicos con ≥1 release y ≥10 unique views"**

**Por qué**: Mide adopción completa del loop viral (crear → publicar → compartir → impacto)

### KPIs Primarios (Mes 1-3)

| Métrica                            | Target M1 | Target M3 | Actual | Status |
| ---------------------------------- | --------- | --------- | ------ | ------ |
| Portfolios públicos creados        | 30        | 100       | -      | 🎯     |
| Releases publicados (total)        | 80        | 300       | -      | 🎯     |
| Releases/usuario activo (promedio) | 2         | 3         | -      | 🎯     |
| Views únicos (promedio/portfolio)  | 10        | 25        | -      | 🎯     |
| Conversión viewer → signup         | 5%        | 8%        | -      | 🎯     |
| Shares sociales                    | 50        | 150       | -      | 🎯     |
| Pro upgrades                       | 3         | 10        | -      | 🎯     |

### KPIs Secundarios

- **Time to first release**: <24h post-assessment (target: 60% de usuarios)
- **Release completion rate**: 70%+ finalizan form de publicación
- **Retention 30 días**: 60%+ usuarios con portfolio vuelven
- **NPS de feature**: 50+ (measured after using for 2 weeks)
- **Referral rate**: 15%+ usuarios invitan a otro
- **Pro conversion**: 8-12% de free users upgrade en 60 días

### Analytics Dashboard (Para Insight Team)

**Métricas a trackear:**
- Daily Active Portfolios (DAP)
- Weekly Portfolio Views (aggregate)
- Conversion funnel: Assessment → Portfolio Created → First Release → 10 Views
- Viral coefficient: new signups from portfolio shares / total portfolio shares
- Pro upgrade triggers: qué feature bloqueada genera más upgrades

---

## 🧠 Estrategia de Lanzamiento (4 Semanas)

### Pre-Launch (Semana -1)

**Objetivo**: Generar expectación y waitlist

1. **Teaser en homepage**: "Coming Soon: Public Strength Portfolios 🚀"
2. **Email a early adopters**: 50 usuarios actuales invitados a beta privada
3. **Crear 3 portfolios demo públicos**:
   - `@andres` (founder, Strategist + Catalyst)
   - `@dani` (CEO, Commander + Strategist)
   - `@edwar` (developer, Problem Solver + Focus Expert)
4. **Blog post draft**: "Por qué necesitas un portfolio de fortalezas (no solo un CV)"
5. **Video demo**: 90 segundos mostrando el flujo completo

---

### Launch Week (Semana 0)

**Día 1 (Lunes): Soft Launch**
- [ ] Email a beta users (50): "Tu portfolio público está listo"
- [ ] In-app banner: "New: Publish your strength portfolio"
- [ ] Monitor errors, performance

**Día 2-3 (Martes-Miércoles): Adjustments**
- [ ] Fix bugs reportados
- [ ] Optimizar performance si slow
- [ ] Recoger primeros 5 feedbacks

**Día 4 (Jueves): Public Launch**
- [ ] **Product Hunt launch**: con video + 3 demos
- [ ] **Twitter thread**: @andeveling sobre filosofía Naval → Insight
- [ ] **LinkedIn post**: caso de uso B2B (hiring + team optimization)
- [ ] **Email blast**: a toda la base de usuarios (200+)
- [ ] **HackerNews post**: "Show HN: Public portfolios for your strengths"

**Día 5 (Viernes): Amplification**
- [ ] Responder comentarios en PH, HN, redes
- [ ] Compartir testimonials de primeros users
- [ ] Analytics review: qué está funcionando

---

### Post-Launch (Semanas 1-4)

**Semana 1: Escuchar**
- User interviews: 10 usuarios que crearon portfolio
- Analytics deep dive: funnels, drop-offs
- Identificar top requests de features

**Semana 2: Iterar**
- Implementar top 3 quick wins
- Optimizar CTAs basado en conversion data
- Pulir UI/UX de pain points

**Semana 3: Amplificar**
- Lanzar `/explore` page con featured profiles
- Activar referral program beta
- Publicar blog post #2: "5 best strength portfolios this month"

**Semana 4: Monetizar**
- Lanzar Pro tier públicamente
- Email a power users: "Upgrade to Pro and get..."
- A/B test pricing ($7 vs $9 vs $12)

---

## 🎯 Competitive Moat (Por Qué Somos Insuperables)

### 1. Data Flywheel

Más usuarios → más portfolios → más ejemplos inspiradores → más credibilidad → más usuarios

**Network effect**: Cada portfolio público es un caso de uso real que vende el producto.

### 2. Gamificación Profunda

XP + badges + streaks + reputation score = **hábito adictivo**

Competidores solo tienen tests estáticos. Nosotros tenemos un sistema de progresión continuo.

### 3. AI-Powered Personalization

- **User DNA**: síntesis única de fortalezas combinadas
- **AI Coach**: recomendaciones personalizadas de qué publicar
- **Smart suggestions**: "Tu Strategist + Problem Solver serían perfectos para este tipo de proyecto"

### 4. Community & Social Proof

- Peer learning built-in (collaborative challenges)
- Public leaderboards (top builders)
- Testimonials/endorsements entre usuarios (future)

### 5. Filosofía Naval Integrada

**Único producto que conecta:**
- Autodescubrimiento (Conocimiento Específico)
- Desarrollo gamificado (Responsabilidad práctica)
- Portfolio público (Apalancamiento 24/7)
- → Resultado: Riqueza (libertad + reputación)

### Barreras de Entrada para Competidores

1. **Contenido educativo**: 30 módulos + 145 challenges (3 meses de trabajo)
2. **Sistema de gamificación balanceado**: tuning de XP economy lleva semanas
3. **AI prompts optimizados**: para DNA generation, recomendaciones
4. **Community de early adopters**: network effects desde día 1
5. **Filosofía coherente**: Naval + psicología positiva + gamificación = difícil de replicar

---

## 💡 Tu Próximo Paso (Hoy)

### Acción Inmediata #1: Crea Tu Propio Portfolio

**Dogfooding obligatorio:**

1. Completa el assessment (si no lo has hecho)
2. Completa 2 módulos de tus Top 5 fortalezas
3. Publica tu primer release: **"Cómo diseñé el sistema de gamificación de Insight aplicando Strategist + Problem Solver"**

**Por qué esto primero:**
- Te obliga a usar el producto como usuario
- Identificas friction points antes de que lo hagan otros
- Tu portfolio será el ejemplo #1 para mostrar
- Es tu **responsabilidad pública** (Naval en acción)

---

### Acción Inmediata #2: Escribe el Primer Migration

```bash
cd /home/andres/Proyectos/insight

# Añadir modelos al schema
# Editar: prisma/schema.prisma

# Crear migration
bunx prisma migrate dev --name add-public-portfolio

# Ver en Studio
bunx prisma studio
```

---

### Acción Inmediata #3: Seed Portfolio Demo

```typescript
// prisma/seeders/public-profiles.seed.ts

export async function seedPublicProfiles() {
  const andres = await prisma.user.findUnique({ 
    where: { email: "andres@nojau.co" } 
  });
  
  if (!andres) return;
  
  const profile = await prisma.publicProfile.create({
    data: {
      userId: andres.id,
      username: "@andres",
      slug: "andres",
      displayName: "Andres Parra",
      bio: "Fullstack dev apasionado por IA, gamificación y autodescubrimiento. De instalador de ventanas a Engineer Lead.",
      isPublic: true,
    }
  });
  
  // Crear primer release demo
  await prisma.portfolioRelease.create({
    data: {
      profileId: profile.id,
      userId: andres.id,
      title: "Sistema de Gamificación de Insight",
      description: "Diseño e implementación del sistema completo de XP, niveles y badges.",
      artifactType: "project",
      strengthKeys: ["Strategist", "Problem Solver", "Catalyst"],
      githubUrl: "https://github.com/Andeveling/insight",
      xpAwarded: 150,
      publishedAt: new Date(),
    }
  });
}
```

---

## 🔗 Recursos y Referencias

### Inspiración de Diseño

- [Linear Changelog](https://linear.app/changelog) - Storytelling de producto excelente
- [Polywork](https://polywork.com) - Portfolios profesionales (pero sin fortalezas)
- [ReadCV](https://read.cv) - Minimalismo y elegancia
- [Bento](https://bento.me) - Link-in-bio con personalización

### Frameworks Técnicos

- [Vercel OG Image Generation](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Prisma Upsert Patterns](https://www.prisma.io/docs/orm/reference/prisma-client-reference#upsert)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/build-subscriptions)

### Lecturas Clave

- [Naval Ravikant's Almanack](https://www.navalmanack.com/)
- [Hooked by Nir Eyal](https://www.nirandfar.com/hooked/)
- [Build in Public Movement](https://trends.vc/trends-0033-build-in-public/)

---

## 📝 Conclusión: La Apuesta

**Este es el repo faro.** No los 160 otros repos sin terminar.

**Esta es LA feature.** No las 10 dispersas del roadmap anterior.

**Este es tu conocimiento específico:**
- Next.js + TypeScript + IA (technical stack)
- Gamificación que crea hábito (product design)
- Autodescubrimiento de fortalezas (psychology + UX)

**Esta es tu responsabilidad pública:**
- Tu propio portfolio: `insight.app/@andres`
- Tu primer release: "Cómo diseñé Insight aplicando Strategist + Problem Solver"
- Este documento de estrategia (accountability)

**Este es tu apalancamiento:**
- Cada portfolio funciona 24/7 sin tu intervención
- Cada usuario es un vendedor orgánico
- Cada release es contenido evergreen que atrae nuevos usuarios

**Esta es tu riqueza:**
- Libertad para trabajar en lo que te apasiona
- Reputación como builder de productos gamificados + IA
- Oportunidades que vienen a ti (no tú persiguiéndolas)

---

### Formula Naval Aplicada a Ti

```
(Next.js + IA + Gamificación + Fortalezas) 
  × 
(Portfolio Público + Insight.app + Este Documento) 
  = 
Libertad Profesional + Reputación + Ingresos
```

**Ahora toca ejecutar.**

El miedo a la responsabilidad se cura con micro-releases públicos.  
Empieza con uno. Luego otro. Luego otro.

160 repos sin terminar → 1 repo con releases públicos semanales.

Esa es la diferencia entre exploración y construcción de riqueza.

---

**Primer commit de este documento = tu primer acto de responsabilidad.**

Let's build. 🚀
