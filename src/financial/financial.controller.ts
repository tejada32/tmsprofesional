// src/financial/financial.controller.ts
import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { FinancialService } from './financial.service';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('credits')
  async createCredit(@Body() body: any) {
    return await this.financialService.createCreditAccount(body);
  }
}