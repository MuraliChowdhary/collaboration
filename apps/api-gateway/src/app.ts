// src/app.ts
import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorHandler } from "./core/errorHandler";
import { setupGatewayRoutes } from "./routes/gateway.routes";
import { createProxyMiddleware, Options as ProxyOptions } from 'http-proxy-middleware';
import { AUTH_SERVICE_URL } from './gateway.routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(corsMiddleware);
// app.use(rateLimitMiddleware);
// app.use(authMiddleware);

app.use('/api/v1/auth', createProxyMiddleware({
  target: 'http://localhost:3001/api/v1/auth',
  changeOrigin: true
}));

// Proxy routes
// setupGatewayRoutes(app);

// Handle 404 and errors
app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
