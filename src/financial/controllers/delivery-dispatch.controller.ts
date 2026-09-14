// src/controllers/delivery-dispatch.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Req } from '@nestjs/common';
import { DeliveryDispatchService } from '../services/delivery-dispatch.service';
import { DeliveryStatus } from '../entities/delivery-dispatch.entity';

// Requiere JWT válido: cubierto por el guard global (APP_GUARD) en AppModule.
@Controller('delivery-dispatches')
export class DeliveryDispatchController {
  constructor(private readonly dispatchService: DeliveryDispatchService) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { saleId: string; deliveryAddress: string; freightCost: number; isCharged: boolean },
  ) {
    const companyId = req.user.companyId;
    return await this.dispatchService.create(
      companyId,
      body.saleId,
      body.deliveryAddress,
      body.freightCost,
      body.isCharged,
    );
  }

  @Get('pending')
  async getPendingDeliveries(@Req() req: any) {
    const companyId = req.user.companyId;
    return await this.dispatchService.getPendingDeliveries(companyId);
  }

  @Patch(':id/assign')
  async assignRoute(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { driverName: string; vehiclePlate: string },
  ) {
    const companyId = req.user.companyId;
    return await this.dispatchService.assignRoute(companyId, id, body.driverName, body.vehiclePlate);
  }

  @Patch(':id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: DeliveryStatus },
  ) {
    const companyId = req.user.companyId;
    return await this.dispatchService.updateStatus(companyId, id, body.status);
  }
}
