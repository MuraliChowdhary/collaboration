// apps/auth-service/src/repositories/user.repository.ts

import { prisma } from '../config/database';
import { User, Prisma } from '@repo/database';

/**
 * User Repository
 * Handles all database operations related to users
 */
export class UserRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });
  }

  /**
   * Find user by email verification token
   */
  async findByVerificationToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });
  }

  /**
   * Create new user
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
      },
    });
  }

  /**
   * Update user
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Set user as verified
   */
  async setVerified(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
      },
    });
  }

  /**
   * Update password
   */
  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  /**
   * Set email verification token
   */
  async setVerificationToken(id: string, token: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { emailVerificationToken: token },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  /**
   * Check if username exists
   */
  async usernameExists(username: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { username: username.toLowerCase() },
    });
    return count > 0;
  }

  /**
   * Get user with minimal info (for token payload)
   */
  async findByIdMinimal(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });
  }
}