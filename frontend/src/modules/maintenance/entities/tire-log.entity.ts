// src/modules/maintenance/entities/tire-log.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tire_logs')
export class TireLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'vehicle_id', type: 'uuid', nullable: true })
  vehicleId: string;

  @Column({ name: 'serial_number', type: 'varchar', length: 100, unique: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 50 })
  position: string; // Ej. DELANTERA_IZQUIERDA, TRASERA_INTERNA_DERECHA

  @Column({ name: 'installation_date', type: 'date', nullable: true })
  installationDate: Date;

  @Column({ name: 'installation_mileage', type: 'integer', default: 0 })
  installationMileage: number;

  @Column({ name: 'current_depth_mm', type: 'numeric', precision: 5, scale: 2, default: 10.00 })
  currentDepthMm: number; // Profundidad del dibujo de la llanta en milímetros

  @Column({ type: 'varchar', length: 30, default: 'ACTIVE' }) // ACTIVE, ROTATED, REPLACED, DISCARDED
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}