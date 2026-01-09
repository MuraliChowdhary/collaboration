// /**
//  * Shared Package Exports
//  * Central export file for all shared utilities
//  */

// // =======================
// // Error Classes (runtime)
// // =======================
// export {
//   AppError,
//   ValidationError,
//   AuthenticationError,
//   AuthorizationError,
//   NotFoundError,
//   ConflictError,
//   RateLimitError,
//   InternalServerError,
//   ServiceUnavailableError,
// } from './utils/errors';

// // =======================
// // API Response (runtime)
// // =======================
// export {
//   ApiResponse,
//   calculatePagination,
// } from './utils/api-response';

// // =======================
// // API Response (types)
// // =======================
// export type {
//   ApiResponseData,
//   PaginationMeta,
// } from './utils/api-response';

// // =======================
// // Logger (runtime)
// // =======================
// export {
//   logger,
//   httpLogStream,
//   logInfo,
//   logError,
//   logWarn,
//   logDebug,
//   logHttp,
// } from './utils/logger';

// // =======================
// // Middleware (runtime)
// // =======================
// export {
//   errorHandler,
// //   notFoundHandler,
// } from './middleware/error-handler';

// export {
//   validate,
//   validateBody,
//   validateQuery,
//   validateParams,
// } from './middleware/validate';




// packages/shared/src/index.ts

/**
 * Shared Package Exports
 * Central export file for all shared utilities
 */

// Error Classes
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
} from './utils/errors';

// API Response Utilities
export {
  ApiResponse,
  ApiResponseData,
  PaginationMeta,
  calculatePagination,
} from './utils/api-response';

// Logger
export {
  logger,
  httpLogStream,
  logInfo,
  logError,
  logWarn,
  logDebug,
  logHttp,
} from './utils/logger';

// Middleware
export {
  errorHandler,
  // notFoundHandler,
} from './middleware/error-handler';

export {
  validate,
  validateBody,
  validateQuery,
  validateParams,
} from './middleware/validate';

// DO NOT export config - each service handles its own config