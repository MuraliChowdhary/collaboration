import { Router } from 'express';
import {
  createProjectHandler,
  getProjectHandler,
} from '../controllers/project.controller';
import { protectRoute } from '../middleware/auth.middleware';

const router = Router();

router.post('/projects', protectRoute, createProjectHandler);
router.get('/projects/:id', getProjectHandler);

// Other routes follow same pattern

export default router;
