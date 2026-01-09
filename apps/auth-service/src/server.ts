// apps/auth-service/src/server.ts

import dotenv from 'dotenv';
import { createApp } from './app';
import { connectDatabase } from './config/database';
import { getRedisClient } from './config/redis';
import { validateJwtConfig } from './config/jwt';
import { logger } from '@repo/shared';

// Load environment variables
dotenv.config();

// Validate configuration
validateJwtConfig();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server
 */



async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Connect to Redis
    await getRedisClient();

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(PORT, () => {
      logger.info(`
      ✅ Auth Service Started Successfully
      
      🌍 Environment: ${NODE_ENV}
      🚀 Server running on port: ${PORT}
      📡 Health check: http://localhost:${PORT}/health
      📚 API Base: http://localhost:${PORT}/api/v1/auth
      
      Press CTRL+C to stop
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();