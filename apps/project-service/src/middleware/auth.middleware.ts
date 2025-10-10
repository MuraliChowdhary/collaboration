// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express-serve-static-core';

import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
}

import dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
if (!privateKey) throw new Error('ACCESS_TOKEN_PRIVATE_KEY is not defined');

export const protectRoute : RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const token = authHeader.split(' ')[1];

  try {
   const decoded = jwt.verify(token, privateKey) as JwtPayload;
    // attach user info to request
    (req as any).user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Invalid token');
  }
};
