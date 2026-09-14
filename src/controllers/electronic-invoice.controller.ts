// src/controllers/electronic-invoice.controller.ts
import { Controller, Post, Body, Req, BadRequestException } from '@nestjs/common';
import { ElectronicInvoicingService } from '../services/electronic-invoicing.service';
import { ECFType } from '../entities/electronic-invoice.entity';

@Controller('electronic-invoicing')
export class ElectronicInvoiceController {
  constructor(private readonly ecfService: ElectronicInvoicingService) {}

  @Post('emit')
  async emitInvoice(
    @Req() req: any,
    @Body('saleId') saleId: string,
    @Body('ecfType') ecfType: ECFType,
    @Body('amount') amount: number,
    @Body('isFormalTaxPayer') isFormalTaxPayer: boolean, // Define si aplica ITBIS o no
  ) {
    // companyId SIEMPRE del JWT, nunca del body.
    const companyId = req.user.companyId;

    if (!saleId || !amount) {
      throw new BadRequestException('Faltan datos obligatorios para emitir el e-CF');
    }

    // Si la compañía es formal con impuestos, calcula el ITBIS (ej: 18% en República Dominicana)
    // Si es informal o exenta, el impuesto es 0.
    const taxRate = isFormalTaxPayer ? 0.18 : 0.0;
    const taxAmount = Number((amount * taxRate).toFixed(2));

    return await this.ecfService.generateECF({
      companyId,
      saleId,
      ecfType,
      amount,
      taxAmount,
    });
  }
}
