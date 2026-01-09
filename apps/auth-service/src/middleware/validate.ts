import { RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  (req, res, next): void => {
    try {
      const validatedData = schema.parse(req.body);

      // Replace req.body with validated data
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Validation failed',
          errors: error.errors,
        });
        return; // ✅ explicit return void
      }

      next(error);
    }
  };
