import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { EmployeeLoan } from './employee-loan.entity';
import { PayrollDetail } from '../../payrolls/entities/payroll-detail.entity';

export enum EmployeeRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  COLLECTOR = 'COLLECTOR',
  DRIVER = 'DRIVER',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  branchId: string;

  @Column({ type: 'varchar', length: 150 })
  firstName: string;

  @Column({ type: 'varchar', length: 150 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  documentId: string;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.CASHIER,
    enumName: 'employees_role_enum',
  })
  role: EmployeeRole;

  @Column({ type: 'varchar', length: 100, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'varchar', length: 50, default: 'FIXED' })
  salaryType: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  baseSalary: number;

  @Column({ type: 'varchar', length: 50, default: 'QUINCENAL' })
  paymentFrequency: string;

  @Column({ type: 'varchar', length: 50, default: 'NONE' })
  transportType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  maintenanceAllowance: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccount: string;

  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.employee)
  vehicles: Vehicle[];

  @OneToMany(() => EmployeeLoan, (loan) => loan.employee)
  loans: EmployeeLoan[];

  @OneToMany(() => PayrollDetail, (detail) => detail.employee)
  payrollDetails: PayrollDetail[];
}