// src/modules/trips/entities/trip-manifest.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Trip } from './trip.entity';

@Entity('trip_manifests')
export class TripManifest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id', type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip, (trip) => trip.manifests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'tracking_number', type: 'varchar', length: 100 })
  trackingNumber: string;

  @Column({ name: 'weight_kg', type: 'numeric', precision: 10, scale: 2, default: 0 })
  weightKg: number;

  @Column({ name: 'volume_m3', type: 'numeric', precision: 10, scale: 2, default: 0 })
  volumeM3: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 30, default: 'LOADED' })
  status: string;
}