// apps/auth-service/src/services/hash.service.ts

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { passwordConfig } from '../config/jwt';

/**
 * Hash Service
 * Handles password hashing and token generation
 */
export class HashService {
  /**
   * Hash password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, passwordConfig.saltRounds);
  }

  /**
   * Compare password with hash
   * @param password - Plain text password
   * @param hash - Hashed password
   * @returns True if password matches
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate random token for email verification or password reset
   * @param length - Token length (default: 32)
   * @returns Random hex token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate numeric OTP
   * @param length - OTP length (default: 6)
   * @returns Numeric OTP
   */
  generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    
    return otp;
  }
}