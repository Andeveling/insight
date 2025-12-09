const config = {
  datasource: {
    // For local development, use local SQLite file
    // For production (Vercel), use TURSO_DATABASE_URL from environment
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  },
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
};

export default config;
