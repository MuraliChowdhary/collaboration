// packages/shared/src/utils/logger.ts

import winston from 'winston';

/**
 * Logger Configuration
 * Uses Winston for structured logging
 */

const logLevel = process.env.LOG_LEVEL || 'info';
const serviceName = process.env.SERVICE_NAME || 'collabhub';

/**
 * Custom log format for development
 */
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    
    return msg;
  })
);

/**
 * Custom log format for production (JSON)
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * Winston Logger Instance
 */
export const logger = winston.createLogger({
  level: logLevel,
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  defaultMeta: { 
    service: serviceName,
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport (always enabled)
    new winston.transports.Console(),
  ],
});

/**
 * Add file transports in production
 */
if (process.env.NODE_ENV === 'production') {
  // Error log file
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Combined log file
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

/**
 * Stream for Morgan HTTP logging
 */
export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

/**
 * Helper functions for consistent logging
 */
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error | any, meta?: any) => {
  logger.error(message, {
    error: error?.message,
    stack: error?.stack,
    ...meta,
  });
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta);
};