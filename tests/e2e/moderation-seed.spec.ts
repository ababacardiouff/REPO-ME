import { test, expect } from "@playwright/test";

test("moderation seed endpoint list reachable", async ({ request }) => {
  const res = await request.get("/api/admin/moderation/requests");
  expect([200, 401, 403]).toContain(res.status());
});
