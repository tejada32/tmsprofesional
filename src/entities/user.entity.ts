// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from './company.entity';


 @Entity('users')
 export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ nullable: true })
  subRole: string; // <-- Añadido para soportar perfiles híbridos como cajero-cobrador

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true })
  branchId: string;

  @Column({ default: false })
  mustChangePassword: boolean;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ default: true })
  isActive: boolean;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}