import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import userService from '../services/user.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = authService.extractTokenFromHeader(req.headers.authorization);
    const payload = authService.verifyToken(token);
    
    await userService.getUserById(payload.userId);
    (req as AuthenticatedRequest).user = payload;
    
    next();
  } catch (error) {
    next(error);
  }
};