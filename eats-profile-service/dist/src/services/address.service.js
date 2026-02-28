"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressService = exports.AddressService = void 0;
const node_crypto_1 = require("node:crypto");
class AddressService {
    constructor() {
        this.addresses = new Map();
    }
    list(profileId) {
        return this.addresses.get(profileId) ?? [];
    }
    create(profileId, payload) {
        const current = this.list(profileId);
        const address = {
            id: (0, node_crypto_1.randomUUID)(),
            profile_id: profileId,
            label: payload.label,
            street: payload.street,
            city: payload.city,
            country: payload.country,
            is_default: payload.is_default ?? current.length === 0,
            created_at: new Date().toISOString()
        };
        const normalized = this.ensureSingleDefault(current, address);
        this.addresses.set(profileId, normalized);
        return address;
    }
    update(profileId, id, payload) {
        const current = this.list(profileId);
        const target = current.find((address) => address.id === id);
        if (!target) {
            return null;
        }
        const updated = {
            ...target,
            ...payload,
            is_default: payload.is_default ?? target.is_default
        };
        const next = current.map((address) => (address.id === id ? updated : address));
        this.addresses.set(profileId, this.ensureSingleDefault(next));
        return updated;
    }
    remove(profileId, id) {
        const current = this.list(profileId);
        const next = current.filter((address) => address.id !== id);
        if (next.length === current.length) {
            return false;
        }
        this.addresses.set(profileId, this.ensureSingleDefault(next));
        return true;
    }
    ensureSingleDefault(addresses, inserted) {
        const items = inserted ? [...addresses, inserted] : [...addresses];
        const defaultIndex = items.findIndex((address) => address.is_default);
        if (defaultIndex === -1 && items.length > 0) {
            items[0].is_default = true;
            return items;
        }
        return items.map((address, index) => ({
            ...address,
            is_default: index === defaultIndex
        }));
    }
}
exports.AddressService = AddressService;
exports.addressService = new AddressService();
