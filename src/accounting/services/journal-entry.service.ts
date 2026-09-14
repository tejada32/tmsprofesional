// src/accounting/services/journal-entry.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JournalEntry, JournalEntryStatus } from '../entities/journal-entry.entity';

@Injectable()
export class JournalEntryService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepository: Repository<JournalEntry>,
    private readonly dataSource: DataSource,
  ) {}

  async createEntry(data: {
    companyId: string;
    date: Date;
    reference?: string;
    description?: string;
    lines: { accountId: string; debit: number; credit: number; description?: string }[];
  }): Promise<JournalEntry> {
    const totalDebit = data.lines.reduce((sum, line) => sum + Number(line.debit), 0);
    const totalCredit = data.lines.reduce((sum, line) => sum + Number(line.credit), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(
        `El asiento contable no está balanceado. Total Débitos (${totalDebit.toFixed(2)}) difiere de Total Créditos (${totalCredit.toFixed(2)}).`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entry = this.journalEntryRepository.create({
        companyId: data.companyId,
        date: data.date,
        reference: data.reference,
        description: data.description,
        status: JournalEntryStatus.POSTED,
        lines: data.lines.map((l) => ({
          accountId: l.accountId,
          debit: l.debit,
          credit: l.credit,
          description: l.description,
        })),
      });

      const savedEntry = await queryRunner.manager.save(entry);
      await queryRunner.commitTransaction();
      return savedEntry;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}