import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../types';
import { UnauthorizedError } from '../utils/errors';
import userService from './user.service';

interface TokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const user = await userService.getUserByEmail(email);
      const isValid = await userService.validatePassword(user, password);
      
      if (!isValid) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const token = this.generateToken(user);
      return { user, token };
    } catch (error) {
      throw new UnauthorizedError('Invalid credentials');
    }
  }

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