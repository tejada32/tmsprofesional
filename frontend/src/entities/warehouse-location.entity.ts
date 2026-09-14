// src/entities/warehouse-location.entity.ts
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
import { Warehouse } from './warehouse.entity';

@Entity('warehouse_locations')
@Index(['warehouseId']) // acelera "dame las ubicaciones de este almacén"
export class WarehouseLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // CORREGIDO: antes apuntaba a Branch. Una sucursal puede tener varios
  // almacenes, así que una ubicación (pasillo/estante) debe pertenecer a
  // UN almacén específico, no a la sucursal en general. La sucursal se
  // puede obtener igual navegando warehouseLocation.warehouse.branch.
  @Column({ type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column({ type: 'varchar', length: 50 })
  aisle: string; // Pasillo (Ej: A, B, C)

  @Column({ type: 'varchar', length: 50 })
  shelfOrSection: string; // Estantería o sección (Ej: 101, 102)

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string; // Nivel (Ej: 1, 2, Suelo)

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
