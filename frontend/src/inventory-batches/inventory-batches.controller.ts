// src/inventory-batches/inventory-batches.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Req, Query } from '@nestjs/common';
import { InventoryBatchesService } from './inventory-batches.service';

@Controller('inventory-batches')
export class InventoryBatchesController {
  constructor(private readonly batchesService: InventoryBatchesService) {}

  @Post()
  async createBatch(@Req() req, @Body() dto: { warehouseId: string; productId: string; batchNumber: string; expirationDate: string; quantity: number; warehouseLocationId?: string }) {
    const companyId = req.user.companyId;
    return await this.batchesService.createBatch(companyId, dto.warehouseId, dto);
  }

  @Get('product/:productId')
  async findBatchesByProduct(@Req() req, @Param('productId') productId: string) {
    const companyId = req.user.companyId;
    return await this.batchesService.findBatchesByProduct(companyId, productId);
  }

  @Patch(':id/quantity')
  async updateStock(@Req() req, @Param('id') id: string, @Body('quantity') quantity: number) {
    const companyId = req.user.companyId;
    return await this.batchesService.updateStock(id, quantity, companyId);
  }
}
