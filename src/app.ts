import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (_, res) => {
  res.json({ 
    message: 'Welcome to Lendsqr Wallet API', 
    version: env.API_VERSION,
    endpoints: {
      health: '/health',
      api: `/api/${env.API_VERSION}`
    }
  });
});

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use(`/api/${env.API_VERSION}`, routes);

// Error handling
app.use(errorHandler);

export default app;