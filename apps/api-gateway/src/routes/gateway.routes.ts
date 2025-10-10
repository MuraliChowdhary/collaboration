// import { Express } from "express";
// import { createProxyMiddleware } from "http-proxy-middleware";
// import { API_GATEWAY_CONFIG } from "../config/gateway.config";
// import { logger } from "../core/logger";

// export const setupGatewayRoutes = (app: Express): void => {
//   Object.entries(API_GATEWAY_CONFIG.services).forEach(([serviceName, service]) => {
//     const servicePrefix = `${API_GATEWAY_CONFIG.baseUrl}${service.prefix}`;

//     logger.info(`🔧 Setting up proxy: ${servicePrefix} -> ${service.url}`);
//     console.log(service.url);
//     const proxy = createProxyMiddleware({
//       target: service.url,
//       changeOrigin: true,
//       pathRewrite: {
//         [`^${servicePrefix}`]: ''
//       },
//       on: {
//         proxyReq: (proxyReq:any, req: any) => {
//           logger.info(`[→ ${serviceName}] ${req.method} ${req.url}`);
//         },
//         proxyRes: (proxyRes:any, req: any) => {
//           logger.info(`[← ${serviceName}] ${proxyRes.statusCode} ${req.url}`);
//         },
//         error: (err:any, req: any, res: any) => {
//           logger.error(`[Error ${serviceName}] ${err.message}`);
//           if (!res.headersSent) {
//             res.status(502).json({ error: "Bad Gateway" });
//           }
//         }
//       }
//     } as any);

//     app.use(servicePrefix, proxy);
//   });

//   logger.info("✅ Gateway routes registered");
// };
import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { logger } from "../core/logger";

export const setupGatewayRoutes = (app: Express) => {
  app.use('/api/v1/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '' },
    logLevel: 'debug'
  } as any));
  
  logger.info('✅ Proxy setup: /api/v1/auth -> http://localhost:3001');
};