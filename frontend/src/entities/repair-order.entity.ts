// src/entities/repair-order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RepairStatus {
  DIAGNOSIS = 'DIAGNOSIS',         // En diagnóstico / revisión
  WAITING_PARTS = 'WAITING_PARTS', // Esperando piezas o repuestos
  IN_PROGRESS = 'IN_PROGRESS',     // En reparación activa
  READY = 'READY',                 // Listo para entregar
  DELIVERED = 'DELIVERED',         // Entregado al cliente
  CANCELLED = 'CANCELLED',         // Cancelado
}

@Entity('repair_orders')
export class RepairOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  branchId: string; // Declarado una sola vez de forma correcta

  @Column({ type: 'uuid' })
  clientId: string;

  @Column({ type: 'uuid', nullable: true })
  technicianId: string; // Vinculado al módulo de empleados

  @Column({ type: 'varchar', length: 150 })
  deviceModel: string; // Ej: "iPhone 13 Pro", "Laptop Lenovo ThinkPad"

  @Column({ type: 'varchar', length: 100, nullable: true })
  serialNumberOrMac: string; // Número de serie o MAC Address para control y garantías

  @Column({ type: 'text' })
  problemDescription: string; // Descripción del fallo reportado por el cliente

  @Column({ type: 'text', nullable: true })
  aestheticCondition: string; // Notas físicas iniciales (ej: "Rayas leves en pantalla")

  @Column({ type: 'text', nullable: true })
  technicalDiagnosis: string; // Diagnóstico realizado por el técnico

  // Piezas o repuestos consumidos del inventario
  @Column({ type: 'jsonb', default: [] })
  partsUsed: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  estimatedCost: number; // Costo estimado

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  finalCost: number; // Costo final de la reparación

  @Column({ 
    type: 'enum', 
    enum: RepairStatus, 
    default: RepairStatus.DIAGNOSIS 
  })
  status: RepairStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}