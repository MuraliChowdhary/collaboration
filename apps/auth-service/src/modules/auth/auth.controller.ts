import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { LoginInput, RegisterUserInput } from '../user/user.schema';
import { createUser, findUserByEmail, verifyPassword } from './auth.service';
import { signJwt } from '../../utils/jwt';
import crypto from "crypto";
import { prisma } from '@repo/database';
import { logger } from '../../core/logger';
import  {sendEmail}  from "../../utils/sendEmail"; 


export const registerUserHandler = asyncHandler(
  async (req: Request<{}, {}, RegisterUserInput>, res: Response) => {
    const user = await createUser(req.body);

    if (!user) {
       res.status(StatusCodes.CONFLICT).json({
        message: 'User already exists',
      });
      return
    }

    const { passwordHash, ...userResponse } = user;

    const accessToken = signJwt(
      { id: user.id, email: user.email, username: user.username },
      'accessTokenPrivateKey'
    );

    res.status(StatusCodes.CREATED).json({
      accessToken,
      user: userResponse,
    });
  }
);

export const loginHandler = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || !(await verifyPassword({ candidatePassword: password, hash: user.passwordHash }))) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
      return;
    }

    const accessToken = signJwt({ id: user.id, email: user.email }, 'accessTokenPrivateKey');

    res.status(StatusCodes.OK).json({ accessToken });
  }
);




// Expect the client to send the refresh token they want to logout
interface LogoutRequestBody {
  refreshToken: string;
}

export const logoutHandler = asyncHandler(
  async (req: Request<{}, {}, LogoutRequestBody>, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
       res.status(StatusCodes.BAD_REQUEST).json({
        message: "Refresh token is required",
      });
      return
    }

    const deleted = await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    if (deleted.count === 0) {
      logger.warn(`[Logout] Refresh token not found: ${refreshToken}`);
       res.status(StatusCodes.NOT_FOUND).json({
        message: "Refresh token not found or already invalidated",
      });
      return
    }

    logger.info(`[Logout] Refresh token invalidated successfully`);
    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  }
);


interface RefreshRequestBody {
  refreshToken: string;
}

export const refreshTokenHandler = asyncHandler(
  async (req: Request<{}, {}, RefreshRequestBody>, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
       res.status(StatusCodes.BAD_REQUEST).json({
        message: "Refresh token is required",
      });
      return
    }

    //  Verify the token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
       res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
       return
    }

    //  Check expiry
    if (storedToken.expiresAt < new Date()) {
      // Optionally delete expired token
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
       res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token expired" });
       return
    }

    const user = storedToken.user;

    // Issue new access token
    const accessToken = signJwt(
      { id: user.id, email: user.email },
      "accessTokenPrivateKey",
      { expiresIn: "1hr" }
    );

    // Optionally: issue new refresh token and invalidate old one
    // const newRefreshToken = signJwt({ id: user.id }, "refreshTokenPrivateKey", { expiresIn: "7d" });
    // await prisma.refreshToken.update({
    //   where: { id: storedToken.id },
    //   data: { token: newRefreshToken, expiresAt: new Date(Date.now() + 7*24*60*60*1000) }
    // });

    logger.info(`[Refresh] New access token issued for user ${user.id}`);
    res.status(StatusCodes.OK).json({ accessToken });
  }
);

interface ForgotPasswordRequest {
  email: string;
}

export const forgotPasswordHandler = asyncHandler(
  async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => {
    const { email } = req.body;


    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {

       res.status(StatusCodes.OK).json({
        message: "If a matching account was found, a password reset email has been sent",
      });
      return
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); 

    await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
   await sendEmail({
  to: user.email,
  subject: "Reset Your Password",
  html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
});

    logger.info(`[ForgotPassword] Token generated for ${user.id}`);
    res.status(StatusCodes.OK).json({
      message: "If a matching account was found, a password reset email has been sent",
    });
  }
);




interface VerifyEmailRequest {
  token: string;
}

export const verifyEmailHandler = asyncHandler(
  async (req: Request<{}, {}, VerifyEmailRequest>, res: Response) => {
    const { token } = req.body;

    if (!token) {
       res.status(StatusCodes.BAD_REQUEST).json({ message: "Verification token is required" });
       return
    }

    const user = await prisma.refreshToken.findUnique({
      where: { token }, 
      include: { user: true }
    });


    if (!user) {
       res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or expired verification token" });
       return
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
      },
    });

    logger.info(`[VerifyEmail] User ${user.id} verified successfully`);
    res.status(StatusCodes.OK).json({ message: "Email verified successfully" });
  }
);
