// import { Router, Request, Response } from 'express';
// import { createProxyMiddleware, Options as ProxyOptions } from 'http-proxy-middleware';
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
// const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://localhost:3002';
// const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL || 'http://localhost:3003';
// const MESSAGING_SERVICE_URL = process.env.MESSAGING_SERVICE_URL || 'http://localhost:3004';
// const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';
// const CONNECTION_SERVICE_URL = process.env.CONNECTION_SERVICE_URL || 'http://localhost:3006';
// const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'http://localhost:3007';
// const SKILLS_SERVICE_URL = process.env.SKILLS_SERVICE_URL || 'http://localhost:3008';
// const ACTIVITY_SERVICE_URL = process.env.ACTIVITY_SERVICE_URL || 'http://localhost:3009';
// const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:3010';
// const router = Router();


// router.use(
//   '/auth',
//   createProxyMiddleware({
//     target: AUTH_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//   } as ProxyOptions)
// );



// router.use(
//   '/users',
//   createProxyMiddleware({
//     target: USERS_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );


// router.use(
//   '/project',
//   createProxyMiddleware({
//     target: PROJECT_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );


// router.use(
//   '/messages',
//   createProxyMiddleware({
//     target: MESSAGING_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );


// router.use(
//   '/notification',
//   createProxyMiddleware({
//     target: NOTIFICATION_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );

// router.use(
//   '/review',
//   createProxyMiddleware({
//     target: REVIEW_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );

// router.use(
//   '/connection',
//   createProxyMiddleware({
//     target: CONNECTION_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );

// router.use(
//   '/activty',
//   createProxyMiddleware({
//     target: ACTIVITY_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );

// router.use(
//   '/search',
//   createProxyMiddleware({
//     target: SEARCH_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );

// router.use(
//   '/skills',
//   createProxyMiddleware({
//     target: SKILLS_SERVICE_URL,
//     changeOrigin: true,
//      pathRewrite: (path) => path,
//     logLevel: 'debug',
//     onProxyReq: (_proxyReq: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Forwarding: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes: any, req: Request, _res: Response) => {
//       console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${req.url}`);
//     },
//     onError: (err: Error, _req: Request, res: Response) => {
//       console.error('[Proxy Error]:', err.message);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   } as ProxyOptions)
// );
// export {router as gatewayRouter}