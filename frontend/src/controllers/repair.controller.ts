// src/controllers/repair.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { RepairService } from '../services/repair.service';
import { RepairStatus } from '../entities/repair-order.entity';

@Controller('repairs')
export class RepairController {
  constructor(private readonly repairService: RepairService) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() data: {
      branchId?: string;
      clientId: string;
      technicianId?: string;
      deviceModel: string;
      serialNumberOrMac?: string;
      problemDescription: string;
      aestheticCondition?: string;
      estimatedCost?: number;
    },
  ) {
    // companyId SIEMPRE del JWT, nunca del body.
    const companyId = req.user.companyId;
    return await this.repairService.create({ ...data, companyId });
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: RepairStatus; technicalDiagnosis?: string; technicianId?: string },
  ) {
    const companyId = req.user.companyId;
    return await this.repairService.updateRepairStatus(
      id,
      companyId,
      body.status,
      body.technicalDiagnosis,
      body.technicianId,
    );
  }

  @Patch(':id/parts')
  async addParts(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { warehouseId: string; parts: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>; finalCost: number },
  ) {
    const companyId = req.user.companyId;
    return await this.repairService.addPartsAndLabor(
      id,
      companyId,
      body.warehouseId,
      body.parts,
      body.finalCost,
    );
  }

  @Get()
  async getOrders(@Req() req: any, @Query('status') status?: RepairStatus) {
    const companyId = req.user.companyId;
    return await this.repairService.getOrdersByStatus(companyId, status);
  }
}
