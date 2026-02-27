import bodyParser from "body-parser";
import express from "express";
import docsRoutes from "./api/eats/documents";
import onboardingRoutes from "./api/eats/onboarding";
import { startDocumentWorker } from "./workers/eatsDocumentWorker";
import { startOnboardingWorker } from "./workers/eatsOnboardingWorker";

const app = express();
app.use(bodyParser.json());

app.use("/api/eats/onboarding", onboardingRoutes);
app.use("/api/eats/documents", docsRoutes);
app.get("/health", (_, res) => res.json({ ok: true }));

export async function startServer() {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, async () => {
    console.log("Eats Onboarding service running on", port);
    startOnboardingWorker().catch((e) => console.error(e));
    startDocumentWorker().catch((e) => console.error(e));
  });
}

if (require.main === module) {
  void startServer();
}

export default app;
