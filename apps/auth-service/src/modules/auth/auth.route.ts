import { Router } from 'express';
import { forgotPasswordHandler, loginHandler, logoutHandler, refreshTokenHandler, registerUserHandler, verifyEmailHandler } from './auth.controller';
import { validate } from '../../middleware/validate';
import { loginSchema, registerUserSchema, refreshTokenSchema, forgotPasswordSchema, verifyEmailSchema, logoutSchema } from '../user/user.schema';

const router = Router();

router.post('/register', validate(registerUserSchema.shape.body), registerUserHandler);

router.post('/login', validate(loginSchema.shape.body), loginHandler);

router.post('/logout', validate(logoutSchema.shape.body), logoutHandler);

router.post('/refresh', validate(refreshTokenSchema.shape.body), refreshTokenHandler);

router.post('/fotgot-password', validate(forgotPasswordSchema.shape.body), forgotPasswordHandler);

router.post('/verify-email', validate(verifyEmailSchema.shape.body), verifyEmailHandler);


export { router as authRouter };