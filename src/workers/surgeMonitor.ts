import { evaluate } from "../services/surgeService";
import { getAllActiveRestaurants } from "../services/restaurantService";
import { setActiveSurge } from "../services/surgeStateStore";
import { sleep } from "../utils";

async function sampleContextForRestaurant() {
  return {
    at: new Date().toISOString(),
    demandRatio: 1.2,
    queueLength: 3,
    avgETA: 20,
    weather: { condition: "clear" }
  };
}

async function runLoop() {
  while (true) {
    try {
      const restaurants = await getAllActiveRestaurants();
      for (const restaurant of restaurants) {
        const context = await sampleContextForRestaurant();
        const result = await evaluate(restaurant.id, context);
        await setActiveSurge(restaurant.id, result);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("surgeMonitor error", error);
    }

    await sleep(5000);
  }
}

runLoop().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
