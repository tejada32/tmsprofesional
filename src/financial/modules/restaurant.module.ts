import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiningTable } from '../entities/table.entity';
import { TableAccount } from '../entities/table-account.entity';
import { TipRecord } from '../entities/tip-record.entity';
import { TipPayoutBatch } from '../entities/tip-payout-batch.entity';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantController } from '../controllers/restaurant.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiningTable,
      TableAccount,
      TipRecord,
      TipPayoutBatch,
    ]),
  ],
  providers: [RestaurantService],
  controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}