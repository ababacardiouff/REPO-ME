import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type MolamClaims = jwt.JwtPayload & {
  sub?: string;
  roles?: string[];
};

export function requireMolamJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.MOLAM_ID_JWT_SECRET || "test") as MolamClaims;
    if (!decoded.sub) return res.status(401).json({ error: "invalid_token" });
    req.molam = { sub: String(decoded.sub), roles: Array.isArray(decoded.roles) ? decoded.roles : [] };
    return next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.molam?.roles || [];
    if (!roles.some((role) => userRoles.includes(role))) {
      return res.status(403).json({ error: "forbidden" });
    }
    return next();
  };
}
