import { Router } from 'express';
import walletController from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { fundWalletSchema, transferSchema, withdrawSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.get('/', walletController.getWallet);
router.post('/fund', validate(fundWalletSchema), walletController.fundWallet);
router.post('/transfer', validate(transferSchema), walletController.transferFunds);
router.post('/withdraw', validate(withdrawSchema), walletController.withdrawFunds);
router.get('/transactions', walletController.getTransactions);

export default router;