import type { SignOptions, Secret } from 'jsonwebtoken';

/**
 * ================================
 * Internal Helper Types
 * ================================
 */

/**
 * Base JWT token configuration
 */
type JwtTokenConfig = {
  secret: Secret;
  expiresIn: NonNullable<SignOptions['expiresIn']>;
};

/**
 * Refresh token config with remember-me support
 */
type RefreshTokenConfig = JwtTokenConfig & {
  expiresInRememberMe: NonNullable<SignOptions['expiresIn']>;
};

/**
 * ================================
 * JWT Configuration
 * ================================
 */
export const jwtConfig: {
  accessToken: JwtTokenConfig;
  refreshToken: RefreshTokenConfig;
  verificationToken: {
    expiresIn: number; // seconds
  };
  resetToken: {
    expiresIn: number; // seconds
  };
} = {
  /**
   * Access Token Configuration
   */
  accessToken: {
    secret: process.env.JWT_SECRET ?? 'dev-access-token-secret',
    expiresIn:
      (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '15m',
  },

  /**
   * Refresh Token Configuration
   */
  refreshToken: {
    secret:
      process.env.REFRESH_TOKEN_SECRET ?? 'dev-refresh-token-secret',
    expiresIn:
      (process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']) ?? '7d',
    expiresInRememberMe: '30d',
  },

  /**
   * Email Verification Token
   * NOTE: These are NOT JWTs, just expiry durations (seconds)
   */
  verificationToken: {
    expiresIn: 60 * 60 * 24, // 24 hours
  },

  /**
   * Password Reset Token
   * NOTE: These are NOT JWTs, just expiry durations (seconds)
   */
  resetToken: {
    expiresIn: 60 * 60, // 1 hour
  },
};

/**
 * ================================
 * Password Configuration
 * ================================
 */
export const passwordConfig = {
  saltRounds: 10,
  minLength: 8,
  maxLength: 128,
};

/**
 * ================================
 * Runtime Configuration Validation
 * ================================
 */
export function validateJwtConfig(): void {
  const requiredEnvVars = [
    'JWT_SECRET',
    'REFRESH_TOKEN_SECRET',
  ];

  const missing = requiredEnvVars.filter(
    (key) => !process.env[key]
  );

  // ❌ Fail hard in production
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}`
    );
  }

  // ⚠️ Warn in development
  if (
    process.env.NODE_ENV === 'development' &&
    (!process.env.JWT_SECRET ||
      !process.env.REFRESH_TOKEN_SECRET)
  ) {
    console.warn(
      '⚠️  WARNING: Using default JWT secrets in development. ' +
      'Set JWT_SECRET and REFRESH_TOKEN_SECRET in your .env file.'
    );
  }
}
