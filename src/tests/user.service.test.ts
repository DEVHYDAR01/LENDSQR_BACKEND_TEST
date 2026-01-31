import userService from '../services/user.service';
import adjutorService from '../services/adjutor.service';
import { ConflictError, BlacklistedUserError } from '../utils/errors';

jest.mock('../services/adjutor.service');

describe('UserService', () => {
  const mockUser = {
    email: 'test@example.com',
    phone: '+2348012345678',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully when not blacklisted', async () => {
      (adjutorService.checkBlacklist as jest.Mock).mockResolvedValue(false);

      const user = await userService.createUser(mockUser);

      expect(user.email).toBe(mockUser.email);
      expect(user.first_name).toBe(mockUser.first_name);
      expect(user.is_blacklisted).toBe(false);
    });

    it('should throw BlacklistedUserError when user is blacklisted', async () => {
      (adjutorService.checkBlacklist as jest.Mock).mockResolvedValue(true);

      await expect(userService.createUser(mockUser)).rejects.toThrow(BlacklistedUserError);
    });

    it('should throw ConflictError when user already exists', async () => {
      (adjutorService.checkBlacklist as jest.Mock).mockResolvedValue(false);
      
      // Create user first time
      await userService.createUser(mockUser);
      
      // Try to create same user again
      await expect(userService.createUser(mockUser)).rejects.toThrow(ConflictError);
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', async () => {
      (adjutorService.checkBlacklist as jest.Mock).mockResolvedValue(false);
      
      const user = await userService.createUser(mockUser);
      const isValid = await userService.validatePassword(user, 'password123');
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      (adjutorService.checkBlacklist as jest.Mock).mockResolvedValue(false);
      
      const user = await userService.createUser(mockUser);
      const isValid = await userService.validatePassword(user, 'wrongpassword');
      
      expect(isValid).toBe(false);
    });
  });
});