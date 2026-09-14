// src/accounting/accounting.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import { JournalEntryService } from './services/journal-entry.service';
import { AccountSeedingService } from './services/account-seeding.service';
import { AccountingController } from './controllers/accounting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, JournalEntry, JournalEntryLine])],
  controllers: [AccountingController],
  providers: [JournalEntryService, AccountSeedingService],
  exports: [JournalEntryService, AccountSeedingService],
})
export class AccountingModule {}