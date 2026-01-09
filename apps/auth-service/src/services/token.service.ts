// apps/auth-service/src/services/token.service.ts

import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { TokenRepository } from '../repositories/token.repository';
import { HashService } from './hash.service';
import { AuthenticationError } from '@repo/shared';

/**
 * JWT Payload Interface
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
 * Token Pair Interface
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Token Service
 * Handles JWT token generation, validation, and refresh tokens
 */
export class TokenService {
  private tokenRepository: TokenRepository;
  private hashService: HashService;

  constructor() {
    this.tokenRepository = new TokenRepository();
    this.hashService = new HashService();
  }

  /**
   * Generate access token
   * @param payload - User data to encode
   * @returns JWT access token
   */
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.accessToken.secret, {
      expiresIn: jwtConfig.accessToken.expiresIn,
    });
  }

  /**
   * Generate refresh token
   * @param payload - User data to encode
   * @param rememberMe - Extend expiry if true
   * @returns JWT refresh token
   */
  generateRefreshToken(payload: JwtPayload, rememberMe: boolean = false): string {
    const expiresIn = rememberMe
      ? jwtConfig.refreshToken.expiresInRememberMe
      : jwtConfig.refreshToken.expiresIn;

    return jwt.sign(payload, jwtConfig.refreshToken.secret, {
      expiresIn,
    });
  }

  /**
   * Generate both access and refresh tokens
   * @param userId - User ID
   * @param email - User email
   * @param username - Username
   * @param role - User role
   * @param rememberMe - Extend expiry if true
   * @returns Token pair
   */
  async generateTokenPair(
    userId: string,
    email: string,
    username: string,
    role: string,
    rememberMe: boolean = false
  ): Promise<TokenPair> {
    const payload: JwtPayload = {
      userId,
      email,
      username,
      role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload, rememberMe);

    // Store refresh token in database
    const expiresIn = rememberMe ? 30 : 7; // days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    await this.tokenRepository.create({
      token: refreshToken,
      expiresAt,
      user: {
        connect: { id: userId },
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify access token
   * @param token - JWT token
   * @returns Decoded payload
   */
  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayload;
    } catch (error) {
      throw new AuthenticationError('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   * @param token - JWT token
   * @returns Decoded payload
   */
  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, jwtConfig.refreshToken.secret) as JwtPayload;
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Refresh token
   * @returns New token pair
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await this.tokenRepository.findByToken(refreshToken);
    
    if (!storedToken) {
      throw new AuthenticationError('Refresh token not found');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await this.tokenRepository.delete(refreshToken);
      throw new AuthenticationError('Refresh token expired');
    }

    // Generate new token pair
    const newTokens = await this.generateTokenPair(
      payload.userId,
      payload.email,
      payload.username,
      payload.role
    );

    // Delete old refresh token
    await this.tokenRepository.delete(refreshToken);

    return newTokens;
  }

  /**
   * Revoke refresh token
   * @param token - Refresh token to revoke
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.tokenRepository.delete(token);
  }

  /**
   * Revoke all refresh tokens for a user
   * @param userId - User ID
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.tokenRepository.deleteAllByUserId(userId);
  }

  /**
   * Get all active sessions for a user
   * @param userId - User ID
   */
  async getUserSessions(userId: string) {
    return this.tokenRepository.findByUserId(userId);
  }

  /**
   * Revoke specific session
   * @param userId - User ID
   * @param sessionId - Session/Token ID
   */
  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const sessions = await this.tokenRepository.findByUserId(userId);
    const session = sessions.find((s) => s.id === sessionId);

    if (!session) {
      throw new AuthenticationError('Session not found');
    }

    await this.tokenRepository.deleteById(sessionId);
  }

  /**
   * Generate email verification token
   */
  generateVerificationToken(): string {
    return this.hashService.generateToken(32);
  }

  /**
   * Generate password reset token
   */
  generateResetToken(): string {
    return this.hashService.generateToken(32);
  }
}