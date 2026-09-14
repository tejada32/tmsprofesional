// src/payrolls/entities/payroll-detail.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Payroll } from './payroll.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('payroll_details')
export class PayrollDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  payrollId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  baseSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  commissionsTotal: number; // Comisiones por ventas o cobros calculadas

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  overtimeAmount: number; // Horas extras

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bonuses: number; // Bonificaciones adicionales

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  maintenanceAllowance: number; // Subsidio de motor (si aplica)

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  grossSalary: number; // Total devengado

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  legalDeductions: number; // Deducciones de ley (AFP, SFS, etc.)

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  loanDeductions: number; // Descuento de préstamos internos

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  otherDeductions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  netSalary: number; // Total neto a pagar

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Payroll, (payroll) => payroll.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payrollId' })
  payroll: Payroll;

  @ManyToOne(() => Employee, (employee) => employee.payrollDetails, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}