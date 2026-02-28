import request from "supertest";
import app from "../src/index";

jest.mock("../src/services/refundService", () => ({
  createRefund: jest.fn().mockResolvedValue({ id: "refund-1" }),
}));

jest.mock("../src/services/pdfService", () => ({
  generateCreditNote: jest.fn().mockResolvedValue(new Uint8Array([37, 80, 68, 70])),
}));

jest.mock("../src/services/emailService", () => ({
  sendCreditNoteEmail: jest.fn().mockResolvedValue(undefined),
}));

describe("Refund API", () => {
  it("should create refund and return PDF", async () => {
    const res = await request(app)
      .post("/api/refunds")
      .send({
        orderId: "test-order",
        userId: "test-user",
        amount: 20,
        reason: "Produit abîmé",
        email: "test@molam.com",
        molamId: "molam_123",
      })
      .expect(200);

    expect(res.headers["content-type"]).toContain("application/pdf");
  });
});
