// src/insurance/insurance.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceService } from './insurance.service';
import { InsuranceController } from './insurance.controller';
import { InsurancePolicy } from '../entities/insurance-policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InsurancePolicy])],
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}