import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { env } from '../config/env.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors,
    });
    return;
  }

  // Handle Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err instanceof ValidationError && err.errors ? { errors: err.errors } : {}),
      ...(env.isDevelopment ? { stack: err.stack } : {}),
    });
    return;
  }

  // Handle generic error
  console.error('[Server Error]:', err);
  res.status(500).json({
    success: false,
    message: env.isProduction ? 'Internal server error' : err.message,
    ...(env.isDevelopment ? { stack: err.stack } : {}),
  });
}

