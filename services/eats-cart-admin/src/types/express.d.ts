import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        roles?: string[];
        [key: string]: unknown;
      };
    }
  }
}

export {};
