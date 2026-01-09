// apps/auth-service/src/config/database.ts

import { prisma } from '@repo/database';
import { logger } from '@repo/shared';

/**
 * Export Prisma client from database package
 */
export { prisma };

/**
 * Connect to database
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed', error);
    process.exit(1);
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Error disconnecting database', error);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});