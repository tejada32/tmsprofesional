// src/modules/trips/entities/route-stop.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Trip } from './trip.entity';

@Entity('route_stops')
export class RouteStop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id', type: 'uuid' })
  tripId: string;

  @ManyToOne(() => Trip, (trip) => trip.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'sequence_order', type: 'integer' })
  sequenceOrder: number;

  @Column({ name: 'third_party_id', type: 'uuid' })
  thirdPartyId: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ name: 'estimated_arrival', type: 'timestamp', nullable: true })
  estimatedArrival: Date;

  @Column({ name: 'actual_arrival', type: 'timestamp', nullable: true })
  actualArrival: Date;

  @Column({ type: 'varchar', length: 30, default: 'PENDING' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}