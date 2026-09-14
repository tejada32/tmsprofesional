//src/fixed-assets/controllers/fixed-assets.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FixedAssetsService } from '../services/fixed-assets.service';
import { FixedAsset } from '../entities/fixed-asset.entity';

@Controller('fixed-assets')
export class FixedAssetsController {
  constructor(private readonly fixedAssetsService: FixedAssetsService) {}

  @Post()
  async create(@Body() body: Partial<FixedAsset>) {
    return this.fixedAssetsService.createAsset(body);
  }

  @Post('depreciation/run')
  async runDepreciation(@Body() body: { companyId: string; period: string }) {
    await this.fixedAssetsService.runMonthlyDepreciation(body.companyId, body.period);
    return { message: `Depreciación calculada con éxito para el periodo ${body.period}` };
  }

  @Get('summary')
  async getSummary(@Query('companyId') companyId: string) {
    return this.fixedAssetsService.getAssetSummary(companyId);
  }
}