import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiningTable, TableStatus } from '../entities/table.entity';
import { TableAccount, AccountStatus } from '../entities/table-account.entity';
import { TipRecord } from '../entities/tip-record.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(DiningTable)
    private tableRepo: Repository<DiningTable>,
    @InjectRepository(TableAccount)
    private accountRepo: Repository<TableAccount>,
    @InjectRepository(TipRecord)
    private tipRecordRepo: Repository<TipRecord>,
  ) {}

  async getTableMap(companyId: string, branchId: string) {
    return await this.tableRepo.find({ where: { companyId, branchId } });
  }

  async openTable(companyId: string, tableId: string, waiterId: string, guestCount: number) {
    const table = await this.tableRepo.findOne({ where: { id: tableId, companyId } });
    if (!table) throw new NotFoundException('Mesa no encontrada');

    if (table.status === TableStatus.OCCUPIED) {
      throw new BadRequestException('Esta mesa ya se encuentra ocupada');
    }

    table.status = TableStatus.OCCUPIED;
    await this.tableRepo.save(table);

    const account = this.accountRepo.create({
      companyId,
      tableId,
      waiterId,
      guestCount,
      items: [],
      subtotal: 0,
      taxAmount: 0,
      tipAmount: 0,
      totalAmount: 0,
      status: AccountStatus.OPEN,
    });

    return await this.accountRepo.save(account);
  }

  async addItemsToAccount(
    companyId: string,
    accountId: string,
    newItems: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; notes?: string }>,
  ) {
    const account = await this.accountRepo.findOne({ where: { id: accountId, companyId, status: AccountStatus.OPEN } });
    if (!account) throw new NotFoundException('Cuenta abierta no encontrada');

    account.items = [...account.items, ...newItems];
    account.subtotal = account.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    // Cálculos de ley (Ej: 18% impuesto, 10% propina legal)
    account.taxAmount = Number((account.subtotal * 0.18).toFixed(2));
    account.tipAmount = Number((account.subtotal * 0.10).toFixed(2));
    account.totalAmount = Number((account.subtotal + account.taxAmount + account.tipAmount).toFixed(2));

    return await this.accountRepo.save(account);
  }

  async closeTableAccount(companyId: string, accountId: string) {
    const account = await this.accountRepo.findOne({ where: { id: accountId, companyId } });
    if (!account) throw new NotFoundException('Cuenta no encontrada');

    account.status = AccountStatus.BILLED;
    await this.accountRepo.save(account);

    // Registrar la propina generada para el mesero
    if (account.tipAmount > 0 && account.waiterId) {
      const tipRecord = this.tipRecordRepo.create({
        companyId,
        employeeId: account.waiterId,
        tableAccountId: account.id,
        amount: account.tipAmount,
      });
      await this.tipRecordRepo.save(tipRecord);
    }

    const table = await this.tableRepo.findOne({ where: { id: account.tableId, companyId } });
    if (table) {
      table.status = TableStatus.FREE;
      await this.tableRepo.save(table);
    }

    return { message: 'Mesa liberada, cuenta cerrada y propina registrada exitosamente', account };
  }
}
