// src/entities/electronic-invoice.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ECFType {
  CREDIT_FISCAL = '31',          // e-CF de Crédito Fiscal
  CONSUMIDOR_FINAL = '32',       // e-CF de Consumidor Final
  NOTA_CREDITO = '33',           // e-CF de Nota de Crédito
  NOTA_DEBITO = '34',            // e-CF de Nota de Débito
  COMPRAS = '41',                // e-CF de Compras
  GASTOS_MENORES = '43',         // e-CF de Gastos Menores
  EXPORTACIONES = '44',          // e-CF de Exportaciones
}

@Entity('electronic_invoices')
export class ElectronicInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  saleId: string; // Relación con la venta general del POS

  @Column({ type: 'varchar', length: 13 })
  eNCF: string; // Secuencia del Comprobante Fiscal Electrónico (Ej: E310000000001)

  @Column({ type: 'enum', enum: ECFType })
  ecfType: ECFType; // Tipo de comprobante e-CF

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  taxAmount: number; // ITBIS (Ej: 18%)

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  digitalSignature: string; // Sello o firma digital DGII

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  trackId: string; // TrackId devuelto por el Web Service de la DGII al enviar el documento

  @Column({ type: 'varchar', default: 'PENDING_APPROVAL' })
  dgiiStatus: 'PENDING_APPROVAL' | 'ACCEPTED' | 'REJECTED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}