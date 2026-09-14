import { Injectable } from '@nestjs/common';
import { Company } from '../../entities/company.entity'; // Ajusta la ruta relativa si es necesario

@Injectable()
export class TaxCalculatorService {
  calculateTax(subtotal: number, company: Company, productIsExempt: boolean = false): { taxAmount: number; total: number } {
    if (!company.useTax || productIsExempt) {
      return {
        taxAmount: 0,
        total: subtotal,
      };
    }

    const taxRate = company.taxRate ?? this.getDefaultRateByCountry(company.country);
    
    const taxAmount = Number((subtotal * (taxRate / 100)).toFixed(2));
    const total = Number((subtotal + taxAmount).toFixed(2));

    return {
      taxAmount,
      total,
    };
  }

  private getDefaultRateByCountry(countryCode: string): number {
    switch (countryCode?.toUpperCase()) {
      case 'DO':
        return 18.00;
      case 'CO':
      case 'CL':
      case 'AR':
        return 19.00;
      case 'MX':
        return 16.00;
      case 'PE':
        return 18.00;
      default:
        return 18.00;
    }
  }
}