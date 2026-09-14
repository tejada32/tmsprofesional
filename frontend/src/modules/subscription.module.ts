// src/modules/subscription.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionController } from '../controllers/subscription.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
