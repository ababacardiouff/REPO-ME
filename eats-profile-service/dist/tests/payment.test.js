"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../src");
describe("payment API", () => {
    it("creates and removes payment method", async () => {
        const userId = "00000000-0000-0000-0000-000000000011";
        const createResponse = await (0, supertest_1.default)(src_1.app)
            .post(`/profiles/${userId}/payments`)
            .send({ provider: "MolamPay", token: "tok_test", last4: "1234" });
        expect(createResponse.status).toBe(201);
        const removeResponse = await (0, supertest_1.default)(src_1.app)
            .delete(`/profiles/${userId}/payments/${createResponse.body.id}`);
        expect(removeResponse.status).toBe(204);
    });
});
