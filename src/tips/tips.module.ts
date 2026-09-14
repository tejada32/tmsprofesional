// src/tips/tips.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tip } from '../entities/tip.entity';
import { TipPayout } from '../entities/tip-payout.entity';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tip, TipPayout])],
  controllers: [TipsController],
  providers: [TipsService],
  exports: [TipsService],
})
export class TipsModule {}
