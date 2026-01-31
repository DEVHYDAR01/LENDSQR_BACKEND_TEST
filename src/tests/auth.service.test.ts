import authService from '../services/auth.service';
import userService from '../services/user.service';
import adjutorService from '../services/adjutor.service';
import { UnauthorizedError } from '../utils/errors';

jest.mock('../services/adjutor.service');

describe('AuthService', () => {
  const mockUser = {
    email: 'auth@test.com',
    phone: '+2348012345678',
    password: 'password123',
    first_name: 'Auth',
    last_name: 'Test',
  };

  beforeEach(() => {
    (adjutorService.checkBlacklist as jest.Mock).mockResolvedValue(false);
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const user = await userService.createUser(mockUser);
      
      const result = await authService.login(mockUser.email, mockUser.password);
      
      expect(result.user.email).toBe(mockUser.email);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should throw UnauthorizedError with wrong password', async () => {
      await userService.createUser(mockUser);
      
      await expect(
        authService.login(mockUser.email, 'wrongpassword')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError with non-existent email', async () => {
      await expect(
        authService.login('nonexistent@test.com', mockUser.password)
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});