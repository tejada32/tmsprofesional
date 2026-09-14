// src/entities/account-transaction.entity.ts
//
// Registro general de cuentas por cobrar (a clientes) y por pagar (a
// proveedores). Es el punto de encuentro entre Ventas a crédito, el
// negocio de Préstamos, y (a futuro) Compras — todos generan un registro
// aquí, con su plan de pagos en AccountInstallment.
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
import { Client } from './client.entity';

export enum AccountTransactionType {
  RECEIVABLE = 'RECEIVABLE', // por cobrar (cliente)
  PAYABLE = 'PAYABLE', // por pagar (proveedor)
}

export enum AccountTransactionStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

// De qué operación de negocio salió esta deuda. Se usa junto con
// "sourceId" para poder rastrear el origen exacto (la venta o el
// préstamo específico que la generó).
export enum AccountTransactionSourceType {
  SALE = 'SALE',
  LOAN = 'LOAN',
  PURCHASE = 'PURCHASE',
}

// Compartido con Loan — la frecuencia de cobro/pago de las cuotas.
export enum InstallmentFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

@Entity('account_transactions')
@Index(['companyId']) // acelera "dame las cuentas por cobrar/pagar de esta empresa"
@Index(['sourceType', 'sourceId']) // acelera "dame la cuenta que generó esta venta/préstamo"
export class AccountTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NUEVO: no existía. Grave en un sistema multi-tenant — sin esto no
  // hay forma segura de aislar las cuentas de una empresa de las de otra.
  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'enum', enum: AccountTransactionType })
  type: AccountTransactionType;

  // NUEVO: de dónde salió esta deuda
  @Column({ type: 'enum', enum: AccountTransactionSourceType })
  sourceType: AccountTransactionSourceType;

  @Column({ type: 'uuid' })
  sourceId: string; // el id de la Sale o el Loan que la generó

  // CORREGIDO: antes era "thirdPartyId" genérico sin decir qué tipo de
  // entidad era. Ahora es explícito: clientId para RECEIVABLE (el caso
  // de uso real hoy). supplierId queda listo para cuando Compras esté
  // conectada (ver nota más abajo).
  @Column({ type: 'uuid', nullable: true })
  clientId: string;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  // Sin relación @ManyToOne todavía: Supplier no está registrada en
  // app.module.ts. Cuando conectes Compras, se agrega la relación real.
  @Column({ type: 'uuid', nullable: true })
  supplierId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: number;

  // NUEVO: cuánto fue el inicial (si aplica). El inicial también existe
  // como la cuota #1 dentro de AccountInstallment — este campo es solo
  // para reportes rápidos sin tener que ir a buscar la cuota.
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  downPayment: number;

  // NUEVO: % aplicado sobre el monto financiado (después del inicial).
  // Nullable porque no toda deuda lleva interés (ej. una cuenta por pagar
  // a proveedor a 30 días sin recargo).
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  interestRate: number;

  // NUEVO: no existía en ningún lado del sistema de crédito.
  @Column({ type: 'enum', enum: InstallmentFrequency, nullable: true })
  installmentFrequency: InstallmentFrequency;

  // CORREGIDO: antes era un union type de TypeScript (`'PENDING' | ...`),
  // que no se traduce a una restricción real en la base de datos. Ahora
  // es un enum de Postgres de verdad.
  @Column({ type: 'enum', enum: AccountTransactionStatus, default: AccountTransactionStatus.PENDING })
  status: AccountTransactionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
