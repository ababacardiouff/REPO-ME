import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app";

const molamJwt = jwt.sign({ sub: "user-1", email: "u@x.com", roles: ["admin"] }, process.env.MOLAM_ID_JWT_SECRET || "test");

describe("Catalog API", () => {
  it("creates restaurant -> category -> item", async () => {
    const r = await request(app)
      .post("/restaurants")
      .set("Authorization", `Bearer ${molamJwt}`)
      .send({
        name: { fr: "Chez A" },
        slug: `chez-a-${Date.now()}`,
        country: "SN",
        currency: "XOF",
        language: "fr"
      })
      .expect(201);

    const restId = r.body.id;

    const c = await request(app)
      .post(`/restaurants/${restId}/categories`)
      .set("Authorization", `Bearer ${molamJwt}`)
      .send({ code: "main", name: { fr: "Plats" } })
      .expect(201);

    const catId = c.body.id;

    const it = await request(app)
      .post(`/restaurants/${restId}/items`)
      .set("Authorization", `Bearer ${molamJwt}`)
      .send({
        categoryId: catId,
        name: { fr: "Thieboudienne" },
        price: 5000,
        currency: "XOF"
      })
      .expect(201);

    expect(it.body.name.fr).toBe("Thieboudienne");
  });
});
