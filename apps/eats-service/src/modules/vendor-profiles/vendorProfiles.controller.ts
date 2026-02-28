import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt.guard";
import { CreateVendorProfileDto } from "./dto/createVendorProfile.dto";
import { VendorProfilesService } from "./vendorProfiles.service";

@Controller("eats/vendor-profiles")
@UseGuards(JwtAuthGuard)
export class VendorProfilesController {
  constructor(private readonly service: VendorProfilesService) {}

  @Post()
  async createProfile(@Body() dto: CreateVendorProfileDto) {
    return this.service.create(dto);
  }

  @Get(":vendorId")
  async listProfiles(@Param("vendorId") vendorId: string) {
    return this.service.findByVendor(vendorId);
  }

  @Delete(":profileId")
  async removeProfile(@Param("profileId") profileId: string) {
    return this.service.remove(profileId);
  }
}
