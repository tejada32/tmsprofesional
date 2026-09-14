//entities/company.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SubscriptionPlan } from '../modules/subscriptions/entities/subscription-plan.entity';
import { User } from './user.entity';
import { CompanyConfig } from '../entities/company-config.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Client } from './client.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column({ type: 'varchar', length: 50, nullable: true })
  billingCycle: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  planType: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'base_plan_price' })
  basePlanPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'addons_price' })
  addonsPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'total_price' })
  totalPrice: number;

  @Column({ type: 'jsonb', nullable: true, name: 'active_addons' })
  activeAddons: string[]; // Ejemplo: ['maintenance']

  @Column({ nullable: true })
  businessType: string;
  
  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndsAt: Date;

  @Column({ nullable: true })
  subscriptionPlanId: string;
  
  @Column({ type: 'varchar', length: 100, default: 'República Dominicana' })
  country: string;

  @Column({ type: 'boolean', default: true })
  useTax: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 18.00 })
  taxRate: number;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.companies, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subscriptionPlanId' })
  plan: SubscriptionPlan;

  @OneToMany(() => Branch, (branch) => branch.company)
  branches: Branch[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Client, (client) => client.company)
  clients: Client[];

  @Column({ default: false })
  isSetupCompleted: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}