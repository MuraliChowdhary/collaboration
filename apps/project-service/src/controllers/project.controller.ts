import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { projectService } from '../services/project.service';
import { StatusCodes } from 'http-status-codes';

export const createProjectHandler = asyncHandler(async (req: Request, res: Response) => {
     const userId = (req as any).user.id;
  const project = await projectService.createProject({ ...req.body, ownerId: userId });
  res.status(StatusCodes.CREATED).json({ project });
});

export const getProjectHandler = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectById(req.params.id);
  res.status(StatusCodes.OK).json({ project });
});

// Other handlers: update, delete, addMember, milestones...
