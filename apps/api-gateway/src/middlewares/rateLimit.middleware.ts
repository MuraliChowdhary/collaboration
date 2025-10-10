// src/middlewares/rateLimit.middleware.ts
import rateLimit from "express-rate-limit";
import { API_GATEWAY_CONFIG } from "../config/gateway.config";

export const rateLimitMiddleware = rateLimit(API_GATEWAY_CONFIG.middleware.rateLimit);
