import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/connection';
import { Transaction } from '../types';
import { TRANSACTION_STATUS } from '../config/constants';

interface CreateTransactionData {
  wallet_id: string;
  recipient_wallet_id?: string;
  type: 'credit' | 'debit';
  category: 'funding' | 'transfer' | 'withdrawal';
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  description?: string;
  status?: 'pending' | 'completed' | 'failed';
}

export class TransactionService {
  async createTransaction(
    trx: Knex.Transaction,
    data: CreateTransactionData
  ): Promise<void> {
    await trx('transactions').insert({
      id: uuidv4(),
      wallet_id: data.wallet_id,
      recipient_wallet_id: data.recipient_wallet_id || null,
      type: data.type,
      category: data.category,
      amount: data.amount,
      balance_before: data.balance_before,
      balance_after: data.balance_after,
      reference: data.reference,
      description: data.description || null,
      status: data.status || TRANSACTION_STATUS.COMPLETED,
    });
  }

  async getTransactionsByWalletId(
    walletId: string,
    limit = 50,
    offset = 0
  ): Promise<Transaction[]> {
    return db('transactions')
      .where('wallet_id', walletId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  async getTransactionByReference(reference: string): Promise<Transaction | null> {
    return db('transactions').where('reference', reference).first();
  }

  async getUserTransactions(
    userId: string,
    limit = 50,
    offset = 0
  ): Promise<Transaction[]> {
    return db('transactions')
      .join('wallets', 'transactions.wallet_id', 'wallets.id')
      .where('wallets.user_id', userId)
      .select('transactions.*')
      .orderBy('transactions.created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
}

export default new TransactionService();