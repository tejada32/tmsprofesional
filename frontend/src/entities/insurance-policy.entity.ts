// src/entities/insurance-policy.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from './company.entity';
import { Branch } from '../branches/entities/branch.entity';

@Entity('insurance_policies')
export class InsurancePolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'branch_id', type: 'uuid', nullable: true })
  branchId: string;

  @ManyToOne(() => Branch, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'varchar', length: 100, name: 'policy_number', unique: true })
  policyNumber: string;

  @Column({ type: 'varchar', length: 150, name: 'client_name' })
  clientName: string;

  @Column({ type: 'varchar', length: 100, name: 'insurance_company' }) // Aseguradora emisora
  insuranceCompany: string;

  @Column({ type: 'varchar', length: 50 }) // vehicle, personal, commercial
  category: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'premium_amount' })
  premiumAmount: number;

  @Column({ type: 'varchar', length: 30, default: 'active' }) // active, expired, cancelled, claimed
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}