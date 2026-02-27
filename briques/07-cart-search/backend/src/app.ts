import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Cart/Search service listening on ${port}`);
});
