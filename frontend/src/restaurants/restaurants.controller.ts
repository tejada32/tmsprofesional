// src/restaurants/restaurants.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Req, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post('tables')
  async createTable(@Req() req, @Body() dto: { tableNumber: string; capacity?: number; branchId: string }) {
    const companyId = req.user.companyId;
    return await this.restaurantsService.createTable(companyId, dto.branchId, dto);
  }

  @Get('tables')
  async findAllTables(@Req() req, @Query('branchId') branchId: string) {
    const companyId = req.user.companyId;
    return await this.restaurantsService.findAllTables(companyId, branchId);
  }

  @Patch('tables/:id/status')
  async updateTableStatus(@Req() req, @Param('id') id: string, @Body('status') status: string) {
    const companyId = req.user.companyId;
    return await this.restaurantsService.updateTableStatus(id, status, companyId);
  }

  @Post('tickets')
  async createTicket(@Req() req, @Body() dto: { branchId: string; tableId?: string; totalAmount?: number }) {
    const companyId = req.user.companyId;
    const waiterId = req.user.userId || req.user.id;
    return await this.restaurantsService.createTicket(companyId, dto.branchId, waiterId, dto);
  }

  @Get('tickets')
  async findAllTickets(@Req() req, @Query('branchId') branchId: string) {
    const companyId = req.user.companyId;
    return await this.restaurantsService.findAllTickets(companyId, branchId);
  }

  @Patch('tickets/:id/status')
  async updateTicketStatus(@Req() req, @Param('id') id: string, @Body('status') status: string) {
    const companyId = req.user.companyId;
    return await this.restaurantsService.updateTicketStatus(id, status, companyId);
  }
}