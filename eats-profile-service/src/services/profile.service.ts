import { randomUUID } from "node:crypto";
import { Profile, ProfilePreferences, ProfileUpdatePayload } from "../models/profile.model";

export class ProfileService {
  private readonly profiles = new Map<string, Profile>();

  constructor() {
    this.seed();
  }

  getOrCreateByUserId(userId: string): Profile {
    const existing = this.profiles.get(userId);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const profile: Profile = {
      id: randomUUID(),
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

  updateProfile(userId: string, payload: ProfileUpdatePayload): Profile {
    const profile = this.getOrCreateByUserId(userId);
    const updated: Profile = {
      ...profile,
      ...payload,
      updated_at: new Date().toISOString()
    };
    this.profiles.set(userId, updated);
    return updated;
  }

  updatePreferences(userId: string, preferences: Partial<ProfilePreferences>): Profile {
    const profile = this.getOrCreateByUserId(userId);
    const mergedPreferences = { ...profile.preferences, ...preferences };
    const updated: Profile = {
      ...profile,
      preferences: mergedPreferences,
      locale: mergedPreferences.language,
      currency: mergedPreferences.currency,
      updated_at: new Date().toISOString()
    };
    this.profiles.set(userId, updated);
    return updated;
  }

  private seed(): void {
    const now = new Date().toISOString();
    const userId = "00000000-0000-0000-0000-000000000001";
    this.profiles.set(userId, {
      id: randomUUID(),
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

export const profileService = new ProfileService();
