// src/entities/inventory-stock.entity.ts
//
// Tabla central del inventario multi-almacén: una fila por cada
// combinación Producto + Almacén, con su propia cantidad y ubicación
// física. Antes esto se intentaba resolver con un solo campo en
// Product, lo cual solo permitía que un producto estuviera en un lugar
// del sistema entero.
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

@Entity('inventory_stock')
@Index(['companyId']) // acelera "dame todo el inventario de esta empresa"
@Index(['productId', 'warehouseId'], { unique: true }) // una sola fila por producto+almacén
export class InventoryStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  // Dónde exactamente dentro de ESE almacén (pasillo/estante/nivel).
  // Opcional: no toda empresa necesita ese nivel de detalle.
  @Column({ type: 'uuid', nullable: true })
  warehouseLocationId: string;

  @ManyToOne(() => WarehouseLocation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'warehouseLocationId' })
  warehouseLocation: WarehouseLocation;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  quantity: number;

  // Mínimo/máximo POR ALMACÉN (ej. este producto necesita reorden en la
  // Sucursal Norte con 5 unidades, pero en el Almacén Central con 20).
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  minStock: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  maxStock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
