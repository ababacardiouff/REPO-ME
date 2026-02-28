import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtUser = {
  id: string;
  tenant_id?: string;
  roles?: string[];
};

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: "missing_token" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.MOLAM_ID_JWT_SECRET || "dev-secret") as JwtUser;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtUser;
    if (!user?.roles?.includes(role)) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}
