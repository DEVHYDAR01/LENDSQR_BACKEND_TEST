import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../types';
import { UnauthorizedError } from '../utils/errors';

interface TokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  generateToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header missing or invalid');
    }
    return authHeader.substring(7);
  }
}

export default new AuthService();