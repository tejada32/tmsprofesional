// src/entities/tip.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';
import { Employee } from './employee.entity';

export enum TipStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

@Entity('tips')
export class Tip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid', nullable: true })
  branchId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'uuid', nullable: true })
  orderReferenceId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50, default: 'CASH' })
  paymentMethod: string;

  @Column({
    type: 'enum',
    enum: TipStatus,
    default: TipStatus.PENDING,
  })
  status: TipStatus;

  @Column({ type: 'uuid', nullable: true })
  payoutId: string;

  @CreateDateColumn()
  createdAt: Date;
}