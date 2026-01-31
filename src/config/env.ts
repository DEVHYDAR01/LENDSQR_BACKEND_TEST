import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_VERSION: process.env.API_VERSION || 'v1',

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'lendsqr_wallet_dev',

  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  ADJUTOR_API_URL: process.env.ADJUTOR_API_URL || '',
  ADJUTOR_API_KEY: process.env.ADJUTOR_API_KEY || '',

  MIN_DEPOSIT: parseFloat(process.env.MINIMUM_DEPOSIT_AMOUNT || '100'),
  MAX_DEPOSIT: parseFloat(process.env.MAXIMUM_DEPOSIT_AMOUNT || '5000000'),
  MIN_WITHDRAWAL: parseFloat(process.env.MINIMUM_WITHDRAWAL_AMOUNT || '100'),
  TRANSACTION_FEE: parseFloat(process.env.TRANSACTION_FEE_PERCENTAGE || '1.5'),
};
