// apps/auth-service/src/routes/auth.routes.ts

import { Router } from 'express';
import { validate } from '@repo/shared';
import { authenticate } from '../middleware/auth.middleware';
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyEmailHandler,
  resendVerificationHandler,
  changePasswordHandler,
  validateTokenHandler,
  getSessionsHandler,
  revokeSessionHandler,
} from '../controllers/auth.controller';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  changePasswordSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../schemas/user.schema';

const router: Router = Router();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), registerHandler);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 */
router.post('/login', validate(loginSchema), loginHandler);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  forgotPasswordHandler
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  resetPasswordHandler
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 */
router.post('/verify-email', validate(verifyEmailSchema), verifyEmailHandler);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  resendVerificationHandler
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public (uses refresh token)
 */
router.post('/refresh', validate(refreshTokenSchema), refreshTokenHandler);

// ============================================
// PROTECTED ROUTES (Authentication Required)
// ============================================

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate tokens
 * @access  Protected
 */
router.post('/logout', authenticate, validate(logoutSchema), logoutHandler);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Protected
 */
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  changePasswordHandler
);

/**
 * @route   GET /api/v1/auth/validate
 * @desc    Validate JWT token (for inter-service communication)
 * @access  Internal
 */
router.get('/validate', validateTokenHandler);

/**
 * @route   GET /api/v1/auth/sessions
 * @desc    Get all active sessions for user
 * @access  Protected
 */
router.get('/sessions', authenticate, getSessionsHandler);

/**
 * @route   DELETE /api/v1/auth/sessions/:id
 * @desc    Revoke a specific session
 * @access  Protected
 */
router.delete('/sessions/:id', authenticate, revokeSessionHandler);

export default router;