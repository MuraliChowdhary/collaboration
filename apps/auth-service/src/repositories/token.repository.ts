// apps/auth-service/src/repositories/token.repository.ts

import { prisma } from '../config/database';
import { RefreshToken, Prisma } from '@prisma/client';

/**
 * Token Repository
 * Handles all database operations related to refresh tokens
 */
export class TokenRepository {
  /**
   * Create refresh token
   */
  async create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data,
    });
  }

  /**
   * Find refresh token
   */
  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            status: true,
            isVerified: true,
          },
        },
      },
    });
  }

  /**
   * Delete refresh token
   */
  async delete(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }

  /**
   * Delete all refresh tokens for a user
   */
  async deleteAllByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Get all active refresh tokens for a user
   */
  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return prisma.refreshToken.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(), // Only non-expired tokens
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Delete expired tokens (cleanup)
   */
  async deleteExpired(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }

  /**
   * Delete specific refresh token by ID
   */
  async deleteById(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { id },
    });
  }

  /**
   * Check if token exists and is valid
   */
  async isValid(token: string): Promise<boolean> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) {
      return false;
    }

    // Check if expired
    if (refreshToken.expiresAt < new Date()) {
      // Delete expired token
      await this.delete(token);
      return false;
    }

    return true;
  }
}