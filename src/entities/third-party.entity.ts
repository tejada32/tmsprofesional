import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('third_parties')
export class ThirdParty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, enum: ['CUSTOMER', 'SUPPLIER'], default: 'CUSTOMER' })
  type: string; // CUSTOMER para clientes, SUPPLIER para proveedores

  @Column({ type: 'varchar', length: 50, nullable: true })
  taxId: string; // RNC o Cédula

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number; // Opcional para mapas

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number; // Opcional para mapas

  @Column({ type: 'text', nullable: true })
  googleMapsUrl: string; // Opcional, link directo

  @Column({ type: 'text', nullable: true })
  deliveryAddress: string; // Opcional, dirección detallada

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}