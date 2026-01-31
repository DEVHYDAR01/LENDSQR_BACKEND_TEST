import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/connection';
import { User } from '../types';
import { ConflictError, BlacklistedUserError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import adjutorService from './adjutor.service';

export class UserService {
  async createUser(userData: {
    email: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    const { email, phone, password, first_name, last_name } = userData;

    // Check if user already exists
    const existingUser = await db('users')
      .where('email', email)
      .orWhere('phone', phone)
      .first();

    if (existingUser) {
      throw new ConflictError('User with this email or phone already exists');
    }

    // Check blacklist using email and phone
    const [emailBlacklisted, phoneBlacklisted] = await Promise.all([
      adjutorService.checkBlacklist(email),
      adjutorService.checkBlacklist(phone)
    ]);

    if (emailBlacklisted || phoneBlacklisted) {
      logger.warn(`Blacklisted user attempted registration: ${email}`);
      throw new BlacklistedUserError('User is not eligible for registration');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const userId = uuidv4();
    await db('users').insert({
      id: userId,
      email,
      phone,
      password_hash,
      first_name,
      last_name,
      is_blacklisted: false,
    });

    // Create wallet for user
    await db('wallets').insert({
      id: uuidv4(),
      user_id: userId,
      balance: 0.00,
      currency: 'NGN',
    });

    logger.info(`User created successfully: ${email}`);
    return this.getUserById(userId);
  }

  async getUserById(id: string): Promise<User> {
    const user = await db('users').where('id', id).first();
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await db('users').where('email', email).first();
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }
}

export default new UserService();