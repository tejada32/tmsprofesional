// src/entities/account-installment.entity.ts
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
import { AccountTransaction } from './account-transaction.entity';

// CORREGIDO: antes era un union type de TypeScript, ahora es un enum real.
export enum AccountInstallmentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

@Entity('account_installments')
@Index(['companyId']) // acelera "dame las cuotas de esta empresa"
export class AccountInstallment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // NUEVO: para consistencia con el resto del sistema (se puede derivar
  // via accountTransaction.companyId, pero tenerlo directo evita un JOIN
  // en cada consulta de "cuotas del día", que es una de las más usadas).
  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  accountTransactionId: string;

  @ManyToOne(() => AccountTransaction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountTransactionId' })
  accountTransaction: AccountTransaction;

  // Cuota 1 = el inicial, cuando el plan de pagos tiene uno (vencimiento
  // el mismo día de la venta/préstamo). El resto son las cuotas normales.
  @Column({ type: 'int' })
  installmentNumber: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'enum', enum: AccountInstallmentStatus, default: AccountInstallmentStatus.PENDING })
  status: AccountInstallmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
