// src/controllers/client-portal.controller.ts
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ClientPortalService } from '../services/client-portal.service';

@Controller('portal/client')
export class ClientPortalController {
  constructor(private readonly clientPortalService: ClientPortalService) {}

  @Get(':clientId/profile')
  async getProfile(@Req() req: any, @Param('clientId') clientId: string) {
    const companyId = req.user.companyId;
    return await this.clientPortalService.getClientProfile(companyId, clientId);
  }

  @Get(':clientId/invoices')
  async getInvoices(@Req() req: any, @Param('clientId') clientId: string) {
    const companyId = req.user.companyId;
    return await this.clientPortalService.getClientInvoices(companyId, clientId);
  }

  @Get(':clientId/repairs')
  async getRepairs(@Req() req: any, @Param('clientId') clientId: string) {
    const companyId = req.user.companyId;
    return await this.clientPortalService.getClientRepairOrders(companyId, clientId);
  }

  @Get(':clientId/warranties')
  async getWarranties(@Req() req: any, @Param('clientId') clientId: string) {
    const companyId = req.user.companyId;
    return await this.clientPortalService.getClientWarranties(companyId, clientId);
  }
}
