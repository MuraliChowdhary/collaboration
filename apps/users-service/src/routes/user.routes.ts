// src/routes/user.routes.ts
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getCurrentUserHandler,
  updateUserProfileHandler,
  deleteUserHandler,
} from '../controllers/user.controller';

const router = Router();

router.get('/me', protect,getCurrentUserHandler);
router.put('/me', protect,updateUserProfileHandler);
router.delete('/me',protect, deleteUserHandler);

export default router;
