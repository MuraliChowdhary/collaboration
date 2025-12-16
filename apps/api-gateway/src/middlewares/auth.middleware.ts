// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { API_GATEWAY_CONFIG } from "../config/gateway.config";
import { logger } from "../core/logger";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const excluded = API_GATEWAY_CONFIG.middleware.authentication.excludedRoutes;

  const isExcluded = excluded.some(route =>
    req.originalUrl.startsWith(route)
  );

  if (isExcluded) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

