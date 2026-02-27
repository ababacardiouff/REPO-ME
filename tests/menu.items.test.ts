import request from "supertest";
import app from "../src/app";

jest.mock("../src/db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(async (sql: string) => {
      if (sql.includes("INSERT INTO eats_menu_items")) {
        return { rows: [{ id: "item-1", name: { fr: "Test", en: "Test" } }] };
      }
      if (sql.includes("SELECT * FROM eats_menu_items")) {
        return { rows: [{ id: "item-1", name: { fr: "Test", en: "Test" } }] };
      }
      return { rows: [] };
    })
  }
}));

describe("Eats Menu Items", () => {
  it("create and fetch item", async () => {
    const create = await request(app).post("/api/eats/items").send({
      vendorId: "0000",
      skuCode: `TEST-${Date.now()}`,
      name: { fr: "Test", en: "Test" },
      defaultPriceCents: 1000,
      currency: "XOF"
    });
    expect(create.status).toBe(200);
    const id = create.body.id;

    const get = await request(app).get(`/api/eats/items/${id}`);
    expect(get.status).toBe(200);
    expect(get.body.name.fr).toBe("Test");
  });
});
