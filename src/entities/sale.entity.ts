// src/entities/sale.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Company } from './company.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Warehouse } from './warehouse.entity';
import { Client } from './client.entity';
import { User } from './user.entity';
import { SaleItem } from './sale-item.entity';
import { Currency } from './currency.entity';
import { Employee } from './employee.entity';

export enum SalePaymentMethod {
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  MIXED = 'MIXED',
}

export enum SaleStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

@Entity('sales')
@Index(['companyId']) // acelera "dame las ventas de esta empresa"
@Index(['companyId', 'fiscalNumber'], { unique: true, where: '"fiscalNumber" IS NOT NULL' })
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  branchId: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  // NUEVO: de qué almacén específico salió la mercancía. Antes solo se
  // usaba de forma transitoria en el controlador para descontar stock,
  // pero nunca quedaba guardado en la venta.
  @Column({ type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  // NUEVO: el hallazgo más importante de la revisión — antes no existía
  // ninguna relación con Client. Las ventas al contado usan el cliente
  // especial "Contado" (Client.isCashClient = true); las de crédito usan
  // el cliente real.
  @Column({ type: 'uuid' })
  clientId: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  employeeId: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  // NUEVO: cómo se pagó la venta.
  @Column({ type: 'enum', enum: SalePaymentMethod, default: SalePaymentMethod.CASH })
  paymentMethod: SalePaymentMethod;

  // NUEVO: estado de la venta (permite anular/reversar más adelante)
  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.COMPLETED })
  status: SaleStatus;

  // --- CAMPOS MULTIMONEDA (ya existían) ---
  @Column({ type: 'uuid', nullable: true })
  currencyId: string;

  @ManyToOne(() => Currency, { nullable: true })
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 1.0000 })
  exchangeRate: number;
  // --------------------------

  // --- NUEVO: desglose fiscal ---
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  // Número de Comprobante Fiscal (NCF) u otro folio fiscal equivalente.
  // Nullable porque no toda empresa factura con NCF (ej. planes que no
  // usan impuestos, Company.useTax = false).
  @Column({ type: 'varchar', length: 50, nullable: true })
  fiscalNumber: string;
  // --------------------------

  // "total" = precio de contado de la factura (lo que costaría pagando
  // de una vez, con impuesto incluido, SIN interés de crédito).
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  // NUEVO: solo se llena cuando paymentMethod = CREDIT. Es el monto real
  // que terminará pagando el cliente (inicial + cuotas con interés ya
  // aplicado) — el mismo valor que AccountTransaction.totalAmount, pero
  // guardado también aquí para no tener que hacer JOIN al imprimir la
  // factura. Queda en NULL para ventas al contado.
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalWithCredit: number;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];

  @CreateDateColumn()
  createdAt: Date;

  // NUEVO: no existía. Necesario para saber si una venta se anuló después
  // de creada.
  @UpdateDateColumn()
  updatedAt: Date;
}
