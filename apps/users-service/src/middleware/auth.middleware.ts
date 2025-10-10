// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

interface JwtPayload {
  id: string;
  email: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY!) as JwtPayload;
    // attach user info to request
    (req as any).user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Invalid token');
  }
});
