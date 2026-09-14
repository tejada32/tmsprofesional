import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('trial_logs')
export class TrialLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ipAddress: string;

  @Column()
  deviceUuid: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}