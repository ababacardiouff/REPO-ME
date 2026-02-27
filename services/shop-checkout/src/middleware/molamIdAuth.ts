import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const JWKS_URI = process.env.MOLAM_ID_JWKS || "https://molam-id/.well-known/jwks.json";
const client = jwksClient({ jwksUri: JWKS_URI });

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = (key as any).getPublicKey();
    callback(null, signingKey);
  });
}

type AuthedRequest = Request & { user?: any };

export function molamIdAuth(requiredRoles: string[] = []) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Missing Authorization" });
    const token = auth.split(" ")[1];

    jwt.verify(token, getKey as any, {}, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      req.user = decoded;
      const roles = decoded.roles || [];
      const hasRole = requiredRoles.length === 0 || requiredRoles.some((r) => roles.includes(r));
      if (!hasRole) return res.status(403).json({ error: "Forbidden" });
      next();
    });
  };
}
