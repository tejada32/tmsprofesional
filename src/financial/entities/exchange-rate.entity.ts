import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Currency } from './currency.entity';
import { Company } from './company.entity';

@Entity('exchange_rates')
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  currencyId: string;

  @ManyToOne(() => Currency, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  rate: number; // Tasa de cambio respecto a la moneda base

  @Column({ type: 'date' })
  validDate: Date; // Fecha de aplicación de la tasa

  @CreateDateColumn()
  createdAt: Date;
}