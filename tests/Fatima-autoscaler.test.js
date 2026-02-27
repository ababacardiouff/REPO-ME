import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node-fetch", () => {
  return {
    default: vi.fn()
  };
});

import fetch from "node-fetch";
import { fetchLatencyForecast } from "../Fatima-autoscaler/index.js";

describe("FATIMA Autoscaler Forecast", () => {
  beforeEach(() => {
    process.env.PROMETHEUS_URL = "http://prometheus.test";
  });

  it("should return a numeric forecast for tenant eats", async () => {
    fetch.mockResolvedValue({
      json: async () => ({
        data: { result: [{ values: [[1, "0.5"], [2, "1.0"]] }] }
      })
    });

    const forecast = await fetchLatencyForecast("eats");
    expect(typeof forecast).toBe("number");
    expect(forecast).toBeGreaterThan(0);
  });

  it("should handle empty data gracefully", async () => {
    fetch.mockResolvedValue({
      json: async () => ({ data: { result: [] } })
    });

    const forecast = await fetchLatencyForecast("unknown-tenant");
    expect(forecast).toBe(0);
  });
});
