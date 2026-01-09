// apps/auth-service/src/app.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorHandler } from '@repo/shared';
import { httpLogStream } from '@repo/shared';
import authRoutes from './routes/auth.routes';

/**
 * Create Express Application
 */
export function createApp(): Application {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================
  app.use(helmet()); // Security headers
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
    })
  );

  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.send('Auth Service is running');
  });

  // ============================================
  // GENERAL MIDDLEWARE
  // ============================================
  app.use(compression()); // Compress responses
  app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
  app.use(cookieParser()); // Parse cookies

  // ============================================
  // LOGGING
  // ============================================
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined', { stream: httpLogStream }));
  }

  // ============================================
  // HEALTH CHECK
  // ============================================
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Auth service is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // ============================================
  // API ROUTES
  // ============================================
  app.use('/api/v1/auth', authRoutes);

  // ============================================
  // ERROR HANDLING
  // ============================================
//   app.use(notFoundHandler); // 404 handler
  app.use(errorHandler); // Global error handler

  return app;
}