import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FinancingSource {
  INTERNAL = 'INTERNAL',
  BANK = 'BANK',
  COOPERATIVE = 'COOPERATIVE',
}

@Entity('credits')
export class Credit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: FinancingSource, default: FinancingSource.INTERNAL })
  financingSource: FinancingSource;

  @Column({ nullable: true })
  financingInstitutionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}