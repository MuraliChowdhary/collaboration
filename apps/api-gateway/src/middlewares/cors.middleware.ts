// src/middlewares/cors.middleware.ts
import cors from "cors";
import { API_GATEWAY_CONFIG } from "../config/gateway.config";

export const corsMiddleware = cors(API_GATEWAY_CONFIG.middleware.cors);
