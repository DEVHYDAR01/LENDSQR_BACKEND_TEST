import walletService from '../services/wallet.service';
import userService from '../services/user.service';
import adjutorService from '../services/adjutor.service';
import { InsufficientFundsError, NotFoundError } from '../utils/errors';

jest.mock('../services/adjutor.service');

describe('WalletService', () => {
  let testUser: any;

  beforeEach(async () => {
    (adjutorService.checkBlacklist as jest.Mock).mockResolvedValue(false);
    
    testUser = await userService.createUser({
      email: 'wallet@test.com',
      phone: '+2348012345678',
      password: 'password123',
      first_name: 'Wallet',
      last_name: 'Test',
    });
  });

  describe('fundWallet', () => {
    it('should fund wallet successfully', async () => {
      const result = await walletService.fundWallet(testUser.id, 1000);
      
      expect(result.balance).toBe(1000);
      expect(result.transaction.type).toBe('credit');
      expect(result.transaction.amount).toBe(1000);
    });

    it('should add to existing balance', async () => {
      await walletService.fundWallet(testUser.id, 1000);
      const result = await walletService.fundWallet(testUser.id, 500);
      
      expect(result.balance).toBe(1500);
    });
  });

  describe('transferFunds', () => {
    let recipient: any;

    beforeEach(async () => {
      recipient = await userService.createUser({
        email: 'recipient@test.com',
        phone: '+2348087654321',
        password: 'password123',
        first_name: 'Recipient',
        last_name: 'Test',
      });
      
      await walletService.fundWallet(testUser.id, 2000);
    });

    it('should transfer funds successfully', async () => {
      const result = await walletService.transferFunds(
        testUser.id,
        recipient.id,
        500,
        'Test transfer'
      );
      
      expect(result.senderBalance).toBe(1500);
      expect(result.recipientBalance).toBe(500);
    });

    it('should throw InsufficientFundsError when balance is low', async () => {
      await expect(
        walletService.transferFunds(testUser.id, recipient.id, 3000)
      ).rejects.toThrow(InsufficientFundsError);
    });

    it('should throw NotFoundError for invalid recipient', async () => {
      await expect(
        walletService.transferFunds(testUser.id, 'invalid-id', 500)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('withdrawFunds', () => {
    beforeEach(async () => {
      await walletService.fundWallet(testUser.id, 2000);
    });

    it('should withdraw funds successfully', async () => {
      const result = await walletService.withdrawFunds(testUser.id, 500);
      
      expect(result.balance).toBe(1500);
      expect(result.transaction.type).toBe('debit');
      expect(result.transaction.amount).toBe(500);
    });

    it('should throw InsufficientFundsError when balance is low', async () => {
      await expect(
        walletService.withdrawFunds(testUser.id, 3000)
      ).rejects.toThrow(InsufficientFundsError);
    });
  });
});