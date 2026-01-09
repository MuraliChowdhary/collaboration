// packages/shared/src/utils/errors.ts

/**
 * Base Application Error Class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code || this.constructor.name.toUpperCase();
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * 400 - Bad Request
 * Used for validation errors and malformed requests
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * 401 - Unauthorized
 * Used when authentication is required but not provided or invalid
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * 403 - Forbidden
 * Used when user is authenticated but doesn't have permission
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * 404 - Not Found
 * Used when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

/**
 * 409 - Conflict
 * Used when request conflicts with current state (e.g., duplicate email)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 429 - Too Many Requests
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * 500 - Internal Server Error
 * Used for unexpected errors
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details, false);
  }
}

/**
 * 503 - Service Unavailable
 * Used when a dependent service is unavailable
 */
export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super(`${service} is currently unavailable`, 503, 'SERVICE_UNAVAILABLE');
  }
}