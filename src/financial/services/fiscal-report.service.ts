// src/services/fiscal-report.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectronicInvoice } from '../entities/electronic-invoice.entity';

@Injectable()
export class FiscalReportService {
  constructor(
    @InjectRepository(ElectronicInvoice)
    private ecfRepo: Repository<ElectronicInvoice>,
  ) {}

  // Resumen de ventas e-CF para el reporte mensual DGII (Formato 607 / e-CF Ledger)
  async generateMonthlyECFSummary(companyId: string, year: number, month: number) {
    const invoices = await this.ecfRepo.find({
      where: { companyId },
    });

    // Filtro básico por año y mes simulado
    const filtered = invoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      return invDate.getFullYear() === year && (invDate.getMonth() + 1) === month;
    });

    const totalSales = filtered.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const totalTax = filtered.reduce((acc, curr) => acc + Number(curr.taxAmount), 0);

    return {
      period: `${year}-${month.toString().padStart(2, '0')}`,
      totalInvoicesEmitted: filtered.length,
      totalSalesAmount: Number(totalSales.toFixed(2)),
      totalTaxAmount: Number(totalTax.toFixed(2)),
      invoices: filtered,
    };
  }

  // Simulación de enlace de exportación para WhatsApp / Email
  generateShareableDocumentLink(documentType: 'cotizacion' | 'factura', documentId: string) {
    // Genera una ruta web pública para previsualizar el documento en PDF o vista limpia
    const baseUrl = 'https://erp.latam-enterprise.com/share';
    return {
      documentType,
      documentId,
      whatsappUrl: `https://api.whatsapp.com/send?text=Hola,%20aqui%20tienes%20tu%20${documentType}:%20${baseUrl}/${documentType}/${documentId}`,
      emailPayloadMock: {
        subject: `Tu ${documentType.toUpperCase()} - Sistema Empresarial`,
        body: `Adjunto encontrarás el enlace de visualización de tu documento: ${baseUrl}/${documentType}/${documentId}`,
      },
    };
  }
}