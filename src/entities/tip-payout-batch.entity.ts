import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tip_payout_batches')
export class TipPayoutBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  branchId: string;

  @Column({ type: 'uuid' })
  processedByUserId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalBatchAmount: number;

  @Column({ type: 'jsonb' })
  payoutDetails: Array<{
    employeeId: string;
    employeeName: string;
    amount: number;
    signatureReceived: boolean;
  }>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}