// src/modules/maintenance/entities/asset-equipment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Building } from './building.entity';

@Entity('asset_equipments')
export class AssetEquipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'building_id', type: 'uuid', nullable: true })
  buildingId: string;

  @ManyToOne(() => Building, (building) => building.assets, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'building_id' })
  building: Building;

  @Column({ type: 'varchar', length: 150 })
  name: string; // Ej: "Switch Cisco 24 Puertos", "Planta Eléctrica"

  @Column({ type: 'varchar', length: 50 })
  category: string; // 'machinery', 'network', 'facility_part'

  @Column({ name: 'serial_number', type: 'varchar', length: 100, nullable: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 50, default: 'operational' })
  status: string; // 'operational', 'maintenance', 'out_of_service'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}