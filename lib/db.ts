import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let dbInstance: PrismaClient | null = null;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    const error = new Error('DATABASE_URL environment variable is not set');
    console.error('[DB] Error:', error.message);
    throw error;
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('[DB] Failed to create Prisma client:', error);
    throw error;
  }
}

function getDb(): PrismaClient {
  if (dbInstance) {
    return dbInstance;
  }

  if (globalForPrisma.prisma) {
    dbInstance = globalForPrisma.prisma;
    return dbInstance;
  }

  dbInstance = createPrismaClient();
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = dbInstance;
  }

  return dbInstance;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getDb()[prop as keyof PrismaClient];
  },
});
