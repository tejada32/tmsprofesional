// src/modules/maintenance/entities/work-order-part.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WorkOrder } from './work-order.entity';

@Entity('work_order_parts')
export class WorkOrderPart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'work_order_id', type: 'uuid' })
  workOrderId: string;

  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.parts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string; // Relación con el inventario de repuestos

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @Column({ name: 'unit_cost', type: 'numeric', precision: 12, scale: 2, default: 0 })
  unitCost: number;

  @Column({ name: 'total_cost', type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalCost: number;
}