// src/services/credit-simulation.service.ts
import { Injectable } from '@nestjs/common';

export enum CreditMethod {
  EXACT_CENTAVOS = 'EXACT_CENTAVOS',       // Método 2: Cuotas idénticas con ajuste en la última (Estándar Bancario)
  ROUND_FIXED_QUOTA = 'ROUND_FIXED_QUOTA', // Método 1: Cuotas cerradas redondas y la última absorbe el resto
}

@Injectable()
export class CreditSimulationService {

  // 1. Método Estándar (Cuotas idénticas de 2 decimales + ajuste de centavos al final)
  private calculateExactCentavos(totalFinanced: number, termMonths: number) {
    let schedule = [];
    let rawInstallment = totalFinanced / termMonths;
    let standardInstallment = Math.round(rawInstallment * 100) / 100;
    let accumulatedPaid = 0;

    for (let i = 1; i <= termMonths; i++) {
      let currentInstallment = standardInstallment;

      if (i === termMonths) {
        currentInstallment = Number((totalFinanced - accumulatedPaid).toFixed(2));
      }

      accumulatedPaid += currentInstallment;

      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        installmentNumber: i,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: currentInstallment,
        status: 'PENDING',
      });
    }

    return {
      method: CreditMethod.EXACT_CENTAVOS,
      description: 'Cuotas iguales con ajuste de centavos en la última cuota',
      installments: schedule,
    };
  }

  // 2. Método de Cuotas Cerradas (Ej: Cuotas de $10 exactas y la última absorbe el resto)
  private calculateRoundQuota(totalFinanced: number, termMonths: number) {
    let schedule = [];
    // Redondeamos hacia abajo a la unidad o decena más cómoda para el cliente (ej. entero cercano)
    let baseQuota = Math.floor(totalFinanced / termMonths);
    if (baseQuota <= 0) baseQuota = 1; // Seguridad mínima
    
    let accumulatedPaid = 0;

    for (let i = 1; i <= termMonths; i++) {
      let currentInstallment = baseQuota;

      // Si es la última cuota, absorbe todo el remanente
      if (i === termMonths) {
        currentInstallment = Number((totalFinanced - accumulatedPaid).toFixed(2));
      }

      accumulatedPaid += currentInstallment;

      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        installmentNumber: i,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: currentInstallment,
        status: 'PENDING',
      });
    }

    return {
      method: CreditMethod.ROUND_FIXED_QUOTA,
      description: `Cuotas cerradas de base y última cuota ajustada con el residuo`,
      installments: schedule,
    };
  }

  // 3. Función unificada para simular ambos escenarios para que el cajero elija
  simulateCreditOptions(totalFinanced: number, termMonths: number) {
    return {
      totalFinanced,
      termMonths,
      optionA: this.calculateExactCentavos(totalFinanced, termMonths),
      optionB: this.calculateRoundQuota(totalFinanced, termMonths),
    };
  }
}