import { prisma } from "../lib/prisma";

export type ABMode = "random" | "A" | "B" | "C";

export async function getCurrentABConfig() {
  let config = await prisma.eatsABConfig.findFirst();
  if (!config) {
    config = await prisma.eatsABConfig.create({ data: { forcedMode: "random" } });
  }
  return config;
}

export async function updateABConfig(mode: ABMode) {
  return prisma.eatsABConfig.updateMany({ data: { forcedMode: mode } });
}
