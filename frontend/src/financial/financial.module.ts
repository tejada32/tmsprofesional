import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { AccountTransaction } from '../entities/account-transaction.entity';
import { AccountInstallment } from '../entities/account-installment.entity';
import { Client } from '../entities/client.entity';
import { ClientController } from '../clients/client.controller'; // Ajusta la ruta exacta según donde guardaste el archivo
import { ClientService } from '../clients/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, AccountTransaction, AccountInstallment])],
  providers: [FinancialService, ClientService],
  controllers: [FinancialController, ClientController],
  exports: [FinancialService],
})
export class FinancialModule {}
