"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../src");
describe("address API", () => {
    it("creates and lists an address", async () => {
        const userId = "00000000-0000-0000-0000-000000000010";
        const createResponse = await (0, supertest_1.default)(src_1.app)
            .post(`/profiles/${userId}/addresses`)
            .send({ label: "Home", street: "Rue 10", city: "Dakar", country: "Senegal" });
        expect(createResponse.status).toBe(201);
        const listResponse = await (0, supertest_1.default)(src_1.app).get(`/profiles/${userId}/addresses`);
        expect(listResponse.status).toBe(200);
        expect(listResponse.body).toHaveLength(1);
    });
});
