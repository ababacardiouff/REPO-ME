import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: "missing auth" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_PUBLIC_KEY || "dev-key") as jwt.JwtPayload;
    req.user = {
      id: String(payload.sub || ""),
      roles: Array.isArray(payload.roles) ? payload.roles : []
    };
    return next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}
