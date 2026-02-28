import express from "express";
import bodyParser from "body-parser";
import {
  activateAccount,
  getMyAccount,
  updateAccount,
  listAddresses,
  addAddress,
} from "./controllers/accountController";
import { verifyMolamJwt } from "./middleware/auth";
import { setupMetrics } from "./metrics";

const app = express();
app.use(bodyParser.json());

setupMetrics(app);

app.use(verifyMolamJwt);

app.post("/accounts/activate", activateAccount);
app.get("/accounts/me", getMyAccount);
app.put("/accounts/me", updateAccount);

app.get("/accounts/addresses", listAddresses);
app.post("/accounts/addresses", addAddress);

export default app;
