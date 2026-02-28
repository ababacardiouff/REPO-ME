import { randomUUID } from "node:crypto";
import { Address, AddressPayload } from "../models/address.model";

export class AddressService {
  private readonly addresses = new Map<string, Address[]>();

  list(profileId: string): Address[] {
    return this.addresses.get(profileId) ?? [];
  }

  create(profileId: string, payload: AddressPayload): Address {
    const current = this.list(profileId);
    const address: Address = {
      id: randomUUID(),
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

  update(profileId: string, id: string, payload: Partial<AddressPayload>): Address | null {
    const current = this.list(profileId);
    const target = current.find((address) => address.id === id);
    if (!target) {
      return null;
    }

    const updated: Address = {
      ...target,
      ...payload,
      is_default: payload.is_default ?? target.is_default
    };

    const next = current.map((address) => (address.id === id ? updated : address));
    this.addresses.set(profileId, this.ensureSingleDefault(next));
    return updated;
  }

  remove(profileId: string, id: string): boolean {
    const current = this.list(profileId);
    const next = current.filter((address) => address.id !== id);
    if (next.length === current.length) {
      return false;
    }
    this.addresses.set(profileId, this.ensureSingleDefault(next));
    return true;
  }

  private ensureSingleDefault(addresses: Address[], inserted?: Address): Address[] {
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

export const addressService = new AddressService();
