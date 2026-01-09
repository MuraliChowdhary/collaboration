// apps/auth-service/src/services/auth.service.ts

import { UserRepository } from '../repositories/user.repository';
import { TokenService } from './token.service';
import { HashService } from './hash.service';
import { EmailService } from './email.service';
import { AppError, ConflictError, AuthenticationError, NotFoundError } from '@repo/shared';
import { User, AccountType } from '@repo/database';

/**
 * Register DTO Interface
 */
interface RegisterDTO {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType?: AccountType;
}

/**
 * Login Response Interface
 */
interface LoginResponse {
  user: Omit<User, 'passwordHash'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Auth Service
 * Handles all authentication business logic
 */
export class AuthService {
  private userRepo: UserRepository;
  private tokenService: TokenService;
  private hashService: HashService;
  private emailService: EmailService;

  constructor() {
    this.userRepo = new UserRepository();
    this.tokenService = new TokenService();
    this.hashService = new HashService();
    this.emailService = new EmailService();
  }

  /**
   * Register new user
   * @param dto - Registration data
   * @returns User and tokens
   */
  async register(dto: RegisterDTO): Promise<LoginResponse> {
    // 1. Check if user exists
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const existingUsername = await this.userRepo.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictError('Username already taken');
    }

    // 2. Hash password
    const passwordHash = await this.hashService.hashPassword(dto.password);

    // 3. Generate verification token
    const verificationToken = this.tokenService.generateVerificationToken();

    // 4. Determine account type
    const accountType: AccountType = (dto.accountType as AccountType) || 'PROFESSIONAL';

    // 5. Create user
    const user = await this.userRepo.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      accountType: accountType,
      emailVerificationToken: verificationToken,
    });

    // 6. Send verification email (async - don't wait)
    this.emailService
      .sendVerificationEmail(user.email, verificationToken)
      .catch((err) =>
        console.error('Failed to send verification email:', err)
      );

    // 7. Generate tokens
    const tokens = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.username,
      user.role
    );

    // 8. Remove sensitive data
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @param rememberMe - Extend token expiry
   * @returns User and tokens
   */
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResponse> {
    // 1. Find user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // 2. Check user status
    if (user.status === 'SUSPENDED') {
      throw new AppError('Account has been suspended', 403);
    }

    if (user.status === 'DELETED') {
      throw new NotFoundError('Account');
    }

    // 3. Verify password
    const isValidPassword = await this.hashService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    // 4. Update last login
    await this.userRepo.updateLastLogin(user.id);

    // 5. Generate tokens
    const tokens = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.username,
      user.role,
      rememberMe
    );

    // 6. Remove sensitive data
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Verify email with token
   * @param token - Verification token
   */
  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepo.findByVerificationToken(token);
    
    console.log('Verifying email with token:', user);
    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    // Set user as verified
    await this.userRepo.setVerified(user.id);

    // Send welcome email
    this.emailService
      .sendWelcomeEmail(user.email, user.firstName)
      .catch((err) => console.error('Failed to send welcome email:', err));
  }

  /**
   * Resend verification email
   * @param email - User email
   */
  async resendVerification(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    if (user.isVerified) {
      throw new AppError('Email already verified', 400);
    }

    // Generate new verification token
    const verificationToken = this.tokenService.generateVerificationToken();
    await this.userRepo.setVerificationToken(user.id, verificationToken);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken
    );
  }

  /**
   * Logout user
   * @param refreshToken - Refresh token to revoke
   */
  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   * @returns New token pair
   */
  async refreshTokens(refreshToken: string) {
    return this.tokenService.refreshAccessToken(refreshToken);
  }

  /**
   * Request password reset
   * @param email - User email
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = this.tokenService.generateResetToken();

    // Store token (you might want to add a resetToken field to User model)
    // For now, we'll reuse emailVerificationToken field
    await this.userRepo.setVerificationToken(user.id, resetToken);

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  /**
   * Reset password with token
   * @param token - Reset token
   * @param newPassword - New password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findByVerificationToken(token);

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const passwordHash = await this.hashService.hashPassword(newPassword);

    // Update password and clear token
    await this.userRepo.update(user.id, {
      passwordHash,
      emailVerificationToken: null,
    });

    // Revoke all user sessions for security
    await this.tokenService.revokeAllUserTokens(user.id);

    // Send confirmation email
    this.emailService
      .sendPasswordChangedEmail(user.email)
      .catch((err) =>
        console.error('Failed to send password changed email:', err)
      );
  }

  /**
   * Change password (authenticated user)
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    // Verify current password
    const isValidPassword = await this.hashService.comparePassword(
      currentPassword,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await this.hashService.hashPassword(newPassword);

    // Update password
    await this.userRepo.updatePassword(userId, passwordHash);

    // Send confirmation email
    this.emailService
      .sendPasswordChangedEmail(user.email)
      .catch((err) =>
        console.error('Failed to send password changed email:', err)
      );
  }

  /**
   * Validate token (for API Gateway or other services)
   * @param token - JWT access token
   * @returns Token payload
   */
  async validateToken(token: string) {
    const payload = this.tokenService.verifyAccessToken(token);
    
    // Optionally verify user still exists and is active
    const user = await this.userRepo.findByIdMinimal(payload.userId);
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new AuthenticationError('Account is not active');
    }

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  /**
   * Get active sessions for user
   * @param userId - User ID
   * @returns List of active sessions
   */
  async getActiveSessions(userId: string) {
    return this.tokenService.getUserSessions(userId);
  }

  /**
   * Revoke specific session
   * @param userId - User ID
   * @param sessionId - Session ID to revoke
   */
  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.tokenService.revokeSession(userId, sessionId);
  }
}