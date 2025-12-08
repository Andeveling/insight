# 🚀 Next.js 16 Rapid Development Template

> Template profesional con Next.js 16, TypeScript, Tailwind CSS v4, Shadcn/ui, Better Auth y Prisma ORM. Diseñado para iniciar proyectos rápidamente con autenticación y base de datos configuradas.

## ✨ Características

- **⚡ Next.js 16** - Con Turbopack y Cache Components para máximo rendimiento
- **📘 TypeScript** - Tipado estático para código robusto
- **🎨 Tailwind CSS v4** - Framework CSS utility-first de última generación
- **🧩 Shadcn/ui** - Componentes reutilizables con Radix UI
- **🔐 Better Auth** - Autenticación completa con email/password
- **💾 Prisma ORM** - ORM moderno con SQLite configurado
- **🌱 Database Seeders** - Scripts para poblar la BD con datos de prueba
- **✅ ESLint** - Linting de código configurado

## 📋 Requisitos Previos

- Node.js 18+ o Bun
- npm, yarn, pnpm o bun

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPO] mi-nuevo-proyecto
cd mi-nuevo-proyecto
```

### 2. Instalar dependencias

```bash
npm install
# o
bun install
# o
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Database
DATABASE_URL="file:./data/dev.db"

# Better Auth - IMPORTANTE: Genera un nuevo secret
BETTER_AUTH_SECRET="tu-secret-de-al-menos-32-caracteres"
```

**Generar un secret seguro:**

```bash
openssl rand -base64 32
```

O usa el CLI de Better Auth:

```bash
npx @better-auth/cli secret
```

### 4. Configurar la Base de Datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar con usuarios de prueba
npm run db:seed
```

### 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000/login](http://localhost:3000/login) en tu navegador.

## 👥 Usuarios de Prueba

El seeder crea los siguientes usuarios con contraseña `password123`:

| Email | Contraseña | Propósito |
|-------|------------|-----------|
| test@example.com | password123 | Usuario general de prueba |
| admin@example.com | password123 | Usuario administrador |
| demo@example.com | password123 | Usuario para demos |

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter |
| `npm run db:generate` | Genera el cliente de Prisma |
| `npm run db:migrate` | Ejecuta las migraciones de BD |
| `npm run db:push` | Empuja cambios del schema a la BD |
| `npm run db:seed` | Pobla la BD con datos de prueba |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:reset` | Resetea la BD y re-ejecuta migraciones |

## 🔐 Detalles de Autenticación

### Estructura

- **Handler API**: `app/api/auth/[...all]/route.ts`
- **Cliente**: `lib/auth-client.ts`
- **Configuración**: `lib/auth.ts`
- **Página de Login**: `app/(auth)/login/page.tsx`

### Configuración

Better Auth está configurado con:
- ✅ Adaptador de Prisma
- ✅ Plugin `nextCookies` para Next.js
- ✅ Autenticación por email/password
- ✅ Base de datos SQLite

## 📁 Estructura del Proyecto

```
next16/
├── app/
│   ├── (auth)/
│   │   └── login/          # Página de login
│   ├── api/
│   │   └── auth/           # API de autenticación
│   └── layout.tsx
├── components/
│   └── ui/                 # Componentes de Shadcn/ui
├── lib/
│   ├── auth.ts            # Configuración de Better Auth
│   ├── auth-client.ts     # Cliente de autenticación
│   └── prisma.db.ts       # Cliente de Prisma
├── prisma/
│   ├── schema.prisma      # Schema de la base de datos
│   ├── migrations/        # Migraciones
│   └── seeders/           # Seeders
└── public/
```

## 🔧 Personalización

### Agregar Nuevos Modelos a Prisma

1. Edita `prisma/schema.prisma`
2. Crea una migración: `npm run db:migrate -- --name nombre_migracion`
3. Genera el cliente: `npm run db:generate`

### Crear Nuevos Seeders

1. Crea un archivo en `prisma/seeders/`
2. Exporta una función async que reciba `PrismaClient`
3. Importa y ejecuta en `prisma/seed.ts`

### Agregar Componentes de Shadcn/ui

```bash
npx shadcn@latest add [nombre-componente]
```

## 🎯 Próximos Pasos Sugeridos

### Funcionalidades Esenciales

- [ ] **Middleware de Autenticación** - Proteger rutas automáticamente
- [ ] **Página de Registro** - Permitir que usuarios se registren
- [ ] **Recuperación de Contraseña** - Reset de password por email
- [ ] **Perfil de Usuario** - Página para editar información del usuario
- [ ] **Roles y Permisos** - Sistema de autorización basado en roles

### Mejoras de Desarrollo

- [ ] **Testing** - Jest/Vitest + Playwright/Cypress
- [ ] **Storybook** - Documentación de componentes
- [ ] **Husky + Lint-staged** - Pre-commit hooks
- [ ] **Prettier** - Formateo automático de código
- [ ] **Conventional Commits** - Commits estandarizados

### Integraciones

- [ ] **OAuth Providers** - Login con Google, GitHub, etc.
- [ ] **Email Service** - SendGrid, Resend, etc.
- [ ] **File Upload** - Cloudinary, S3, etc.
- [ ] **Analytics** - Google Analytics, Plausible, etc.
- [ ] **Error Tracking** - Sentry, LogRocket, etc.

### Base de Datos

- [ ] **PostgreSQL** - Migrar de SQLite a PostgreSQL
- [ ] **Redis** - Cache y sessions
- [ ] **Database Backups** - Estrategia de respaldos

### UI/UX

- [ ] **Dark Mode** - Tema oscuro completo
- [ ] **Internacionalización (i18n)** - Soporte multi-idioma
- [ ] **Animaciones** - Framer Motion
- [ ] **Toast Notifications** - Sistema de notificaciones
- [ ] **Loading States** - Skeletons y spinners

### DevOps

- [ ] **Docker** - Containerización
- [ ] **CI/CD** - GitHub Actions
- [ ] **Deployment** - Vercel, Railway, Fly.io
- [ ] **Environment Management** - Staging, Production
- [ ] **Monitoring** - Uptime monitoring

## 🐛 Solución de Problemas

### Error: "Invalid BETTER_AUTH_SECRET"

Asegúrate de que tu `BETTER_AUTH_SECRET` en `.env` tenga al menos 32 caracteres.

### Error: "Table does not exist"

Ejecuta las migraciones:
```bash
npm run db:migrate
```

### Puerto 3000 en uso

Next.js automáticamente usará el siguiente puerto disponible (3001, 3002, etc.)

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de la base de datos SQLite | `file:./data/dev.db` |
| `BETTER_AUTH_SECRET` | Secret para Better Auth (min 32 chars) | Genera con `openssl rand -base64 32` |

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Better Auth](https://better-auth.com/)
- [Prisma](https://prisma.io/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**¿Listo para construir algo increíble?** 🚀

Si encuentras útil este template, ¡dale una ⭐ en GitHub!