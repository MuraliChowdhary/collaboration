import { Request, Response } from "express";
import { IncomingMessage, ServerResponse } from "http";

export interface ProxyRequest extends IncomingMessage {
  method: string;
  url: string;
  headers: Record<string, string | string[]>;
}

export interface ProxyResponse extends ServerResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
}