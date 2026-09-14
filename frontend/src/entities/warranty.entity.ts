// src/entities/warranty.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',       // Garantía vigente
  CLAIMED = 'CLAIMED',     // Reclamada / En proceso de revisión
  RESOLVED = 'RESOLVED',   // Resuelta (Reparado / Sustituido / Nota de crédito)
  EXPIRED = 'EXPIRED',     // Garantía vencida
  REJECTED = 'REJECTED',   // Rechazada (Mal uso o daño físico)
}

@Entity('warranties')
export class Warranty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  branchId: string;

  @Column({ type: 'uuid' })
  clientId: string; // Cliente dueño del producto en garantía

  @Column({ type: 'uuid' })
  saleId: string; // Venta asociada

  @Column({ type: 'varchar', length: 150 })
  productName: string; // Nombre o descripción del artículo cubierto

  @Column({ type: 'varchar', length: 100, nullable: true })
  serialNumberOrMac: string; // Número de serie o MAC asociada

  @Column({ type: 'timestamp' })
  expirationDate: Date; // Fecha límite de cobertura

  @Column({ 
    type: 'enum', 
    enum: WarrantyStatus, 
    default: WarrantyStatus.ACTIVE 
  })
  status: WarrantyStatus;

  @Column({ type: 'text', nullable: true })
  claimReason: string; // Motivo de la reclamación en caso de fallo

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}