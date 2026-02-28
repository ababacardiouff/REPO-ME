import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Vendor } from "../../vendors/entities/vendor.entity";

@Entity("vendor_profiles_eats")
@Unique("uq_vendor_molam_user", ["vendor", "molamUserId"])
export class VendorProfileEats {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.profiles, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "vendor_id" })
  vendor: Vendor;

  @Column({ type: "varchar", length: 100 })
  role: string;

  @Column({ type: "uuid", name: "molam_user_id" })
  molamUserId: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
