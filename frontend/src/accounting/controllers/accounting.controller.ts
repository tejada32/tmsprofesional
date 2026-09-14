//src/accounting/controllers/accounting.controller.ts
import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { JournalEntryService } from '../services/journal-entry.service';
import { AccountSeedingService } from '../services/account-seeding.service';
import { DataSource } from 'typeorm';

@Controller('accounting')
export class AccountingController {
  constructor(
    private readonly journalEntryService: JournalEntryService,
    private readonly accountSeedingService: AccountSeedingService,
    private readonly dataSource: DataSource,
  ) {}

  @Post('entries')
  async createEntry(
    @Req() req: any,
    @Body() body: {
      date: string;
      reference?: string;
      description?: string;
      lines: { accountId: string; debit: number; credit: number; description?: string }[];
    },
  ) {
    // companyId SIEMPRE del JWT, nunca del body.
    const companyId = req.user.companyId;
    return this.journalEntryService.createEntry({
      companyId,
      date: new Date(body.date),
      reference: body.reference,
      description: body.description,
      lines: body.lines,
    });
  }

  @Get('trial-balance')
  async getTrialBalance(
    @Req() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const companyId = req.user.companyId;
    return this.dataSource.query(
      `
      SELECT 
        a.code,
        a.name,
        a.type,
        COALESCE(SUM(jel.debit), 0) AS total_debit,
        COALESCE(SUM(jel.credit), 0) AS total_credit,
        CASE 
          WHEN a.type IN ('ASSET', 'EXPENSE') THEN COALESCE(SUM(jel.debit - jel.credit), 0)
          ELSE COALESCE(SUM(jel.credit - jel.debit), 0)
        END AS net_balance
      FROM accounts a
      LEFT JOIN journal_entry_lines jel ON jel.account_id = a.id
      LEFT JOIN journal_entries je ON je.id = jel.journal_entry_id AND je.date BETWEEN $2 AND $3 AND je.status = 'POSTED'
      WHERE a.company_id = $1
      GROUP BY a.id, a.code, a.name, a.type
      ORDER BY a.code ASC;
    `,
      [companyId, startDate, endDate],
    );
  }

  @Get('general-ledger')
  async getGeneralLedger(
    @Req() req: any,
    @Query('accountId') accountId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const companyId = req.user.companyId;
    return this.dataSource.query(
      `
      SELECT 
        je.date,
        je.reference,
        je.description AS entry_description,
        jel.debit,
        jel.credit,
        SUM(jel.debit - jel.credit) OVER (ORDER BY je.date, je.created_at) AS running_balance
      FROM journal_entry_lines jel
      INNER JOIN journal_entries je ON je.id = jel.journal_entry_id
      WHERE jel.account_id = $1 
        AND je.company_id = $2
        AND je.date BETWEEN $3 AND $4
        AND je.status = 'POSTED'
      ORDER BY je.date ASC, je.created_at ASC;
    `,
      [accountId, companyId, startDate, endDate],
    );
  }
}
