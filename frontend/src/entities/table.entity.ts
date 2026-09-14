// Renombrada de "RestaurantTable" a "DiningTable": había otra clase distinta
// también llamada "RestaurantTable" en restaurant-table.entity.ts (usada por
// el módulo RestaurantsModule/plural), y ambas coexistían con el mismo
// nombre de clase en el proyecto. Se agrega companyId para permitir el
// aislamiento multi-tenant (antes solo tenía branchId).
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TableStatus {
  FREE = 'FREE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
}

@Entity('dining_tables')
export class DiningTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 50 })
  name: string; // Ej: "Mesa 1", "Barra 3"

  @Column({ type: 'int', default: 4 })
  capacity: number;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.FREE })
  status: TableStatus;

  @Column({ type: 'uuid' })
  branchId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
