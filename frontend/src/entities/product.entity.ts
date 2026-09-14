// src/entities/product.entity.ts

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
import { Company } from './company.entity';

export enum ProductType {
  PHYSICAL = 'PHYSICAL',
  SERVICE = 'SERVICE',
}

@Entity('products')
@Index(['companyId']) // acelera "dame los productos de esta empresa"
@Index(['companyId', 'sku'], { unique: true, where: '"sku" IS NOT NULL' })
// CORREGIDO: el SKU es único por empresa, no global (antes dos empresas
// distintas no podían usar el mismo SKU "0001" cada una para lo suyo).
// El "where" excluye los nulls: varios productos sin SKU no chocan entre sí.
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.id)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  // --- Atributos físicos y logísticos (Especializado para Tiendas de Muebles) ---
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'length_cm' })
  lengthCm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'width_cm' })
  widthCm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'height_cm' })
  heightCm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'weight_kg' })
  weightKg: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true, name: 'cubic_meters' })
  cubicMeters: number;

  @Column({ type: 'boolean', default: false, name: 'requires_assembly' })
  requiresAssembly: boolean;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.PHYSICAL,
  })
  type: ProductType; // Producto físico o servicio

  // CORREGIDO: ya no es "unique: true" a nivel de columna (era global,
  // ver el índice compuesto arriba que lo limita a "único por empresa")
  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  // Días de garantía del producto
  @Column({ type: 'int', default: 0 })
  warrantyDays: number;

  // Indica si la política de garantía se imprime en la factura
  @Column({ type: 'boolean', default: true })
  printWarrantyOnInvoice: boolean;

  // Indica si el producto requiere registrar Serial/MAC
  @Column({ type: 'boolean', default: false })
  requiresSerialMac: boolean;

  // Indica si el producto es un combo
  @Column({ type: 'boolean', default: false })
  isCombo: boolean;

  // NUEVO: para descontinuar un producto sin borrarlo (ya tiene historial
  // de ventas/compras asociado)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Imagen del producto: puede ser una ruta local o una URL externa
  // Ejemplos:
  // /uploads/products/foto.jpg
  // https://ejemplo.com/foto.jpg
  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
