// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { userService } from '../services/user.service';
import { StatusCodes } from 'http-status-codes';

export const getCurrentUserHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
  const user = await userService.getCurrentUser(userId);
  res.status(StatusCodes.OK).json({ user });
});

export const updateUserProfileHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
  const updatedUser = await userService.updateUserProfile(userId, req.body);
  res.status(StatusCodes.OK).json({ user: updatedUser });
});

export const deleteUserHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
  await userService.deleteUser(userId);
  res.status(StatusCodes.OK).json({ message: 'Account deleted' });
});
