import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Prisma CLI uses LOCAL_DATABASE_URL for migrations
  // Runtime uses TURSO_DATABASE_URL via the adapter in prisma.db.ts
  datasource: {
    url: env('LOCAL_DATABASE_URL'),
  },
})
