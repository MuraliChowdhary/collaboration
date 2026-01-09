// apps/auth-service/src/types/auth.types.ts

import { Request } from 'express';
import { User } from '@repo/database';

/**
 * Authenticated Request
 * Extends Express Request with user property
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Token Pair
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * User without sensitive data
 */
export type PublicUser = Omit<User, 'passwordHash' | 'emailVerificationToken'>;

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register Data
 */
export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType?: string;
}

/**
 * Password Change Data
 */
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Password Reset Data
 */
export interface PasswordResetData {
  token: string;
  password: string;
}