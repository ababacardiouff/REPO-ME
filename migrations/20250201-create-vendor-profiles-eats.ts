import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVendorProfilesEats20250201 implements MigrationInterface {
  name = "CreateVendorProfilesEats20250201";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vendor_profiles_eats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_id UUID NOT NULL REFERENCES eats_vendors(id) ON DELETE CASCADE,
        molam_user_id UUID NOT NULL,
        role VARCHAR(100) NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        CONSTRAINT uq_vendor_profiles_eats_vendor_user UNIQUE (vendor_id, molam_user_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS vendor_profiles_eats");
  }
}
