# Lendsqr Wallet Service - Backend Engineering Test

A robust backend wallet service for Demo Credit mobile lending app, built with Node.js, TypeScript, and MySQL.

## Table of Content
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Overview

This wallet service provides essential financial operations for a mobile lending application, including user onboarding with blacklist verification, wallet management, and secure fund transfers.

## Features

- ✅ User registration with Lendsqr Adjutor Karma blacklist verification
- ✅ Secure JWT-based authentication
- ✅ Wallet creation and management
- ✅ Fund wallet functionality
- ✅ Peer-to-peer fund transfers
- ✅ Withdrawal operations
- ✅ Transaction history tracking
- ✅ Comprehensive error handling and logging
- ✅ Input validation and sanitization
- ✅ Database transaction scoping for data integrity

## Tech Stack

- **Runtime**: Node.js (LTS)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Knex.js
- **Authentication**: JWT
- **Testing**: Jest
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, bcryptjs
- **Containerization**: Docker & Docker Compose

## Architectures

The application follows a layered architecture pattern:

```
├── Controllers (HTTP request handling)
├── Services (Business logic)
├── Database (Data access layer)
├── Middleware (Authentication, validation, error handling)
├── Utils (Shared utilities)
└── Types (TypeScript definitions)
```

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │    WALLETS      │       │  TRANSACTIONS   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │───────│ user_id (FK)    │───────│ wallet_id (FK)  │
│ email           │   1:1 │ id (PK)         │   1:N │ id (PK)         │
│ phone           │       │ balance         │       │ recipient_wallet│
│ password_hash   │       │ currency        │       │ type            │
│ first_name      │       │ created_at      │       │ category        │
│ last_name       │       │ updated_at      │       │ amount          │
│ is_blacklisted  │       └─────────────────┘       │ balance_before  │
│ created_at      │                                 │ balance_after   │
│ updated_at      │                                 │ reference       │
└─────────────────┘                                 │ description     │
                                                    │ status          │
                                                    │ created_at      │
                                                    │ updated_at      │
                                                    └─────────────────┘
```

### Database Schema

**Users Table**
- `id`: UUID primary key
- `email`: Unique email address
- `phone`: Unique phone number
- `password_hash`: Bcrypt hashed password
- `first_name`: User's first name
- `last_name`: User's last name
- `is_blacklisted`: Boolean flag for blacklist status
- `created_at`, `updated_at`: Timestamps

**Wallets Table**
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `balance`: Decimal balance amount
- `currency`: Currency code (default: NGN)
- `created_at`, `updated_at`: Timestamps

**Transactions Table**
- `id`: UUID primary key
- `wallet_id`: Foreign key to wallets table
- `recipient_wallet_id`: Foreign key for transfer recipient
- `type`: Transaction type (credit, debit)
- `category`: Transaction category (funding, transfer, withdrawal)
- `amount`: Transaction amount
- `balance_before`: Balance before transaction
- `balance_after`: Balance after transaction
- `reference`: Unique transaction reference
- `description`: Transaction description
- `status`: Transaction status (pending, completed, failed)
- `created_at`, `updated_at`: Timestamps

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "1234567890",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "token": "jwt_token"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Wallet Endpoints (Requires Authentication)

#### Get Wallet Balance
```http
GET /wallet
Authorization: Bearer <jwt_token>
```

#### Fund Wallet
```http
POST /wallet/fund
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 1000.00
}
```

#### Transfer Funds
```http
POST /wallet/transfer
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipient_id": "recipient_user_id",
  "amount": 500.00,
  "description": "Payment for services"
}
```

#### Withdraw Funds
```http
POST /wallet/withdraw
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 200.00
}
```

#### Get Transaction History
```http
GET /wallet/transactions
Authorization: Bearer <jwt_token>
```

### Error Responses

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## Setup Instructions

### Prerequisites
- Node.js (LTS version)
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LENDSQR_BACKEND_TEST
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start database services**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run migrate:latest
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- ✅ Unit tests for all services
- ✅ Integration tests for wallet operations
- ✅ Mock external dependencies (Adjutor API)
- ✅ Positive and negative test scenarios
- ✅ Error handling validation

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lendsqr_wallet
DB_USER=root
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Adjutor API Configuration
ADJUTOR_API_URL=https://adjutor.lendsqr.com/v2/verification/karma
ADJUTOR_API_KEY=your-adjutor-api-key

# Transaction Limits
MINIMUM_DEPOSIT_AMOUNT=100
MAXIMUM_DEPOSIT_AMOUNT=5000000
MINIMUM_WITHDRAWAL_AMOUNT=100
TRANSACTION_FEE_PERCENTAGE=1.5
```

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── constants.ts  # Application constants
│   └── env.ts       # Environment variables
├── controllers/      # HTTP request handlers
│   ├── auth.controller.ts
│   └── wallet.controller.ts
├── database/         # Database layer
│   ├── migrations/   # Database migrations
│   └── connection.ts # Database connection
├── middleware/       # Express middleware
│   ├── auth.ts      # Authentication middleware
│   ├── errorHandler.ts
│   └── validate.ts  # Input validation
├── routes/          # API route definitions
│   ├── auth.routes.ts
│   ├── wallet.routes.ts
│   └── index.ts
├── services/        # Business logic layer
│   ├── adjutor.service.ts  # Blacklist verification
│   ├── auth.service.ts     # Authentication logic
│   ├── transaction.service.ts
│   ├── user.service.ts
│   └── wallet.service.ts
├── tests/           # Test files
│   ├── *.test.ts    # Unit tests
│   └── setup.ts     # Test configuration
├── types/           # TypeScript definitions
│   ├── express.d.ts # Express type extensions
│   └── index.ts     # Application types
├── utils/           # Utility functions
│   ├── errors.ts    # Custom error classes
│   ├── logger.ts    # Winston logger
│   └── response.ts  # Response utilities
├── validators/      # Input validation schemas
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## Key Design Decisions

1. **Database Transactions**: All wallet operations use database transactions with row locking to ensure data consistency
2. **UUID Primary Keys**: Enhanced security and better scalability
3. **Layered Architecture**: Clear separation of concerns
4. **Comprehensive Logging**: Winston logger for debugging and monitoring
5. **Type Safety**: Full TypeScript implementation with strict typing
6. **Error Handling**: Custom error classes with proper HTTP status codes
7. **Security**: Password hashing, JWT authentication, input validation

## Security Features

- ✅ Password hashing with bcrypt (salt rounds: 12)
- ✅ JWT token authentication with expiration
- ✅ Input validation and sanitization
- ✅ SQL injection prevention with parameterized queries
- ✅ Blacklist verification for user onboarding
- ✅ Rate limiting and security headers
- ✅ Database transaction scoping for atomic operations

## Transaction Integrity

All wallet operations implement proper transaction scoping:

```typescript
const trx = await db.transaction();
try {
  // Row locking to prevent race conditions
  const wallet = await trx('wallets')
    .where('user_id', userId)
    .first()
    .forUpdate();
    
  // Update operations
  await trx('wallets').where('id', wallet.id).update(...);
  await trx('transactions').insert(...);
  
  await trx.commit();
} catch (error) {
  await trx.rollback();
  throw error;
}
```

## API Testing Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Fund wallet
```bash
curl -X POST http://localhost:5000/api/v1/wallet/fund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"amount": 1000}'
```

## License

ISC License

## Author

Built for Lendsqr Backend Engineering Assessment
