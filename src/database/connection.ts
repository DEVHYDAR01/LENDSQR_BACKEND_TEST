import knex, { Knex } from 'knex';
import knexConfig from '../../knexfile';
import { logger } from '../utils/logger';

const environment = process.env.NODE_ENV || 'development';
const dbConfig = knexConfig[environment];

class Database {
  private static instance: Knex;

  public static getInstance(): Knex {
    if (!Database.instance) {
      Database.instance = knex(dbConfig);
      
      // Test connection
      Database.instance.raw('SELECT 1')
        .then(() => {
          logger.info(`Database connected successfully in ${environment} mode`);
        })
        .catch((error) => {
          logger.error('Database connection failed:', error);
          process.exit(1);
        });
    }
    
    return Database.instance;
  }

  public static async closeConnection(): Promise<void> {
    if (Database.instance) {
      await Database.instance.destroy();
      logger.info('Database connection closed');
    }
  }
}

export default Database.getInstance();
export { Database };