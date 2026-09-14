// src/entities/company-config.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Entity('company_configs')
export class CompanyConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  companyId: string;

  @Column({ type: 'varchar', default: 'RETAIL' })
  businessType: string; // Ej: RETAIL, RESTAURANT, FINANCIAL, HYBRID
  
  @Column({ default: 15 }) // 5, 10, 15, 30, 60
  sessionTimeoutMinutes: number;

  @Column({ type: 'simple-array', default: '' })
  activeModules: string[]; // Ej: ['INVENTORY', 'LOANS', 'WORKSHOP']

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
