// src/modules/sync.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../entities/sale.entity';
import { SyncService } from '../services/sync.service';
import { SyncController } from '../controllers/sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sale])],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
