// src/modules/credit.module.ts
import { Module } from '@nestjs/common';
import { CreditSimulationService } from '../services/credit-simulation.service';
import { CreditController } from '../controllers/credit.controller';

@Module({
  controllers: [CreditController],
  providers: [CreditSimulationService],
  exports: [CreditSimulationService],
})
export class CreditModule {}
