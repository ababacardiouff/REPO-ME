import { getCartDetail, listCarts } from "../src/services/adminCartService";
import { prisma } from "../src/lib/prisma";

jest.mock("../src/lib/prisma", () => ({
  prisma: {
    eats_carts: {
      findMany: jest.fn().mockResolvedValue([{ id: "cart-1" }]),
      findUnique: jest.fn().mockResolvedValue({ id: "cart-1", eats_cart_items: [], eats_cart_schedules: [] }),
    },
  },
}));

describe("adminCartService", () => {
  it("listCarts delegates filters", async () => {
    const carts = await listCarts({ page: 1, perPage: 10, status: "OPEN" });
    expect(carts).toHaveLength(1);
    expect(prisma.eats_carts.findMany).toHaveBeenCalled();
  });

  it("getCartDetail loads relations", async () => {
    const cart = await getCartDetail("cart-1");
    expect(cart).toHaveProperty("id", "cart-1");
    expect(prisma.eats_carts.findUnique).toHaveBeenCalled();
  });
});
