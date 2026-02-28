import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app";

jest.mock("../src/lib/db", () => ({
  db: {
    one: jest.fn().mockResolvedValue({ id: "inv-1" })
  }
}));

jest.mock("../src/workers/invoiceWorker", () => ({
  processInvoice: jest.fn().mockResolvedValue(undefined)
}));

describe("Invoice flow", () => {
  it("should create invoice and accept", async () => {
    process.env.MOLAM_ID_JWT_SECRET = "test-secret";
    const token = jwt.sign({ id: "svc", roles: ["admin"] }, process.env.MOLAM_ID_JWT_SECRET);

    const res = await request(app)
      .post("/api/invoices/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderId: "22222222-2222-2222-2222-222222222222",
        tenantId: "11111111-1111-1111-1111-111111111111",
        issuerId: "11111111-1111-1111-1111-111111111112",
        recipientId: "11111111-1111-1111-1111-111111111113",
        currency: "XOF",
        totalAmount: 1100,
        taxAmount: 100,
        language: "fr"
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("accepted");
    expect(res.body.invoiceId).toBe("inv-1");
  });
});
