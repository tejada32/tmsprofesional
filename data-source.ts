// data-source.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { WorkOrder } from './src/modules/maintenance/entities/work-order.entity';
import { WorkOrderPart } from './src/modules/maintenance/entities/work-order-part.entity';
import { MaintenanceSchedule } from './src/modules/maintenance/entities/maintenance-schedule.entity';
import { TireLog } from './src/modules/maintenance/entities/tire-log.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tms_profesional',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});