"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../src");
describe("profile API", () => {
    it("retrieves a profile", async () => {
        const response = await (0, supertest_1.default)(src_1.app).get("/profiles/00000000-0000-0000-0000-000000000001");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("first_name");
    });
    it("updates profile preferences", async () => {
        const response = await (0, supertest_1.default)(src_1.app)
            .put("/profiles/00000000-0000-0000-0000-000000000001/preferences")
            .send({ language: "en", currency: "USD", notifications: false });
        expect(response.status).toBe(200);
        expect(response.body.preferences.language).toBe("en");
    });
});
