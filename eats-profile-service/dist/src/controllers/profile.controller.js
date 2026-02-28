"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profile_service_1 = require("../services/profile.service");
class ProfileController {
    getProfile(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        res.status(200).json(profile);
    }
    updateProfile(req, res) {
        const profile = profile_service_1.profileService.updateProfile(req.params.userId, req.body);
        res.status(200).json(profile);
    }
    updatePreferences(req, res) {
        const profile = profile_service_1.profileService.updatePreferences(req.params.userId, req.body);
        res.status(200).json(profile);
    }
}
exports.default = new ProfileController();
