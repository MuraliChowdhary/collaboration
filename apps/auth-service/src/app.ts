import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { authRouter } from './modules/auth/auth.route';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[Auth Service] ${req.method} ${req.path}`);
  next();
});

// Health checks
app.get("/health", (req, res) => {
  res.json({ message: "Auth service is healthy" });
});

app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'Auth service is healthy and running!' });
});

console.log('Auth service initialized.');
// API Routes
app.use('/api/v1/auth', authRouter);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

export default app;