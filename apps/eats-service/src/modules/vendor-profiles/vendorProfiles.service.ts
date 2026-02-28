import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVendorProfileDto } from "./dto/createVendorProfile.dto";
import { VendorProfileEats } from "./entities/vendorProfile.entity";

@Injectable()
export class VendorProfilesService {
  constructor(
    @InjectRepository(VendorProfileEats)
    private readonly repo: Repository<VendorProfileEats>,
  ) {}

  async create(dto: CreateVendorProfileDto) {
    const profile = this.repo.create({
      vendor: { id: dto.vendorId } as VendorProfileEats["vendor"],
      molamUserId: dto.molamUserId,
      role: dto.role,
      active: true,
    });

    return this.repo.save(profile);
  }

  async findByVendor(vendorId: string) {
    return this.repo.find({
      where: { vendor: { id: vendorId } },
      order: { createdAt: "DESC" },
    });
  }

  async remove(profileId: string) {
    const result = await this.repo.delete(profileId);
    if (!result.affected) {
      throw new NotFoundException("Vendor profile not found");
    }

    return { deleted: true };
  }
}
