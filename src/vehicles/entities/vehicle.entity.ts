// src/vehicles/entities/vehicle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid', nullable: true })
  employeeId: string;

  @Column({ type: 'varchar', length: 50, default: 'Motocicleta' })
  vehicleType: string;

  @Column({ type: 'varchar', length: 100 })
  brand: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;

  @Column({ type: 'varchar', length: 50 })
  plate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  registrationNumber: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  vin: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  engineNumber: string;

  @Column({ type: 'int', nullable: true })
  displacementCc: number;

  @Column({ type: 'varchar', length: 30, default: 'Gasolina' })
  fuelType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  loadCapacityKg: number;

  @Column({ type: 'varchar', length: 50, default: 'COMPANY' })
  ownershipType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insurancePolicyNumber: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiryDate: Date;

  @Column({ type: 'date', nullable: true })
  technicalReviewExpiryDate: Date;

  @Column({ type: 'varchar', length: 3, default: 'DO' })
  countryCode: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.vehicles, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}