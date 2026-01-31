import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      const token = authService.generateToken(user);
      
      return sendSuccess(res, {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        },
        token
      }, 201);
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);
      
      const isValid = await userService.validatePassword(user, password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = authService.generateToken(user);
      
      return sendSuccess(res, {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        },
        token
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();