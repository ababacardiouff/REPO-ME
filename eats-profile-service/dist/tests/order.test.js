"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../src");
describe("order API", () => {
    it("returns order history", async () => {
        const response = await (0, supertest_1.default)(src_1.app).get("/profiles/00000000-0000-0000-0000-000000000001/orders");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it("returns tracking details", async () => {
        const history = await (0, supertest_1.default)(src_1.app).get("/profiles/00000000-0000-0000-0000-000000000001/orders");
        const orderId = history.body[0].id;
        const tracking = await (0, supertest_1.default)(src_1.app).get(`/orders/${orderId}/tracking`);
        expect(tracking.status).toBe(200);
        expect(tracking.body).toHaveProperty("timeline");
    });
});
