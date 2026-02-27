import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface RbacClaims extends jwt.JwtPayload {
  roles?: string[];
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "missing auth" });
    }

    try {
      const decoded = jwt.verify(token, process.env.MOLAM_ID_JWT_SECRET || "dev-key") as RbacClaims;
      const userRoles = Array.isArray(decoded.roles) ? decoded.roles : [];

      if (!roles.some((role) => userRoles.includes(role))) {
        return res.status(403).json({ error: "forbidden" });
      }

      return next();
    } catch {
      return res.status(401).json({ error: "invalid token" });
    }
  };
}
