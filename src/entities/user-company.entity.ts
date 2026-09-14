import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity('user_companies')
export class UserCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Company, (company) => company.id)
  company: Company;

  @Column({ type: 'varchar', default: 'admin' })
  role: string; // 'admin', 'vendedor', 'contador'
}