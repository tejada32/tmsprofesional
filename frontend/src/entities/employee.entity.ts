// src/entities/employee.entity.ts
//
// FUSIONADO: existían 2 versiones incompatibles de Employee en el
// proyecto. Se usó como base la que realmente estaba activa (la de
// comisiones — confirmado porque Vehicle/EmployeeLoan/PayrollDetail no
// estaban registradas en app.module.ts, así que la otra versión nunca
// pudo haber compilado), y se le agregaron los campos útiles de nómina
// de la otra versión que no generan conflicto.
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
import { User } from './user.entity';
import { Branch } from '../branches/entities/branch.entity';

// Enum combinado: los 4 roles originales de comisiones (VENDOR, COLLECTOR,
// CASHIER, TECHNICIAN) + los 2 que solo existían en la otra versión
// (ADMIN, DRIVER).
export enum EmployeeRole {
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  COLLECTOR = 'COLLECTOR',
  CASHIER = 'CASHIER',
  TECHNICIAN = 'TECHNICIAN',
  DRIVER = 'DRIVER',
}

export enum TechnicalCommissionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum EmployeeSalaryType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
}

export enum EmployeePaymentFrequency {
  SEMANAL = 'SEMANAL',
  QUINCENAL = 'QUINCENAL',
  MENSUAL = 'MENSUAL',
}

@Entity('employees')
@Index(['companyId']) // acelera "dame los empleados de esta empresa"
@Index(['companyId', 'documentId'], { unique: true, where: '"documentId" IS NOT NULL' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  // NUEVO (de la versión B): sucursal donde trabaja, opcional porque no
  // todo negocio organiza empleados por sucursal.
  @Column({ type: 'uuid', nullable: true })
  branchId: string;

  @ManyToOne(() => Branch, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  // NUEVO (de la versión B): cédula/documento de identidad del empleado.
  // Único por empresa, no global (dos empresas distintas podrían
  // eventualmente tener referencias al mismo documento sin que sea un
  // conflicto real entre ellas).
  @Column({ type: 'varchar', length: 50, nullable: true })
  documentId: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
  })
  role: EmployeeRole;

  // NUEVO (de la versión B): cargo/puesto descriptivo, independiente del
  // "role" técnico que usa la lógica de comisiones.
  @Column({ type: 'varchar', length: 100, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  baseSalary: number;

  // NUEVO (de la versión B, convertido a enum)
  @Column({ type: 'enum', enum: EmployeeSalaryType, default: EmployeeSalaryType.FIXED })
  salaryType: EmployeeSalaryType;

  // NUEVO (de la versión B, convertido a enum)
  @Column({ type: 'enum', enum: EmployeePaymentFrequency, default: EmployeePaymentFrequency.QUINCENAL })
  paymentFrequency: EmployeePaymentFrequency;

  // NUEVO (de la versión B): datos bancarios para depósito de nómina
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccount: string;

  // NUEVO (de la versión B)
  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  // --- Comisiones (ya existían, sin cambios) ---
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  salesCommissionRate: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  collectionCommissionRate: number;

  @Column({
    type: 'enum',
    enum: TechnicalCommissionType,
    default: TechnicalCommissionType.PERCENTAGE,
  })
  technicalCommissionType: TechnicalCommissionType;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  technicalCommissionValue: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
