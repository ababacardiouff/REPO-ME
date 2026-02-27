import app from "./app";
import { connectProducer } from "./infra/kafka";
import { dispatchOutbox } from "./workers/outbox";

const port = Number(process.env.PORT || 3000);

export async function main() {
  await connectProducer();
  setInterval(() => {
    void dispatchOutbox();
  }, 5000);

  app.listen(port, () => {
    console.log(`Molam Eats Menu API listening on ${port}`);
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal startup error", err);
    process.exit(1);
  });
}

export default app;
