export default {
  datasource: {
    url: 'file:./prisma/dev.db',
  },
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
}
