// src/employees/entities/employee-loan.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('employee_loans')
export class EmployeeLoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  balance: number; // Saldo pendiente

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  installmentAmount: number; // Cuota a descontar por período de nómina

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status: string; // ACTIVE, PAID, CANCELLED

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.loans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}