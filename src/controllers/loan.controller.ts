// src/controllers/loan.controller.ts
import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { LoanSanService } from '../services/loan-san.service';
import { CreateSanLoanDto } from '../loans/dto/create-san-loan.dto';

@Controller('loans')
export class LoanController {
  constructor(private readonly loanSanService: LoanSanService) {}

  @Post('san')
  async createSanLoan(@Req() req, @Body() dto: CreateSanLoanDto) {
    const companyId = req.user?.companyId || '2d8e9c51-1f9f-4b0a-93ae-505ae1e7471e'; 

    return await this.loanSanService.createSanOrFixedLoan({
      companyId,
      clientId: dto.clientId,
      principalAmount: dto.principalAmount,
      totalPayable: dto.totalPayable,
      installmentsCount: dto.installmentsCount,
      installmentAmount: dto.installmentAmount,
    });
  }

  @Get()
  async getCompanyLoans(@Req() req) {
    const companyId = req.user?.companyId || '2d8e9c51-1f9f-4b0a-93ae-505ae1e7471e';
    
    const loans = await this.loanSanService.findAllByCompany(companyId);
    
    return {
      message: 'Préstamos recuperados exitosamente',
      total: loans.length,
      loans,
    };
  }
}