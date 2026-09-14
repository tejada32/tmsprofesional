// src/entities/product-serial.entity.ts
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

export enum ProductSerialStatus {
  IN_STOCK = 'in_stock',
  SOLD = 'sold',
  WARRANTY = 'warranty',
}

@Entity('product_serials')
@Index(['companyId']) // acelera "dame los seriales de esta empresa"
@Index(['companyId', 'serialNumber'], { unique: true }) // único por empresa, no global
export class ProductSerial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NUEVO: no existía. Sin esto, dos empresas no podrían usar el mismo
  // número de serie aunque sean marcas/productos completamente distintos.
  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // CORREGIDO: antes era branchId/Branch. Igual que con el inventario,
  // el serial vive en un almacén específico, no solo en la sucursal.
  @Column({ type: 'uuid', nullable: true })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  // CORREGIDO: ya no es "unique: true" a nivel de columna (era global,
  // ver el índice compuesto arriba que lo limita a "único por empresa")
  @Column({ type: 'varchar', length: 150 })
  serialNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  macAddress: string;

  // CORREGIDO: antes era varchar libre con un default de texto.
  // Ahora es un enum, igual que el resto de tus entidades.
  @Column({ type: 'enum', enum: ProductSerialStatus, default: ProductSerialStatus.IN_STOCK })
  status: ProductSerialStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
