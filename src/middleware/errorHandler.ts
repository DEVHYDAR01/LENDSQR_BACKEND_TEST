import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export const errorHandler = (
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  logger.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.statusCode === 400 && { details: error.details })
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};