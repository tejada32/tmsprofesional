// src/modules/maintenance/entities/maintenance-schedule.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('maintenance_schedules')
export class MaintenanceSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'vehicle_id', type: 'uuid' })
  vehicleId: string;

  @Column({ name: 'service_name', type: 'varchar', length: 150 })
  serviceName: string; // Ej. Cambio de aceite, Cambio de pastillas de frenos

  @Column({ name: 'trigger_type', type: 'varchar', length: 20, default: 'MILEAGE' }) // MILEAGE, HOURS, DATE
  triggerType: string;

  @Column({ name: 'interval_value', type: 'integer' }) // Cada cuántos KM u Horas se realiza
  intervalValue: number;

  @Column({ name: 'last_service_value', type: 'integer', default: 0 }) // Kilometraje u horas en el último servicio
  lastServiceValue: number;

  @Column({ name: 'next_service_value', type: 'integer' }) // Kilometraje u horas en que toca el próximo servicio
  nextServiceValue: number;

  @Column({ type: 'varchar', length: 30, default: 'PENDING' }) // PENDING, DUE, OVERDUE, COMPLETED
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}