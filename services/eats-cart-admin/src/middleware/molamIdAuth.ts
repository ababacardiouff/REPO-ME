import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const JWKS_URI = process.env.MOLAM_ID_JWKS || "https://molam-id/.well-known/jwks.json";
const client = jwksClient({ jwksUri: JWKS_URI });

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key?.getPublicKey());
  });
}

export function molamIdAuth(requiredRoles: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Missing Authorization" });

    const token = auth.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    if (process.env.NODE_ENV === "test" && process.env.MOLAM_BYPASS_JWT === "1") {
      const decoded = jwt.decode(token) as { sub?: string; roles?: string[] } | null;
      if (!decoded?.sub) return res.status(401).json({ error: "Invalid token" });
      req.user = { sub: decoded.sub, roles: decoded.roles || [] };
      const hasRole = requiredRoles.length === 0 || requiredRoles.some((role) => req.user?.roles?.includes(role));
      if (!hasRole) return res.status(403).json({ error: "Forbidden" });
      return next();
    }

    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err || !decoded || typeof decoded === "string") {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.user = decoded as Express.Request["user"];
      const roles = req.user?.roles || [];
      const hasRole = requiredRoles.length === 0 || requiredRoles.some((role) => roles.includes(role));

      if (!hasRole) return res.status(403).json({ error: "Forbidden" });
      return next();
    });
  };
}
