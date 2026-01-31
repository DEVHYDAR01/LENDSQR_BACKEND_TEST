export interface TokenPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      requestId?: string;
    }
  }
}

export {};
