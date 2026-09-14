//src/accounting/services/account-seeding.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType } from '../entities/account.entity';

@Injectable()
export class AccountSeedingService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async seedDefaultAccountsForCompany(companyId: string, countryCode: string): Promise<void> {
    const templates = this.getTemplateByCountry(countryCode);

    for (const row of templates) {
      const parentId = row.parentId ? await this.findParentId(companyId, row.parentId) : null;
      
      const account = this.accountRepository.create({
        companyId,
        code: row.code,
        name: row.name,
        type: row.type,
        parentId,
      });
      await this.accountRepository.save(account);
    }
  }

  private getTemplateByCountry(countryCode: string) {
    switch (countryCode.toUpperCase()) {
      case 'CO':
        return this.getColombiaPUCTemplate();
      case 'MX':
        return this.getMexicoSATTemplate();
      case 'DO':
      default:
        return this.getDominicanRepublicTemplate();
    }
  }

  private getDominicanRepublicTemplate() {
    return [
      { code: '1', name: 'Activos', type: AccountType.ASSET, parentId: null },
      { code: '1.1', name: 'Activo Corriente', type: AccountType.ASSET, parentId: '1' },
      { code: '1.1.01', name: 'Efectivo y Equivalentes de Efectivo', type: AccountType.ASSET, parentId: '1.1' },
      { code: '2', name: 'Pasivos', type: AccountType.LIABILITY, parentId: null },
      { code: '3', name: 'Patrimonio', type: AccountType.EQUITY, parentId: null },
      { code: '4', name: 'Ingresos', type: AccountType.REVENUE, parentId: null },
      { code: '5', name: 'Costos', type: AccountType.EXPENSE, parentId: null },
      { code: '6', name: 'Gastos', type: AccountType.EXPENSE, parentId: null },
    ];
  }

  private getColombiaPUCTemplate() {
    return [
      { code: '1', name: 'Activo', type: AccountType.ASSET, parentId: null },
      { code: '11', name: 'Disponibles', type: AccountType.ASSET, parentId: '1' },
      { code: '2', name: 'Pasivo', type: AccountType.LIABILITY, parentId: null },
      { code: '3', name: 'Patrimonio', type: AccountType.EQUITY, parentId: null },
      { code: '4', name: 'Ingresos', type: AccountType.REVENUE, parentId: null },
      { code: '5', name: 'Gastos', type: AccountType.EXPENSE, parentId: null },
      { code: '6', name: 'Costos de Ventas', type: AccountType.EXPENSE, parentId: null },
    ];
  }

  private getMexicoSATTemplate() {
    return [
      { code: '100', name: 'Activo a corto plazo', type: AccountType.ASSET, parentId: null },
      { code: '200', name: 'Pasivo a corto plazo', type: AccountType.LIABILITY, parentId: null },
      { code: '300', name: 'Capital contable', type: AccountType.EQUITY, parentId: null },
      { code: '400', name: 'Ingresos', type: AccountType.REVENUE, parentId: null },
      { code: '500', name: 'Costos', type: AccountType.EXPENSE, parentId: null },
      { code: '600', name: 'Gastos', type: AccountType.EXPENSE, parentId: null },
    ];
  }

  private async findParentId(companyId: string, parentCode: string): Promise<string | null> {
    const parent = await this.accountRepository.findOne({ where: { companyId, code: parentCode } });
    return parent ? parent.id : null;
  }
}