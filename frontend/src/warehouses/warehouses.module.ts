import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import { Warehouse } from '../entities/warehouse.entity';
import { Company } from '../entities/company.entity';
import { WarehouseLocation } from '../entities/warehouse-location.entity';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      Company,
      WarehouseLocation,
      WarehouseInventory,
    ]),
  ],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
