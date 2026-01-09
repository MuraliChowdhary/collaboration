// import express, { Request, Response } from "express";
// import { createProxyMiddleware } from "http-proxy-middleware";

// const app = express();
// // app.use(express.json());

// // Logging
// app.use((req: Request, _res, next) => {
//   console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
//   next();
// });

// // Health
// app.get("/health", (_req, res: Response) => {
//   res.json({ message: "API Gateway is healthy" });
// });

// // Proxy
// app.use(
//   "/api/v1/auth",
//   createProxyMiddleware({
//     target: "http://localhost:3001",
//     changeOrigin: true,
//     secure: false,
//     pathRewrite: {
//       "^/api/v1/auth": "",
//     },
//     logger: console,
//   })
// );

// export default app;


// // src/app.ts
// import express, { Request, Response } from "express";
// import cors from "cors";
// import { API_GATEWAY_CONFIG } from "./config/gateway.config";
// import { authMiddleware } from "./middlewares/auth.middleware";
// import { expressProxy } from "./utils/expressProxy";

// const app = express();

// // Middleware
// app.use(cors(API_GATEWAY_CONFIG.middleware.cors));
// app.use(express.json());

// // Gateway logging
// app.use((req, res, next) => {
//   console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
//   next();
// });

// // Health check
// app.get("/health", (req: Request, res: Response) => {
//   res.json({ message: "API Gateway is healthy" });
// });

// // Apply authentication middleware


// // Setup proxies for each service
// Object.entries(API_GATEWAY_CONFIG.services).forEach(([serviceName, config]) => {
//   const fullPrefix = `${API_GATEWAY_CONFIG.baseUrl}${config.prefix}`;
  
//   console.log(`[Gateway] Registering proxy: ${fullPrefix} -> ${config.url}`);
  
//   const proxyOptions = {
//     target: config.url,
//     changeOrigin: true,
//     pathRewrite: (path: string) => {
//       // Remove the gateway prefix but keep the service-specific path
//       const newPath = path.replace(`${API_GATEWAY_CONFIG.baseUrl}${config.prefix}`, '');
//       console.log(`[Proxy ${serviceName}] Rewriting: ${path} -> ${newPath}`);
//       return newPath;
//     },
//     onProxyReq: (proxyReq: any, req: any) => {
//       console.log(`[Proxy ${serviceName}] Forwarding to: ${config.url}${proxyReq.path}`);
//     },
//     onError: (err: any, req: any, res: any) => {
//       console.error(`[Proxy ${serviceName}] Error:`, err.message);
//       res.status(503).json({ 
//         error: `${serviceName} service unavailable`,
//         message: err.message 
//       });
//     }
//   };

//   app.use('/api/v1/auth', expressProxy(proxyOptions));
//   app.use(authMiddleware);

// });

// // 404 handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: "Route not found" });
// });

// export default app;




import express, { Request, Response } from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { API_GATEWAY_CONFIG } from "./config/gateway.config";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();
 
app.use(cors(API_GATEWAY_CONFIG.middleware.cors));

app.use((req, _res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ message: "API Gateway is healthy" });
});
 
const authService = API_GATEWAY_CONFIG.services.auth;
const authPrefix = `${API_GATEWAY_CONFIG.baseUrl}${authService.prefix}`;

app.use(
  authPrefix,
  createProxyMiddleware({
    target: authService.url,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      [`^${authPrefix}`]: "",
    },
    logger: console,
  })
);

/**
 * ─────────────────────────────────────────
 * 2️⃣ PROTECTED SERVICES (GENERIC)
 * ─────────────────────────────────────────
 */
app.use(authMiddleware);

Object.entries(API_GATEWAY_CONFIG.services).forEach(
  ([serviceName, config]) => {
    if (serviceName === "auth") return;

    const prefix = `${API_GATEWAY_CONFIG.baseUrl}${config.prefix}`;

    console.log(`[Gateway] Proxy ${serviceName}: ${prefix} → ${config.url}`);

    app.use(
      prefix,
      createProxyMiddleware({
        target: config.url,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          [`^${prefix}`]: "",
        },
        logger: console,
      })
    );
  }
);

/**
 * 404
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
