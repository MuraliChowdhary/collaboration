import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters long'),
    username: z.string({ required_error: 'Username is required' }),
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    coverImage: z.string().optional(),
    location: z.string().optional(),
    timezone: z.string().optional(), // defaults to UTC
  }),
});

// export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
        refreshToken : z.string()
  }),
});
export type logoutSchemaInput = z.infer<typeof logoutSchema>["body"];


// Refresh Token
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];

// Forgot Password
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
  }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];

// Verify Email
export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string({ required_error: "Verification token is required" }),
  }),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["body"];

export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];