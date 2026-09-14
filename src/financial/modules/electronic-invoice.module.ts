// src/modules/electronic-invoice.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectronicInvoice } from '../entities/electronic-invoice.entity';
import { ElectronicInvoicingService } from '../services/electronic-invoicing.service';
import { ElectronicInvoiceController } from '../controllers/electronic-invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ElectronicInvoice])],
  controllers: [ElectronicInvoiceController],
  providers: [ElectronicInvoicingService],
  exports: [ElectronicInvoicingService],
})
export class ElectronicInvoiceModule {}
