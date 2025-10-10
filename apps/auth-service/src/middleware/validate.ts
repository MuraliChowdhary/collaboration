import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
       const validatedData = schema.parse(req.body);
      
      // Replace req.body with validated data
      req.body = validatedData;
      console.log(validatedData)
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      next(error);
    }
  };