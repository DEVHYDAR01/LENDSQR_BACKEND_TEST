import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators';

const router = Router();

router.get('/', (_, res) => {
  res.json({
    message: 'Authentication endpoints',
    endpoints: {
      register: 'POST /register',
      login: 'POST /login'
    }
  });
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;