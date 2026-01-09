import { RequestHandler } from 'express';
import { TokenService } from '../services/token.service';
import { AuthenticationError } from '@repo/shared';

/**
 * Extend Express Request type to include user
 * (Make sure User type exists)
 */

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const tokenService = new TokenService();

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.slice(7); // remove "Bearer "

    const payload = tokenService.verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    } 

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is present, but does not fail if missing/invalid
 */
export const optionalAuth: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = tokenService.verifyAccessToken(token);

      req.user = {
        id: payload.userId,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      };
    }

    next();
  } catch {
    // silently continue without user
    next();
  }
};
