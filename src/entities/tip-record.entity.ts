import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipPaymentStatus {
  PENDING = 'PENDING',
  PAID_CASH = 'PAID_CASH',
  SENT_TO_PAYROLL = 'SENT_TO_PAYROLL'
}

@Entity('tip_records')
export class TipRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @Column({ type: 'uuid', nullable: true })
  tableAccountId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TipPaymentStatus, default: TipPaymentStatus.PENDING })
  status: TipPaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}