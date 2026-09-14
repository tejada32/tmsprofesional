// src/controllers/credit.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreditSimulationService } from '../services/credit-simulation.service';

@Controller('credits')
export class CreditController {
  constructor(private readonly creditSimulationService: CreditSimulationService) {}

  // Endpoint para que el empleado simule y elija el método de cuotas
  @Post('simulate')
  async simulateCredit(
    @Body('totalFinanced') totalFinanced: number,
    @Body('termMonths') termMonths: number,
  ) {
    return this.creditSimulationService.simulateCreditOptions(totalFinanced, termMonths);
  }
}