// src/entities/customer-portal-user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity'; // <--- Con comillas simples o dobles

@Entity('customer_portal_users')
export class CustomerPortalUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string; // Hasheada

  @OneToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @Column({ default: true })
  isActive: boolean;
}