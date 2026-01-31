"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lendsqr_wallet_dev'
        },
        migrations: {
            directory: './src/database/migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './src/database/seeds'
        },
        pool: {
            min: 2,
            max: 10
        }
    },
    test: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_TEST_HOST || 'localhost',
            port: Number(process.env.DB_TEST_PORT) || 3306,
            user: process.env.DB_TEST_USER || 'root',
            password: process.env.DB_TEST_PASSWORD || '',
            database: process.env.DB_TEST_NAME || 'lendsqr_wallet_test'
        },
        migrations: {
            directory: './src/database/migrations'
        },
        seeds: {
            directory: './src/database/seeds'
        }
    },
    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lendsqr_wallet_prod'
        },
        migrations: {
            directory: './src/database/migrations'
        },
        pool: {
            min: 2,
            max: 10
        }
    }
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map