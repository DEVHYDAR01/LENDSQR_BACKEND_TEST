import { Request, Response, NextFunction } from 'express';
import walletService from '../services/wallet.service';
import transactionService from '../services/transaction.service';
import { sendSuccess } from '../utils/response';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export class WalletController {
  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthenticatedRequest;
      const wallet = await walletService.getWalletByUserId(authReq.user.userId);
      return sendSuccess(res, wallet);
    } catch (error) {
      return next(error);
    }
  }

  async fundWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      const authReq = req as AuthenticatedRequest;
      const wallet = await walletService.fundWallet(authReq.user.userId, amount);
      return sendSuccess(res, wallet);
    } catch (error) {
      return next(error);
    }
  }

  async transferFunds(req: Request, res: Response, next: NextFunction) {
    try {
      const { recipient_id, amount, description } = req.body;
      const authReq = req as AuthenticatedRequest;
      const result = await walletService.transferFunds(
        authReq.user.userId,
        recipient_id,
        amount,
        description
      );
      return sendSuccess(res, result);
    } catch (error) {
      return next(error);
    }
  }

  async withdrawFunds(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      const authReq = req as AuthenticatedRequest;
      const wallet = await walletService.withdrawFunds(authReq.user.userId, amount);
      return sendSuccess(res, wallet);
    } catch (error) {
      return next(error);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthenticatedRequest;
      const wallet = await walletService.getWalletByUserId(authReq.user.userId);
      const transactions = await transactionService.getTransactionsByWalletId(wallet.id);
      return sendSuccess(res, transactions);
    } catch (error) {
      return next(error);
    }
  }
}

export default new WalletController();