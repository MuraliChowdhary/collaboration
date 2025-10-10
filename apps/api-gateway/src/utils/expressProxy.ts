// src/utils/expressProxy.ts
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import type { RequestHandler } from "express";

export const expressProxy = (options: Options): RequestHandler =>
  createProxyMiddleware(options) as unknown as RequestHandler;
