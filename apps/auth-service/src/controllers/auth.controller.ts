// apps/auth-service/src/controllers/auth.controller.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse, AppError } from '@repo/shared';

// Initialize auth service
const authService = new AuthService();

/**
 * Register Handler
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const registerHandler: RequestHandler = async (
  req:Request,
  res:Response,
  next:NextFunction
) => {
  try {
    const result = await authService.register(req.body);

    ApiResponse.success(
      res,
      {
        message: 'Registration successful. Please verify your email.',
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login Handler
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await authService.login(email, password, rememberMe);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe
        ? 30 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.success(res, {
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout Handler
 * @route POST /api/v1/auth/logout
 * @access Protected
 */
export const logoutHandler: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || '';

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // res.clearCookie('refreshToken');

    ApiResponse.success(res, {
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token Handler
 * @route POST /api/v1/auth/refresh
 * @access Public (requires refresh token)
 */
export const refreshTokenHandler: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401);
    }

    const result = await authService.refreshTokens(refreshToken);

    ApiResponse.success(res, {
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot Password Handler
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
export const forgotPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    ApiResponse.success(res, {
      message: 'If the email exists, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password Handler
 * @route POST /api/v1/auth/reset-password
 * @access Public
 */
export const resetPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    ApiResponse.success(res, {
      message:
        'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email Handler
 * @route POST /api/v1/auth/verify-email
 * @access Public
 */
export const verifyEmailHandler: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.body;
    await authService.verifyEmail(token);

    ApiResponse.success(res, {
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend Verification Email Handler
 * @route POST /api/v1/auth/resend-verification
 * @access Public
 */
export const resendVerificationHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;
    await authService.resendVerification(email);

    ApiResponse.success(res, {
      message: 'Verification email sent',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change Password Handler
 * @route POST /api/v1/auth/change-password
 * @access Protected
 */
export const changePasswordHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError('User not authenticated', 401);
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(userId, currentPassword, newPassword);

    ApiResponse.success(res, {
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Validate Token Handler
 * @route GET /api/v1/auth/validate
 * @access Internal (for service-to-service)
 */
export const validateTokenHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Token not provided', 401);
    }

    const payload = await authService.validateToken(token);

    ApiResponse.success(res, {
      message: 'Token is valid',
      data: payload,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Active Sessions Handler
 * @route GET /api/v1/auth/sessions
 * @access Protected
 */
export const getSessionsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const sessions = await authService.getActiveSessions(userId);

    ApiResponse.success(res, {
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke Session Handler
 * @route DELETE /api/v1/auth/sessions/:id
 * @access Protected
 */
export const revokeSessionHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user?.id;
    const { id: sessionId } = req.params;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!sessionId) {
      throw new AppError('Session ID not provided', 400);
    }

    await authService.revokeSession(userId, sessionId);

    ApiResponse.success(res, {
      message: 'Session revoked successfully',
    });
  } catch (error) {
    next(error);
  }
};