import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { authRouter } from './modules/auth/auth.route';
import { prisma } from '@repo/database';

const app: Application = express();

// Middleware
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[Auth Service] ${req.method} ${req.path}`);
  next();
});

app.post("/login",async (req, res) => {
  const { email, password } = req.body;
  console.log("[Auth Service] Login attempt:", { email, password: password ? '****' : undefined });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("[Auth Service] User not found:", email);
     res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
     return;
  }

  const isPasswordValid = password === user.passwordHash; // Simplified for example purposes
  if (!isPasswordValid) {
    console.log("[Auth Service] Invalid password for user:", email);
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    return;
  }

  console.log("[Auth Service] Body:", req.body);
  res.json({ message: "Login received!" });
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
app.use('/', authRouter);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

export default app; 