const { assignVariant } = require("../jobs/cartNotifier.js");

describe("Cart Notifier Variant Assignment", () => {
  it("returns random variant when mode=random", () => {
    const variant = assignVariant("random");
    expect(["A", "B", "C"]).toContain(variant);
  });

  it("returns forced variant", () => {
    expect(assignVariant("A")).toBe("A");
    expect(assignVariant("C")).toBe("C");
  });
});
