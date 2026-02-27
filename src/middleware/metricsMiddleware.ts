import { NextFunction, Request, Response } from "express";
import { httpRequestDuration, httpRequestsTotal } from "../infra/metrics";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status_code: String(res.statusCode) }, 1);
    end();
  });
  next();
}
