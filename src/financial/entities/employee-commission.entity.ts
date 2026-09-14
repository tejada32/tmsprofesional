// src/entities/employee-commission.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import {
  Employee,
  TechnicalCommissionType,
} from './employee.entity';

import { Company } from './company.entity';

export enum EmployeeCommissionType {
  SALE = 'SALE',
  COLLECTION = 'COLLECTION',
  TECHNICAL = 'TECHNICAL',
}

export enum EmployeeCommissionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

@Entity('employee_commissions')
export class EmployeeCommission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // =========================================================
  // EMPRESA
  // =========================================================

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  // =========================================================
  // EMPLEADO
  // =========================================================

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  // =========================================================
  // TIPO DE COMISIÓN
  // =========================================================

  @Column({
    type: 'enum',
    enum: EmployeeCommissionType,
  })
  type: EmployeeCommissionType;

  // =========================================================
  // MODALIDAD DE COMISIÓN
  //
  // Para SALE y COLLECTION será PERCENTAGE.
  // Para TECHNICAL puede ser PERCENTAGE o FIXED.
  // =========================================================

  @Column({
    type: 'enum',
    enum: TechnicalCommissionType,
    default: TechnicalCommissionType.PERCENTAGE,
  })
  commissionType: TechnicalCommissionType;

  // =========================================================
  // REFERENCIA
  // Puede ser ID de venta, cuota, reparación, etc.
  // =========================================================

  @Column({ type: 'uuid', nullable: true })
  referenceId: string | null;

  // =========================================================
  // MONTO BASE
  // =========================================================

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  baseAmount: number;

  // =========================================================
  // VALOR DE LA TASA O MONTO FIJO APLICADO
  //
  // Ejemplo:
  // 5.00  -> 5%
  // 750.00 -> RD$750 fijo
  // =========================================================

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  rateApplied: number;

  // =========================================================
  // COMISIÓN GENERADA
  // =========================================================

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  commissionAmount: number;

  // =========================================================
  // ESTADO
  // =========================================================

  @Column({
    type: 'enum',
    enum: EmployeeCommissionStatus,
    default: EmployeeCommissionStatus.PENDING,
  })
  status: EmployeeCommissionStatus;

  // =========================================================
  // FECHA
  // =========================================================

  @CreateDateColumn()
  createdAt: Date;
}