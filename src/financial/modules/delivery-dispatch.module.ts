// src/modules/delivery-dispatch.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryDispatch } from '../entities/delivery-dispatch.entity';
import { DeliveryDispatchService } from '../services/delivery-dispatch.service';
import { DeliveryDispatchController } from '../controllers/delivery-dispatch.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryDispatch])],
  controllers: [DeliveryDispatchController],
  providers: [DeliveryDispatchService],
  exports: [DeliveryDispatchService],
})
export class DeliveryDispatchModule {}
