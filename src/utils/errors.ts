import { ERROR_CODES, HTTP_STATUS } from '../config/constants';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, message);
  }
}

export class InsufficientFundsError extends AppError {
  constructor(message = 'Insufficient funds') {
    super(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.INSUFFICIENT_FUNDS, message);
  }
}

export class BlacklistedUserError extends AppError {
  constructor(message = 'User is blacklisted') {
    super(HTTP_STATUS.FORBIDDEN, ERROR_CODES.BLACKLISTED_USER, message);
  }
}
