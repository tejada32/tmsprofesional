// src/modules/maintenance/maintenance.controller.ts
import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { ModulesGuard } from '../../auth/guards/modules.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('maintenance')
@UseGuards(ModulesGuard)
@RequireModule('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  // ===================== EDIFICIOS =====================

  @Post('buildings')
  createBuilding(@Req() req: any, @Body() dto: { name: string; address?: string; description?: string }) {
    return this.maintenanceService.createBuilding(req.user.companyId, dto);
  }

  @Get('buildings')
  findAllBuildings(@Req() req: any) {
    return this.maintenanceService.findAllBuildings(req.user.companyId);
  }

  // ===================== ACTIVOS / EQUIPOS =====================

  @Post('assets')
  createAsset(@Req() req: any, @Body() dto: { buildingId?: string; name: string; category: string; serialNumber?: string }) {
    return this.maintenanceService.createAsset(req.user.companyId, dto);
  }

  @Get('assets')
  findAllAssets(@Req() req: any, @Query('buildingId') buildingId?: string) {
    return this.maintenanceService.findAllAssets(req.user.companyId, buildingId);
  }

  @Patch('assets/:id/status')
  updateAssetStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.maintenanceService.updateAssetStatus(req.user.companyId, id, status);
  }

  // ===================== ÓRDENES DE TRABAJO =====================

  @Post('work-orders')
  createWorkOrder(
    @Req() req: any,
    @Body() dto: { branchId?: string; vehicleId?: string; targetType?: string; targetId?: string; type?: string; description?: string },
  ) {
    return this.maintenanceService.createWorkOrder(req.user.companyId, dto);
  }

  @Get('work-orders')
  findAllWorkOrders(@Req() req: any, @Query('status') status?: string) {
    return this.maintenanceService.findAllWorkOrders(req.user.companyId, status);
  }

  @Patch('work-orders/:id/status')
  updateWorkOrderStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.maintenanceService.updateWorkOrderStatus(req.user.companyId, id, status);
  }

  @Post('work-orders/:id/parts')
  addWorkOrderPart(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: { productId: string; quantity: number; unitCost: number },
  ) {
    return this.maintenanceService.addWorkOrderPart(req.user.companyId, id, dto);
  }

  // ===================== PROGRAMAS DE MANTENIMIENTO PREVENTIVO =====================

  @Post('schedules')
  createSchedule(
    @Req() req: any,
    @Body() dto: { vehicleId: string; serviceName: string; triggerType?: string; intervalValue: number; lastServiceValue?: number },
  ) {
    return this.maintenanceService.createSchedule(req.user.companyId, dto);
  }

  @Get('schedules')
  findAllSchedules(@Req() req: any, @Query('vehicleId') vehicleId?: string) {
    return this.maintenanceService.findAllSchedules(req.user.companyId, vehicleId);
  }

  @Patch('schedules/:id/complete')
  completeSchedule(@Req() req: any, @Param('id') id: string, @Body('serviceValueAtCompletion') serviceValueAtCompletion: number) {
    return this.maintenanceService.completeSchedule(req.user.companyId, id, serviceValueAtCompletion);
  }

  // ===================== BITÁCORA DE LLANTAS =====================

  @Post('tires')
  createTireLog(
    @Req() req: any,
    @Body() dto: { vehicleId?: string; serialNumber: string; position: string; installationDate?: string; installationMileage?: number },
  ) {
    return this.maintenanceService.createTireLog(req.user.companyId, dto);
  }

  @Get('tires')
  findAllTireLogs(@Req() req: any, @Query('vehicleId') vehicleId?: string) {
    return this.maintenanceService.findAllTireLogs(req.user.companyId, vehicleId);
  }

  @Patch('tires/:id/status')
  updateTireLogStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; currentDepthMm?: number },
  ) {
    return this.maintenanceService.updateTireLogStatus(req.user.companyId, id, body.status, body.currentDepthMm);
  }
}
