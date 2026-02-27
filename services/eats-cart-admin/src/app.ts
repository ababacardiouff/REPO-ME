import express from "express";
import adminCartRouter from "./api/adminCart";
import { registerMetrics } from "./metrics";

const app = express();
app.use(express.json());

app.use("/api/admin/cart", adminCartRouter);
registerMetrics(app);

export default app;
