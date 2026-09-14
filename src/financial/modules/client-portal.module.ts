// src/modules/client-portal.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { Sale } from '../entities/sale.entity';
import { RepairOrder } from '../entities/repair-order.entity';
import { Warranty } from '../entities/warranty.entity';
import { ClientPortalService } from '../services/client-portal.service';
import { ClientPortalController } from '../controllers/client-portal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Sale, RepairOrder, Warranty]),
  ],
  controllers: [ClientPortalController],
  providers: [ClientPortalService],
  exports: [ClientPortalService],
})
export class ClientPortalModule {}
