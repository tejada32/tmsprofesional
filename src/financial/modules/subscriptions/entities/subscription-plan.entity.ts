// src/modules/subscriptions/entities/subscription-plan.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Company } from '../../../entities/company.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  category: string; // Ej: Venta General, Servicios Profesionales

  @Column({ name: 'sub_category', type: 'varchar', nullable: true })
  subCategory: string; // Ej: Vendedor independiente, Abogados

  @Column({ type: 'varchar', unique: true, nullable: true })
  abbreviation: string; // Ej: VG1, SP03

  @Column({ name: 'plan_name', type: 'varchar', nullable: true })
  planName: string; // Ej: Plan A1, Plan F3
  
  get name(): string {
    return this.planName || '';
  }

  @Column({ name: 'price_usd', type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceUsd: number; // Ej: 10.00, 20.00
  
  @Column({ default: 0 })
  maxBranches: number;

  @Column({ default: 0 })
  maxWarehouses: number;

  // -1 = sin límite (misma convención que maxBranches/maxWarehouses,
  // ya usada en BranchesService/WarehousesService).
  @Column({ default: 0 })
  maxVehicles: number;

  @Column({ default: 0 })
  maxUsers: number;

  @Column('simple-array', { nullable: true })
  allowedModules: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Company, (company) => company.plan)
  companies: Company[];
}