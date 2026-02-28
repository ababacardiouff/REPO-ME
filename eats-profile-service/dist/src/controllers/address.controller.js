"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_service_1 = require("../services/address.service");
const profile_service_1 = require("../services/profile.service");
class AddressController {
    getAddresses(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        res.status(200).json(address_service_1.addressService.list(profile.id));
    }
    addAddress(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        const address = address_service_1.addressService.create(profile.id, req.body);
        res.status(201).json(address);
    }
    updateAddress(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        const updated = address_service_1.addressService.update(profile.id, req.params.id, req.body);
        if (!updated) {
            res.status(404).json({ message: "Address not found" });
            return;
        }
        res.status(200).json(updated);
    }
    deleteAddress(req, res) {
        const profile = profile_service_1.profileService.getOrCreateByUserId(req.params.userId);
        const removed = address_service_1.addressService.remove(profile.id, req.params.id);
        res.status(removed ? 204 : 404).send();
    }
}
exports.default = new AddressController();
