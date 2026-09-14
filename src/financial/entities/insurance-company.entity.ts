// src/entities/insurance-company.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('insurance_companies')
export class InsuranceCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string; // Ej: "Seguros Banreservas", "Mapfre BHD", etc.

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  taxId: string; // RNC / RUC de la aseguradora

  @Column({ type: 'varchar', length: 100, nullable: true })
  contactPhone: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}