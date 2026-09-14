// src/entities/user-session-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_session_logs')
export class UserSessionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  companyId: string;

  @Column()
  connectionType: string; // 'browser', 'pc_app', 'android_app'

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  connectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  disconnectedAt: Date;

  @Column({ default: 'ACTIVE' })
  status: string; // 'ACTIVE', 'LOGGED_OUT', 'EXPIRED'
}