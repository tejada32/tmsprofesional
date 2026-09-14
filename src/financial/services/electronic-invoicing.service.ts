// src/services/electronic-invoicing.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectronicInvoice, ECFType } from '../entities/electronic-invoice.entity';

@Injectable()
export class ElectronicInvoicingService {
  constructor(
    @InjectRepository(ElectronicInvoice)
    private ecfRepo: Repository<ElectronicInvoice>,
  ) {}

  async generateECF(data: {
    companyId: string;
    saleId: string;
    ecfType: ECFType;
    amount: number;
    taxAmount: number;
  }) {
    // Generación de secuencia simulada de e-NCF (En producción se conecta al generador oficial de secuencias DGII)
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const eNCF = `E${data.ecfType}${randomSeq}`;

    const totalAmount = Number((data.amount + data.taxAmount).toFixed(2));

    const invoice = this.ecfRepo.create({
      companyId: data.companyId,
      saleId: data.saleId,
      eNCF,
      ecfType: data.ecfType,
      amount: data.amount,
      taxAmount: data.taxAmount,
      totalAmount,
      dgiiStatus: 'PENDING_APPROVAL',
    });

    return await this.ecfRepo.save(invoice);
  }
}