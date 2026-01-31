import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, any>
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
};
