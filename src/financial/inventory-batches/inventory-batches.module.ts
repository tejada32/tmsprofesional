// src/inventory-batches/inventory-batches.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryBatchesService } from './inventory-batches.service';
import { InventoryBatchesController } from './inventory-batches.controller';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseInventory])],
  controllers: [InventoryBatchesController],
  providers: [InventoryBatchesService],
  exports: [InventoryBatchesService],
})
export class InventoryBatchesModule {}
