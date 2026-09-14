// src/companies/company.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompanyController } from './company.controller';
import { Company } from '../entities/company.entity';
import { CompanyConfig } from '../entities/company-config.entity';
import { SubscriptionPlan } from '../modules/subscriptions/entities/subscription-plan.entity';
import { Client } from '../entities/client.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      CompanyConfig,
      SubscriptionPlan,
      Client,
    ]),
    UserModule,
  ],
  controllers: [CompanyController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
