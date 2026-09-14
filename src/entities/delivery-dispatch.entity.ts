// src/entities/delivery-dispatch.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sale } from './sale.entity';

export enum DeliveryStatus {
  PENDING = 'PENDING',             // Esperando en almacén
  READY_FOR_DISPATCH = 'READY',    // Listo para salir
  IN_TRANSIT = 'IN_TRANSIT',       // En ruta
  DELIVERED = 'DELIVERED',         // Entregado
  INSTALLED = 'INSTALLED',         // Entregado y armado
  RETURNED = 'RETURNED'            // Devuelto por el cliente
}

@Entity('delivery_dispatches')
export class DeliveryDispatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'uuid' })
  saleId: string;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'saleId' })
  sale: Sale;

  @Column({ type: 'varchar' })
  deliveryAddress: string;

  @Column({ type: 'varchar', nullable: true })
  driverName: string; // Chofer o repartidor asignado

  @Column({ type: 'varchar', nullable: true })
  vehiclePlate: string; // Placa o identificador del vehículo

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  freightCost: number; // Costo del flete

  @Column({ type: 'boolean', default: false })
  isFreightChargedToClient: boolean; // ¿El cliente asume el costo del flete?

  @Column({ type: 'text', nullable: true })
  deliveryNotes: string; // Notas adicionales (ej: "llamar antes de llegar", "armar en sala")

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}