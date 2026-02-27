import bodyParser from "body-parser";
import express from "express";
import docsRoutes from "./api/eats/documents";
import eatsInternalRoutes from "./api/eats/internal";
import onboardingRoutes from "./api/eats/onboarding";
import vendorPlansRoutes from "./api/vendorPlans.routes";
import vendorAdminRoutes from "./api/vendorPlans.admin.routes";
import molamPayWebhook from "./api/webhooks/molamPay";
import { startDocumentWorker } from "./workers/eatsDocumentWorker";
import { startOnboardingWorker } from "./workers/eatsOnboardingWorker";
import { startSubscriptionRenewalWorker } from "./workers/subscriptionRenewalWorker";

const app = express();
app.use(bodyParser.json());

app.use("/api/eats/onboarding", onboardingRoutes);
app.use("/api/eats/documents", docsRoutes);
app.use("/api/eats/internal", eatsInternalRoutes);
app.use("/api/eats/plans", vendorPlansRoutes);
app.use("/api/eats/plans/admin", vendorAdminRoutes);
app.use("/api/webhooks", molamPayWebhook);
app.get("/health", (_, res) => res.json({ ok: true }));

export async function startServer() {
  const port = Number(process.env.PORT || 3001);
  app.listen(port, async () => {
    console.log("Eats service running on", port);
    startOnboardingWorker().catch((e) => console.error(e));
    startDocumentWorker().catch((e) => console.error(e));
    startSubscriptionRenewalWorker();
  });
}

if (require.main === module) {
  void startServer();
}

export default app;
