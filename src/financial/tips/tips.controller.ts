// src/tips/tips.controller.ts
import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { TipsService } from './tips.service';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Get('pending')
  getPendingTips(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.tipsService.getPendingTipsByEmployee(companyId);
  }

  @Post('payout')
  payoutTips(
    @Req() req: any,
    @Body() body: { employeeIds: string[]; cashierId: string },
  ) {
    const companyId = req.user.companyId;
    return this.tipsService.processCashPayout(companyId, body.employeeIds, body.cashierId);
  }
}
