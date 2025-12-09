const config = {
  datasource: {
    // For production (Vercel/Turso), use TURSO_DATABASE_URL
    // For local development, use DATABASE_URL or fallback to local SQLite
    url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./prisma/dev.db',
  },
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
};

export default config;
