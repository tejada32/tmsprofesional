// src/modules/maintenance/maintenance.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { AssetEquipment } from './entities/asset-equipment.entity';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderPart } from './entities/work-order-part.entity';
import { MaintenanceSchedule } from './entities/maintenance-schedule.entity';
import { TireLog } from './entities/tire-log.entity';
import { Company } from '../../entities/company.entity';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Building,
      AssetEquipment,
      WorkOrder,
      WorkOrderPart,
      MaintenanceSchedule,
      TireLog,
      Company, // Necesaria para que ModulesGuard pueda validar el plan de la empresa
    ]),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}