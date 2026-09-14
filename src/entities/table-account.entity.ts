import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AccountStatus {
  OPEN = 'OPEN',
  BILLED = 'BILLED',
  CANCELLED = 'CANCELLED',
}

@Entity('table_accounts')
export class TableAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  tableId: string;

  @Column({ type: 'uuid' })
  waiterId: string; // Relacionado con el Empleado / Mesero

  @Column({ type: 'int', default: 1 })
  guestCount: number;

  @Column({ type: 'jsonb', default: [] })
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }>;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  tipAmount: number; // Propina legal (ej. 10%)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  totalAmount: number;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.OPEN })
  status: AccountStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}