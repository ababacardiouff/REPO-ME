import express from "express";
import checkoutRouter from "./api/checkout";
import { registerMetrics } from "./metrics";

const app = express();
app.use(express.json());

app.use("/api/checkout", checkoutRouter);
registerMetrics(app);

export default app;
