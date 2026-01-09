// apps/auth-service/src/schemas/auth.schema.ts

import { z } from 'zod';

/**
 * Register Schema
 */
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores and hyphens'
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase and number'
      ),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    accountType: z
      .enum([
        'STUDENT',
        'PROFESSIONAL',
        'FREELANCER',
        'ENTREPRENEUR',
        'CREATOR',
        'COMMUNITY',
      ])
      .optional()
      .default('PROFESSIONAL'),
  }),
});

/**
 * Login Schema
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  }),
});

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase and number'
      ),
  }),
});

/**
 * Verify Email Schema
 */
export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

/**
 * Resend Verification Schema
 */
export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase and number'
      ),
  }),
});

/**
 * Refresh Token Schema
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

/**
 * Logout Schema
 */
export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});