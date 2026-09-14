// src/entities/warranty-claim.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DamageClassification {
  FACTORY_DEFECT = 'FACTORY_DEFECT',   // Defecto de Fábrica (Sin costo)
  TRANSPORT_DAMAGE = 'TRANSPORT_DAMAGE', // Daño por Transporte (Auditoría logística)
  CLIENT_MISUSE = 'CLIENT_MISUSE',     // Mal uso del cliente (Con costo)
}

export enum ClaimStatus {
  PENDING_AUDIT = 'PENDING_AUDIT',
  IN_REPAIR = 'IN_REPAIR',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

@Entity('warranty_claims')
export class WarrantyClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  saleId: string; // Venta asociada al producto

  @Column({ type: 'uuid' })
  productId: string; // Producto defectuoso

  @Column({ 
    type: 'enum', 
    enum: DamageClassification 
  })
  damageType: DamageClassification;

  @Column({ type: 'text' })
  diagnosticNotes: string; // Notas del técnico o auditor

  @Column({ 
    type: 'enum', 
    enum: ClaimStatus, 
    default: ClaimStatus.PENDING_AUDIT 
  })
  status: ClaimStatus;

  @Column({ type: 'boolean', default: false })
  isChargedToClient: boolean; // True si aplica cobro por mal uso

  @Column({ type: 'varchar', length: 100, nullable: true })
  auditedByDriverPlate: string; // Placa o nombre del chofer si fue daño de transporte

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}