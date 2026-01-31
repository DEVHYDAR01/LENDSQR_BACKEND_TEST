import { Router } from 'express';
import authRoutes from './auth.routes';
import walletRoutes from './wallet.routes';

const router = Router();

// API root endpoint
router.get('/', (_, res) => {
  res.json({
    message: 'Lendsqr Wallet API v1',
    endpoints: {
      auth: '/auth',
      wallet: '/wallet'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/wallet', walletRoutes);

export default router;