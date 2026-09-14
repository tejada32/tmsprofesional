// src/entities/order-ticket.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from './company.entity';
import { Branch } from '../branches/entities/branch.entity';
import { RestaurantTable } from './restaurant-table.entity';
import { User } from './user.entity';

@Entity('order_tickets')
export class OrderTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId: string;

  @ManyToOne(() => Branch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ name: 'table_id', type: 'uuid', nullable: true })
  tableId: string;

  @ManyToOne(() => RestaurantTable, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'table_id' })
  table: RestaurantTable;

  @Column({ name: 'waiter_id', type: 'uuid' })
  waiterId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'waiter_id' })
  waiter: User;

  @Column({ type: 'varchar', length: 30, default: 'pending' }) // pending, preparing, ready, delivered, paid, cancelled
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'total_amount' })
  totalAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}