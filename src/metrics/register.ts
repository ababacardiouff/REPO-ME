import client from "prom-client";
import "./scheduleMetrics";

export const registerMetrics = client.register;

client.collectDefaultMetrics();
