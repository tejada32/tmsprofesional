// src/entities/loan.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Company } from './company.entity';
import { Client } from './client.entity';
import { InstallmentFrequency } from './account-transaction.entity';

export enum LoanStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  DEFAULTED = 'DEFAULTED',
}

@Entity('loans')
@Index(['companyId']) // acelera "dame los préstamos de esta empresa"
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  // CORREGIDO: antes era un uuid suelto sin relación.
  @Column({ type: 'uuid' })
  clientId: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  principalAmount: number; // Monto inicial prestado

  // NUEVO: mismo patrón de "inicial" que en las ventas a crédito de tienda
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  downPayment: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  interestRate: number; // Porcentaje de interés calculado o asignado

  @Column({ type: 'int' })
  installmentsCount: number; // Cantidad de cuotas / plazos

  // NUEVO: no existía en ningún lado — sin esto, un préstamo no sabía si
  // se cobra semanal, quincenal o mensual.
  @Column({ type: 'enum', enum: InstallmentFrequency })
  installmentFrequency: InstallmentFrequency;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPayable: number; // Total a pagar acordado

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  status: LoanStatus; // Estado del préstamo

  // NUEVO: referencia al AccountTransaction donde vive el plan de pagos
  // real (se llena cuando el préstamo pasa de PENDING a ACTIVE).
  @Column({ type: 'uuid', nullable: true })
  accountTransactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
