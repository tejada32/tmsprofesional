// src/financial/financial.controller.ts
import { Controller, Post, Body, Req, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialService } from './financial.service';
import { Client } from '../entities/client.entity';
import { AccountTransactionSourceType, InstallmentFrequency } from '../entities/account-transaction.entity';

@Controller('financial')
export class FinancialController {
  constructor(
    private readonly financialService: FinancialService,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  @Post('credits')
  async createCredit(
    @Req() req: any,
    @Body() body: {
      clientId: string;
      sourceType: AccountTransactionSourceType;
      sourceId: string;
      totalAmount: number;
      downPayment?: number;
      interestRate: number;
      installmentsCount: number;
      installmentFrequency: InstallmentFrequency;
      roundToWhole?: boolean;
      manualInstallments?: { installmentNumber: number; amount: number; dueDate: string }[];
    },
  ) {
    // companyId SIEMPRE del JWT, nunca del body.
    const companyId = req.user.companyId;

    // Verificamos que el cliente pertenezca a la empresa del token — si
    // solo confiáramos en companyId del token pero no en esto, alguien
    // podría crear un crédito válido para su empresa pero enganchado al
    // clientId de OTRA empresa.
    const client = await this.clientRepository.findOne({ where: { id: body.clientId, companyId } });
    if (!client) {
      throw new BadRequestException('Cliente no encontrado en su empresa');
    }

    return await this.financialService.createCreditAccount({
      ...body,
      companyId,
    });
  }
}