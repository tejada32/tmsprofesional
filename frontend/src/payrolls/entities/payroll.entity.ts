// src/payrolls/entities/payroll.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PayrollDetail } from './payroll-detail.entity';

@Entity('payrolls')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 200 })
  periodName: string; // Ej: "Nómina Quincenal - Septiembre 2026 Q1"

  @Column({ type: 'varchar', length: 50, default: 'QUINCENAL' })
  periodType: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalGross: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalNet: number;

  @Column({ type: 'varchar', length: 50, default: 'DRAFT' })
  status: string; // DRAFT, APPROVED, PAID, CANCELLED

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PayrollDetail, (detail) => detail.payroll, { cascade: true })
  details: PayrollDetail[];
}