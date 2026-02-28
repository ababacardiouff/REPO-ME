import { DataSource } from "typeorm";
import { VendorProfileEats } from "../apps/eats-service/src/modules/vendor-profiles/entities/vendorProfile.entity";

export async function seedVendorProfiles(dataSource: DataSource) {
  const repo = dataSource.getRepository(VendorProfileEats);

  const profiles = [
    {
      vendorId: "123e4567-e89b-12d3-a456-426614174111",
      molamUserId: "123e4567-e89b-12d3-a456-426614174222",
      role: "Admin",
    },
    {
      vendorId: "123e4567-e89b-12d3-a456-426614174111",
      molamUserId: "123e4567-e89b-12d3-a456-426614174333",
      role: "Manager",
    },
  ];

  for (const p of profiles) {
    const exists = await repo.findOne({
      where: { vendor: { id: p.vendorId }, molamUserId: p.molamUserId },
    });

    if (!exists) {
      await repo.save(
        repo.create({
          vendor: { id: p.vendorId } as VendorProfileEats["vendor"],
          molamUserId: p.molamUserId,
          role: p.role,
          active: true,
        }),
      );
    }
  }
}
