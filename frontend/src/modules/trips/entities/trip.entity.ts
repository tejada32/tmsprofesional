// src/modules/trips/entities/trip.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RouteStop } from './route-stop.entity';
import { TripManifest } from './trip-manifest.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId: string;

  @Column({ name: 'vehicle_id', type: 'uuid' })
  vehicleId: string;

  @Column({ name: 'driver_id', type: 'uuid' })
  driverId: string;

  @Column({ type: 'varchar', length: 30, default: 'PLANNED' })
  status: string;

  @Column({ name: 'departure_date', type: 'timestamp', nullable: true })
  departureDate: Date;

  @Column({ name: 'arrival_date', type: 'timestamp', nullable: true })
  arrivalDate: Date;

  @Column({ name: 'total_distance_km', type: 'numeric', precision: 10, scale: 2, default: 0 })
  totalDistanceKm: number;

  @Column({ name: 'fuel_consumed', type: 'numeric', precision: 10, scale: 2, default: 0 })
  fuelConsumed: number;

  @OneToMany(() => RouteStop, (stop) => stop.trip, { cascade: true })
  stops: RouteStop[];

  @OneToMany(() => TripManifest, (manifest) => manifest.trip, { cascade: true })
  manifests: TripManifest[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}