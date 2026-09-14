// src/insurance/insurance.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Req } from '@nestjs/common';
import { InsuranceService } from './insurance.service';

@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post('policies')
  async createPolicy(@Req() req, @Body() dto: { branchId?: string; policyNumber: string; clientName: string; insuranceCompany: string; category: string; startDate: string; endDate: string; premiumAmount: number }) {
    const companyId = req.user.companyId;
    return await this.insuranceService.createPolicy(companyId, dto);
  }

  @Get('policies')
  async findAllPolicies(@Req() req) {
    const companyId = req.user.companyId;
    return await this.insuranceService.findAllPolicies(companyId);
  }

  @Patch('policies/:id/status')
  async updatePolicyStatus(@Req() req, @Param('id') id: string, @Body('status') status: string) {
    const companyId = req.user.companyId;
    return await this.insuranceService.updatePolicyStatus(id, status, companyId);
  }
}