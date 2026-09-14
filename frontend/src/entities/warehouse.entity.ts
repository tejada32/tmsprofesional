// src/entities/warehouse.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Company } from './company.entity';
import { Branch } from '../branches/entities/branch.entity';

@Entity('warehouses')
@Index(['companyId']) // acelera "dame los almacenes de esta empresa"
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  isVehicle: boolean; // Soporte para vehículos como almacén móvil (Plan Profesional / Enterprise)

  // NUEVO: para desactivar un almacén sin borrarlo (ya tiene historial de
  // movimientos/stock asociado, igual que hicimos con Client)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  branchId: string;

  @ManyToOne(() => Branch, (branch) => branch.warehouses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;

  // NUEVO: no las tenía, pero Branch y Product sí las tienen — para
  // consistencia y para poder auditar cuándo se creó/modificó un almacén
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
