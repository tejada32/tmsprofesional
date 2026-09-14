// src/entities/cashier-shift.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cashier_shifts')
export class CashierShift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  branchId: string;

  @Column({ type: 'uuid' })
  userId: string; // Cajero que abrió el turno

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  openingBalance: number; // Fondo de caja inicial

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  expectedBalance: number; // Monto calculado por el sistema al cerrar

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  closedBalance: number; // Monto contado físicamente en el arqueo

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  difference: number; // Diferencia (Sobrante o Faltante)

  @Column({ type: 'varchar', length: 20, default: 'OPEN' })
  status: 'OPEN' | 'CLOSED'; // Estado del turno

  @CreateDateColumn()
  openedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}