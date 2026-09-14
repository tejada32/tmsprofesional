// src/services/warranty-check.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class WarrantyCheckService {
  
  // Método para evaluar dinámicamente el estado de la garantía de un ítem vendido
  evaluateItemWarranty(saleDate: Date, warrantyDays: number) {
    if (!warrantyDays || warrantyDays === 0) {
      return { hasWarranty: false, statusText: 'Sin Garantía', daysRemaining: 0 };
    }

    const saleTime = new Date(saleDate).getTime();
    const expirationDate = new Date(saleTime + (warrantyDays * 24 * 60 * 60 * 1000));
    const now = new Date().getTime();
    
    const diffTime = expirationDate.getTime() - now;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isUnderWarranty = daysRemaining >= 0;

    return {
      hasWarranty: true,
      isUnderWarranty,
      expirationDate,
      daysRemaining: isUnderWarranty ? daysRemaining : 0,
      statusText: isUnderWarranty ? `En Garantía (${daysRemaining} días restantes)` : 'Garantía Finalizada',
    };
  }
}