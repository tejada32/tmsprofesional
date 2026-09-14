// src/entities/tip-payout.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';
import { Employee } from './employee.entity';

@Entity('tip_payouts')
export class TipPayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid', nullable: true })
  branchId: string;

  @Column({ type: 'uuid', nullable: true })
  cashierEmployeeId: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'cashierEmployeeId' })
  cashier: Employee;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPaidAmount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}