// src/modules/maintenance/entities/work-order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WorkOrderPart } from './work-order-part.entity';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'branch_id', type: 'uuid', nullable: true })
  branchId: string;

  // Mantenemos vehicleId pero lo hacemos nullable por si la orden es para una maquinaria o edificio
  @Column({ name: 'vehicle_id', type: 'uuid', nullable: true })
  vehicleId: string;

  // Nuevos campos para soportar de forma polimórfica edificios, maquinarias o redes
  @Column({ name: 'target_type', type: 'varchar', length: 50, nullable: true })
  targetType: string; // 'VEHICLE', 'ASSET_EQUIPMENT', 'BUILDING'

  @Column({ name: 'target_id', type: 'uuid', nullable: true })
  targetId: string; // ID genérico del activo o edificio

  @Column({ type: 'varchar', length: 30, default: 'CORRECTIVE' }) // CORRECTIVE, PREVENTIVE
  type: string;

  @Column({ type: 'varchar', length: 30, default: 'OPEN' }) // OPEN, IN_PROGRESS, WAITING_PARTS, COMPLETED, CANCELLED
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'labor_cost', type: 'numeric', precision: 12, scale: 2, default: 0 })
  laborCost: number;

  @Column({ name: 'parts_cost', type: 'numeric', precision: 12, scale: 2, default: 0 })
  partsCost: number;

  @Column({ name: 'total_cost', type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalCost: number;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'completion_date', type: 'timestamp', nullable: true })
  completionDate: Date;

  @OneToMany(() => WorkOrderPart, (part) => part.workOrder, { cascade: true })
  parts: WorkOrderPart[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}