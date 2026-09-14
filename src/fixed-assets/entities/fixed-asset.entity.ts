//src/fixed-assets/entities/fixed-asset.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AssetCategory {
  FURNITURE = 'FURNITURE',         // Mobiliario y equipos de oficina
  COMPUTERS = 'COMPUTERS',         // Equipos de computación y tecnología
  MACHINERY = 'MACHINERY',         // Maquinaria y equipos industriales
  VEHICLES = 'VEHICLES',           // Vehículos (autos, camiones)
  MOTORCYCLES = 'MOTORCYCLES',     // Motocicletas (clave para flotas de reparto)
  REAL_ESTATE = 'REAL_ESTATE',     // Edificios y terrenos
  OTHER = 'OTHER'
}

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  DISPOSED = 'DISPOSED',
  SOLD = 'SOLD',
  FULLY_DEPRECIATED = 'FULLY_DEPRECIATED'
}

@Entity('fixed_assets')
export class FixedAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  branchId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  assetTag: string;

  @Column({ type: 'enum', enum: AssetCategory })
  category: AssetCategory;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  model: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  plateOrVin: string;

  @Column({ type: 'date' })
  purchaseDate: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  purchaseCost: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  salvageValue: number;

  @Column({ type: 'integer' })
  usefulLifeMonths: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  currentBookValue: number;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.ACTIVE })
  status: AssetStatus;

  @Column({ type: 'text', nullable: true })
  locationDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}