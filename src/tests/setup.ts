import { Database } from '../database/connection';

beforeAll(async () => {
  // Setup test database
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Close database connection
  await Database.closeConnection();
});

beforeEach(async () => {
  // Clean up database before each test
  const db = Database.getInstance();
  await db('transactions').del();
  await db('wallets').del();
  await db('users').del();
});