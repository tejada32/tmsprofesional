// src/entities/warehouse-inventory.entity.ts
//
// Renombrada desde BranchInventory: el stock se maneja por ALMACÉN
// (Warehouse), no por sucursal (Branch), porque una sucursal puede tener
// varios almacenes con cantidades independientes entre sí.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';

@Entity('warehouse_inventory')
@Index(['companyId']) // acelera "dame todo el inventario de esta empresa"
// Único por producto+almacén SOLO cuando no se usa control de lotes
// (batchNumber null). Con lotes, el mismo producto puede tener varias
// filas en el mismo almacén (un lote por fila), así que ahí no aplica
// la restricción única.
@Index(['productId', 'warehouseId'], { unique: true, where: '"batchNumber" IS NULL' })
export class WarehouseInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NUEVO: no existía. Sin esto, nada impide mezclar inventario entre
  // empresas distintas al consultar directamente por ID.
  @Column({ type: 'uuid' })
  companyId: string;

  // CORREGIDO: antes era branchId/Branch. Ahora apunta al almacén
  // específico dentro de la sucursal.
  @Column({ type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  // NUEVO: ubicación física exacta dentro de ese almacén (pasillo/estante).
  // Opcional, no toda empresa necesita ese nivel de detalle.
  @Column({ type: 'uuid', nullable: true })
  warehouseLocationId: string;

  @ManyToOne(() => WarehouseLocation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'warehouseLocationId' })
  warehouseLocation: WarehouseLocation;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  stock: number;

  @Column({ type: 'varchar', nullable: true })
  batchNumber: string;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  minStockLevel: number;

  // NUEVO: existía el mínimo pero no el máximo (útil para saber cuándo
  // dejar de reordenar, no solo cuándo empezar).
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  maxStockLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
