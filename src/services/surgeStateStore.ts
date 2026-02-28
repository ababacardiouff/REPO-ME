type Stored = { value: number; expiresAt: number };

const dailyStore = new Map<string, Stored>();
const activeStore = new Map<string, { payload: string; expiresAt: number }>();

export async function addDailyIncrease(restaurantId: string, percentIncrease: number) {
  const key = `${getDay()}:${restaurantId}`;
  const current = dailyStore.get(key);
  const now = Date.now();
  const next = (current?.expiresAt || 0) > now ? current!.value + percentIncrease : percentIncrease;
  dailyStore.set(key, { value: next, expiresAt: now + 3 * 24 * 60 * 60 * 1000 });
}

export async function getDailyIncrease(restaurantId: string) {
  const key = `${getDay()}:${restaurantId}`;
  const current = dailyStore.get(key);
  if (!current || current.expiresAt < Date.now()) return 0;
  return current.value;
}

export async function setActiveSurge(restaurantId: string, state: unknown) {
  activeStore.set(`active:${restaurantId}`, {
    payload: JSON.stringify(state),
    expiresAt: Date.now() + 60 * 60 * 1000
  });
}

export async function getActiveSurge(restaurantId: string) {
  const v = activeStore.get(`active:${restaurantId}`);
  if (!v || v.expiresAt < Date.now()) return null;
  return JSON.parse(v.payload);
}

function getDay() {
  return new Date().toISOString().slice(0, 10);
}
