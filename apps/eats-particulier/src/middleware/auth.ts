import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface MolamClaims {
  sub: string;
  email?: string;
  phone?: string;
  given_name?: string;
  family_name?: string;
  country?: string;
  locale?: string;
  currency?: string;
  doc_container_id?: string;
  roles?: string[];
}

export function verifyMolamJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "missing_token" });

  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: "missing_token" });

  try {
    const secret = process.env.MOLAM_ID_JWT_SECRET || "testsecret";
    const claims = jwt.verify(token, secret) as MolamClaims;
    (req as any).molam = claims;
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}
