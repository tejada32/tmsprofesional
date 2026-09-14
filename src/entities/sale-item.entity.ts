// src/entities/sale-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from './product.entity';

@Entity('sale_items')
@Index(['companyId']) // consistente con el resto de tus tablas
export class SaleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NUEVO: aunque se puede derivar via sale.companyId, se guarda directo
  // para consultas rápidas sin necesitar un JOIN, y por consistencia con
  // el resto del sistema (todas las demás tablas la tienen).
  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  saleId: string;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'saleId' })
  sale: Sale;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  // NUEVO: descuento aplicado a esta línea específica (no al total de la
  // venta). Opcional, con default 0.
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number;
}
