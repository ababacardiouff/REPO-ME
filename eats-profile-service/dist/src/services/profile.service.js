"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileService = exports.ProfileService = void 0;
const node_crypto_1 = require("node:crypto");
class ProfileService {
    constructor() {
        this.profiles = new Map();
        this.seed();
    }
    getOrCreateByUserId(userId) {
        const existing = this.profiles.get(userId);
        if (existing) {
            return existing;
        }
        const now = new Date().toISOString();
        const profile = {
            id: (0, node_crypto_1.randomUUID)(),
            user_id: userId,
            first_name: "Guest",
            last_name: "User",
            locale: "fr",
            currency: "XOF",
            preferences: {
                language: "fr",
                currency: "XOF",
                notifications: true
            },
            created_at: now,
            updated_at: now
        };
        this.profiles.set(userId, profile);
        return profile;
    }
    updateProfile(userId, payload) {
        const profile = this.getOrCreateByUserId(userId);
        const updated = {
            ...profile,
            ...payload,
            updated_at: new Date().toISOString()
        };
        this.profiles.set(userId, updated);
        return updated;
    }
    updatePreferences(userId, preferences) {
        const profile = this.getOrCreateByUserId(userId);
        const mergedPreferences = { ...profile.preferences, ...preferences };
        const updated = {
            ...profile,
            preferences: mergedPreferences,
            locale: mergedPreferences.language,
            currency: mergedPreferences.currency,
            updated_at: new Date().toISOString()
        };
        this.profiles.set(userId, updated);
        return updated;
    }
    seed() {
        const now = new Date().toISOString();
        const userId = "00000000-0000-0000-0000-000000000001";
        this.profiles.set(userId, {
            id: (0, node_crypto_1.randomUUID)(),
            user_id: userId,
            first_name: "Awa",
            last_name: "Ndiaye",
            email: "awa.ndiaye@example.com",
            phone: "+221770000001",
            locale: "fr",
            currency: "XOF",
            preferences: {
                language: "fr",
                currency: "XOF",
                notifications: true
            },
            created_at: now,
            updated_at: now
        });
    }
}
exports.ProfileService = ProfileService;
exports.profileService = new ProfileService();
