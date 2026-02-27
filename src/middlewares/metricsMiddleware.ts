import { NextFunction, Request, Response } from "express";
import {
  eatsProductViewsTotal,
  httpRequestDuration,
  httpRequestsTotal
} from "../infra/metrics";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status_code: String(res.statusCode) }, 1);
    if (req.method === "GET" && req.path.startsWith("/api/eats/products/")) {
      const productId = req.path.split("/").at(-1) || "unknown";
      eatsProductViewsTotal.inc({ product_id: productId }, 1);
    }
    end();
  });
  next();
}
