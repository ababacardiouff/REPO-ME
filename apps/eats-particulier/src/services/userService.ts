import { PrismaClient } from "@prisma/client";
import { MolamClaims } from "../middleware/auth";
import { callFatimaForAccount } from "./FatimaClient";

const prisma = new PrismaClient();

export async function findOrCreateEatsUser(molamClaims: MolamClaims) {
  const molamId = molamClaims.sub;
  let user = await prisma.eatsUser.findUnique({ where: { molamId } });
  if (user) return user;

  const country = molamClaims.country || "SN";
  const language = molamClaims.locale || "fr";
  const currency = molamClaims.currency || (country === "US" ? "USD" : "XOF");

  user = await prisma.eatsUser.create({
    data: {
      molamId,
      country,
      currency,
      language,
      displayName: `${molamClaims.given_name || ""} ${molamClaims.family_name || ""}`.trim(),
      email: molamClaims.email,
      phone: molamClaims.phone,
      docContainerId: molamClaims.doc_container_id || null,
    },
  });

  void callFatimaForAccount({ molamId, email: molamClaims.email });

  return user;
}

export async function getEatsUserProfile(molamId: string) {
  return prisma.eatsUser.findUnique({
    where: { molamId },
    include: { addresses: true },
  });
}

export async function updateEatsUser(molamId: string, patch: any) {
  const allowed: Record<string, unknown> = {};
  if (patch.displayName) allowed.displayName = patch.displayName;
  if (patch.language) allowed.language = patch.language;
  if (patch.currency) allowed.currency = patch.currency;
  if (patch.country) allowed.country = patch.country;

  return prisma.eatsUser.update({ where: { molamId }, data: allowed });
}

export async function listUserAddresses(molamId: string) {
  const user = await prisma.eatsUser.findUnique({ where: { molamId } });
  if (!user) return [];
  return prisma.eatsUserAddress.findMany({ where: { userId: user.id } });
}

export async function createAddress(molamId: string, addr: any) {
  const user = await prisma.eatsUser.findUnique({ where: { molamId } });
  if (!user) throw new Error("user not found");

  return prisma.eatsUserAddress.create({
    data: {
      userId: user.id,
      label: addr.label || "address",
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      lat: addr.lat,
      lon: addr.lon,
      isDefault: addr.isDefault || false,
    },
  });
}
