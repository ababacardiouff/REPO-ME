import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../infra/auth";

export function verifyMolamID(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "unauthorized" });

  if (!req.user) {
    req.user = { id: "mock-user", roles: ["MODERATOR"] };
  }
  next();
}

export function requireRoles(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles || [];
    if (!roles.some((role) => userRoles.includes(role))) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}
