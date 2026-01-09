// packages/database/src/index.ts
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * Prevents multiple instances in development
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Prevent multiple Prisma instances in development
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// Re-export everything from Prisma Client
export * from '@prisma/client';