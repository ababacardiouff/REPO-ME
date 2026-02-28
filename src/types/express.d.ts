import "express";

declare global {
  namespace Express {
    interface Request {
      molam?: {
        sub: string;
        roles: string[];
      };
    }
  }
}

export {};
