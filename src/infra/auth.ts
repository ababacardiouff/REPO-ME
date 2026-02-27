import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
  };
}

function verifyAndAttach(req: AuthenticatedRequest, res: Response, next: NextFunction, keyEnv: string) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: "missing auth" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, keyEnv || "dev-key") as jwt.JwtPayload;
    req.user = {
      id: String(payload.sub || ""),
      roles: Array.isArray(payload.roles) ? (payload.roles as string[]) : []
    };
    return next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return verifyAndAttach(req, res, next, process.env.JWT_PUBLIC_KEY || "");
}

export function molamAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return verifyAndAttach(req, res, next, process.env.MOLAM_ID_JWKS || "");
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if ((req.user?.roles || []).includes("admin")) {
    return next();
  }
  return res.status(403).json({ error: "forbidden" });
}
