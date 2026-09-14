// src/warehouses/Warehouses.Controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { ModulesGuard } from '../auth/guards/modules.guard';
import { RequireModule } from '../common/decorators/require-module.decorator';

@Controller('warehouses')
@UseGuards(ModulesGuard)
@RequireModule('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  create(@Body() createWarehouseDto: any, @Req() req) {
    const companyId = req.user.companyId;
    return this.warehousesService.create(createWarehouseDto, companyId);
  }

  @Get()
  findAll(@Req() req) {
    const companyId = req.user.companyId;
    return this.warehousesService.findAllByCompany(companyId);
  }
}