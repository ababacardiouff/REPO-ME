import { IsIn, IsString, IsUUID } from "class-validator";

export const VENDOR_PROFILE_ROLES = ["Admin", "Manager", "Marketer", "Accountant", "ExternalAgent"] as const;

export class CreateVendorProfileDto {
  @IsUUID()
  vendorId: string;

  @IsUUID()
  molamUserId: string;

  @IsString()
  @IsIn(VENDOR_PROFILE_ROLES)
  role: (typeof VENDOR_PROFILE_ROLES)[number];
}
