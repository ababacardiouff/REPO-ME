import { UpsellService } from "../../src/services/upsellService";

jest.mock("../../src/infra/db", () => ({
  query: jest.fn(async (sql: string) => {
    if (sql.includes("upsell_links")) return { rows: [] };
    if (sql.includes("cross_sell_links")) return { rows: [] };
    if (sql.includes("Fatima_suggestions_cache") && sql.includes("SELECT")) return { rows: [] };
    return { rows: [] };
  }),
}));

jest.mock("../../src/lib/FatimaClient", () => ({
  FatimaClient: jest.fn().mockImplementation(() => ({
    getMenuBundle: async () => ({ items: [{ id: "i1", name: "Bundle", price: 100 }], total: 100, currency: "XOF" }),
  })),
}));

jest.mock("../../src/infra/kafkaProducer", () => ({ emitUpsellEvent: jest.fn(async () => undefined) }));

describe("UpsellService", () => {
  it("returns structure with premium, cross and FatimaBundle", async () => {
    const svc = new UpsellService();
    const res = await svc.getUpsellForProduct("00000000-0000-0000-0000-000000000000", null);

    expect(res).toHaveProperty("premium");
    expect(res).toHaveProperty("cross");
    expect(res).toHaveProperty("FatimaBundle");
  });
});
