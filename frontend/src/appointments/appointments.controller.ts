// src/appointments/appointments.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Req, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Req() req, @Body() dto: { branchId: string; employeeId: string; clientName: string; clientPhone?: string; startTime: string; endTime: string; notes?: string }) {
    const companyId = req.user.companyId;
    return await this.appointmentsService.create(companyId, dto.branchId, dto);
  }

  @Get()
  async findAll(@Req() req, @Query('branchId') branchId: string) {
    const companyId = req.user.companyId;
    return await this.appointmentsService.findAll(companyId, branchId);
  }

  @Patch(':id/status')
  async updateStatus(@Req() req, @Param('id') id: string, @Body('status') status: string) {
    const companyId = req.user.companyId;
    return await this.appointmentsService.updateStatus(id, status, companyId);
  }
}