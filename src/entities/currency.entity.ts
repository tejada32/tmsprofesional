import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 3, unique: true })
  code: string; // Código ISO de la moneda, ej: 'USD', 'DOP', 'EUR'

  @Column({ type: 'varchar', length: 50 })
  name: string; // Nombre de la moneda, ej: 'Dólar Estadounidense', 'Peso Dominicano'

  @Column({ type: 'varchar', length: 10 })
  symbol: string; // Símbolo, ej: '$', 'RD€'

  @Column({ type: 'boolean', default: false })
  isBase: boolean; // Indica si es la moneda principal/base del sistema o empresa

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}