// src/entities/product-combo-item.entity.ts
//
// Define de qué productos (y en qué cantidad) se compone un producto
// marcado como combo (Product.isCombo = true). Ej: el combo "Set de Sala"
// = 1x Sofá 3 piezas + 2x Mesa Auxiliar + 1x Alfombra.
//
// Nota de diseño: solo soporta un nivel (un combo de productos simples).
// Un combo no puede contener a otro combo — si tu negocio necesita eso
// más adelante, hay que revisarlo aparte.
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

@Entity('product_combo_items')
@Index(['companyId'])
@Index(['comboProductId', 'componentProductId'], { unique: true }) // no repetir el mismo componente 2 veces en el mismo combo
export class ProductComboItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  // El producto que ES el combo (Product.isCombo = true)
  @Column({ type: 'uuid' })
  comboProductId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comboProductId' })
  comboProduct: Product;

  // Un producto individual que forma parte de ese combo.
  // onDelete RESTRICT a propósito: evita borrar un producto por
  // accidente mientras todavía forma parte de algún combo activo.
  @Column({ type: 'uuid' })
  componentProductId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'componentProductId' })
  componentProduct: Product;

  // Cuántas unidades de este componente lleva UNA unidad del combo
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
