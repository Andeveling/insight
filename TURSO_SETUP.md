# Pasos para completar la configuración de Turso

## ✅ Cambios completados:

1. **lib/prisma.db.ts** - Configurado para usar `@prisma/adapter-libsql`
2. **prisma/schema.prisma** - Provider configurado a `sqlite`
3. **lib/auth.ts** - Provider configurado a `sqlite`
4. **package.json** - Dependencias actualizadas (`@libsql/client`, `@prisma/adapter-libsql`)
5. **next.config.ts** - `serverExternalPackages` actualizado
6. **prisma.config.ts** - URL de base de datos configurada
7. **.env.example** - Documentación de variables de entorno
8. **.env.local** - Archivo creado para desarrollo local

## 📋 Próximos pasos:

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Generar cliente Prisma
```bash
pnpm db:generate
```

### 3. Para desarrollo local (SQLite):
```bash
# Crear/actualizar base de datos local
pnpm db:push

# (Opcional) Poblar con datos de prueba
pnpm db:seed
```

### 4. Probar localmente
```bash
pnpm dev
```

### 5. En Vercel - Configurar Turso:

#### a) En el dashboard de Turso (https://turso.tech):
- Crea una base de datos si no la tienes
- Obtén `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`

#### b) En tu proyecto de Vercel:
- Ve a **Settings** → **Environment Variables**
- Añade:
  - `TURSO_DATABASE_URL` = `libsql://[tu-db].turso.io`
  - `TURSO_AUTH_TOKEN` = (tu token)
  - `BETTER_AUTH_SECRET` = (tu secreto)
  - `BETTER_AUTH_URL` = `https://[tu-app].vercel.app`

### 6. Aplicar schema a Turso (primera vez):

Opción A - Usar Turso CLI:
```bash
# Instalar Turso CLI si no lo tienes
curl -sSfL https://get.tur.so/install.sh | bash

# Autenticarse
turso auth login

# Listar tus bases de datos
turso db list

# Aplicar el schema
turso db shell [nombre-db] < ./prisma/schema.sql
```

Opción B - Usar la consola web de Turso:
- Copia el contenido de las migraciones SQL
- Pégalo en la consola SQL de tu base de datos en el dashboard

### 7. Deploy a Vercel:
```bash
git add .
git commit -m "feat: migrate to Turso (libSQL) for Vercel compatibility"
git push
```

## 🔍 Verificación:

Después del deploy, verifica que:
- ✅ El build en Vercel se completa sin errores
- ✅ La aplicación se conecta correctamente a Turso
- ✅ No hay errores de `better-sqlite3` en los logs

## 📝 Notas importantes:

- **Desarrollo local**: Usa SQLite local (`file:./prisma/dev.db`)
- **Producción (Vercel)**: Usa Turso automáticamente cuando detecta `TURSO_DATABASE_URL`
- **Migraciones**: Para cambios de schema, aplica las migraciones localmente primero, luego aplícalas a Turso manualmente
- **Sin `@libsql/client` importado**: No es necesario importar `createClient`, el adapter `PrismaLibSql` lo maneja internamente

## ❓ Si tienes problemas:

1. Verifica que las variables de entorno estén correctamente configuradas en Vercel
2. Revisa los logs de build en Vercel
3. Verifica que el `TURSO_AUTH_TOKEN` sea válido
4. Asegúrate de que el schema esté aplicado en la base de datos de Turso
