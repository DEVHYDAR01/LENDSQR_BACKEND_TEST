import db from '../database/connection';
import { Wallet } from '../types';
import { NotFoundError, InsufficientFundsError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import transactionService from './transaction.service';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../config/constants';

export class WalletService {
  async getWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = await db('wallets').where('user_id', userId).first();
    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }
    return wallet;
  }

  async fundWallet(userId: string, amount: number, reference?: string): Promise<Wallet> {
    if (amount < env.MIN_DEPOSIT || amount > env.MAX_DEPOSIT) {
      throw new ValidationError(
        `Amount must be between ₦${env.MIN_DEPOSIT} and ₦${env.MAX_DEPOSIT}`
      );
    }

    const trx = await db.transaction();
    try {
      const wallet = await trx('wallets')
        .where('user_id', userId)
        .first()
        .forUpdate();

      if (!wallet) {
        throw new NotFoundError('Wallet not found');
      }

      const newBalance = parseFloat(wallet.balance) + amount;
      
      await trx('wallets')
        .where('id', wallet.id)
        .update({ 
          balance: newBalance,
          updated_at: trx.fn.now()
        });

      // Record transaction
      await transactionService.createTransaction(trx, {
        wallet_id: wallet.id,
        type: TRANSACTION_TYPES.CREDIT,
        category: TRANSACTION_CATEGORIES.FUNDING,
        amount,
        balance_before: parseFloat(wallet.balance),
        balance_after: newBalance,
        reference: reference || `FUND_${Date.now()}`,
        description: 'Wallet funding',
      });

      await trx.commit();
      logger.info(`Wallet funded: ${userId}, Amount: ₦${amount}`);
      
      return this.getWalletByUserId(userId);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async transferFunds(
    fromUserId: string,
    toUserId: string,
    amount: number,
    description?: string
  ): Promise<{ fromWallet: Wallet; toWallet: Wallet }> {
    if (amount <= 0) {
      throw new ValidationError('Transfer amount must be greater than zero');
    }

    const trx = await db.transaction();
    try {
      // Get both wallets with row locks
      const [fromWallet, toWallet] = await Promise.all([
        trx('wallets').where('user_id', fromUserId).first().forUpdate(),
        trx('wallets').where('user_id', toUserId).first().forUpdate(),
      ]);

      if (!fromWallet || !toWallet) {
        throw new NotFoundError('One or both wallets not found');
      }

      if (fromUserId === toUserId) {
        throw new ValidationError('Cannot transfer to same wallet');
      }

      const fromBalance = parseFloat(fromWallet.balance);
      if (fromBalance < amount) {
        throw new InsufficientFundsError(
          `Insufficient funds. Available: ₦${fromBalance}`
        );
      }

      const newFromBalance = fromBalance - amount;
      const newToBalance = parseFloat(toWallet.balance) + amount;

      // Update balances
      await Promise.all([
        trx('wallets').where('id', fromWallet.id).update({ 
          balance: newFromBalance,
          updated_at: trx.fn.now()
        }),
        trx('wallets').where('id', toWallet.id).update({ 
          balance: newToBalance,
          updated_at: trx.fn.now()
        }),
      ]);

      const reference = `TXF_${Date.now()}`;

      // Record both transactions
      await Promise.all([
        transactionService.createTransaction(trx, {
          wallet_id: fromWallet.id,
          recipient_wallet_id: toWallet.id,
          type: TRANSACTION_TYPES.DEBIT,
          category: TRANSACTION_CATEGORIES.TRANSFER,
          amount,
          balance_before: fromBalance,
          balance_after: newFromBalance,
          reference,
          description: description || `Transfer to ${toUserId}`,
        }),
        transactionService.createTransaction(trx, {
          wallet_id: toWallet.id,
          recipient_wallet_id: fromWallet.id,
          type: TRANSACTION_TYPES.CREDIT,
          category: TRANSACTION_CATEGORIES.TRANSFER,
          amount,
          balance_before: parseFloat(toWallet.balance),
          balance_after: newToBalance,
          reference,
          description: description || `Transfer from ${fromUserId}`,
        }),
      ]);

      await trx.commit();
      logger.info(`Transfer completed: ${fromUserId} -> ${toUserId}, Amount: ₦${amount}`);

      return {
        fromWallet: await this.getWalletByUserId(fromUserId),
        toWallet: await this.getWalletByUserId(toUserId),
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async withdrawFunds(userId: string, amount: number): Promise<Wallet> {
    if (amount < env.MIN_WITHDRAWAL) {
      throw new ValidationError(`Minimum withdrawal amount is ₦${env.MIN_WITHDRAWAL}`);
    }

    const trx = await db.transaction();
    try {
      const wallet = await trx('wallets')
        .where('user_id', userId)
        .first()
        .forUpdate();

      if (!wallet) {
        throw new NotFoundError('Wallet not found');
      }

      const currentBalance = parseFloat(wallet.balance);
      if (currentBalance < amount) {
        throw new InsufficientFundsError(
          `Insufficient funds. Available: ₦${currentBalance}`
        );
      }

      const newBalance = currentBalance - amount;

      await trx('wallets')
        .where('id', wallet.id)
        .update({ 
          balance: newBalance,
          updated_at: trx.fn.now()
        });

      // Record transaction
      await transactionService.createTransaction(trx, {
        wallet_id: wallet.id,
        type: TRANSACTION_TYPES.DEBIT,
        category: TRANSACTION_CATEGORIES.WITHDRAWAL,
        amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        reference: `WTH_${Date.now()}`,
        description: 'Wallet withdrawal',
      });

      await trx.commit();
      logger.info(`Withdrawal completed: ${userId}, Amount: ₦${amount}`);
      
      return this.getWalletByUserId(userId);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

export default new WalletService();