// src/modules/repair.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RepairOrder } from '../entities/repair-order.entity';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';

import { RepairService } from '../services/repair.service';
import { RepairController } from '../controllers/repair.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RepairOrder,
      WarehouseInventory,
    ]),
  ],

  providers: [
    RepairService,
  ],

  controllers: [
    RepairController,
  ],

  exports: [
    RepairService,
  ],
})
export class RepairModule {}
