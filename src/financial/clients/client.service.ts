// src/clients/client.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientDocumentType, ClientType, ClientStatus } from '../entities/client.entity';
import { AccountTransaction, AccountTransactionType } from '../entities/account-transaction.entity';

export interface CreateClientInput {
  fullName: string;
  documentType?: ClientDocumentType;
  documentNumber?: string;
  clientType?: ClientType;
  email?: string;
  phone?: string;
  phoneExtension?: string;
  address?: string;
  city?: string;
  status?: ClientStatus;
  creditLimit?: number;
  notes?: string;
}

export type UpdateClientInput = Partial<CreateClientInput>;

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(AccountTransaction)
    private readonly accountTransactionRepository: Repository<AccountTransaction>,
  ) {}

  // Devuelve los clientes de la empresa con su "balance" calculado en
  // vivo: la suma de (totalAmount - paidAmount) de sus cuentas por cobrar
  // (ventas a crédito, préstamos, etc.). NUNCA es un campo editable a
  // mano — es siempre el resultado de esta consulta contra
  // account_transactions.
  async findAllByCompany(companyId: string): Promise<Array<Client & { balance: number }>> {
    const { entities, raw } = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoin(
        AccountTransaction,
        'at',
        'at.clientId = client.id AND at.type = :type',
        { type: AccountTransactionType.RECEIVABLE },
      )
      .select('client')
      .addSelect('COALESCE(SUM(at.totalAmount - at.paidAmount), 0)', 'balance')
      .where('client.companyId = :companyId', { companyId })
      .groupBy('client.id')
      .orderBy('client.clientCode', 'ASC')
      .getRawAndEntities();

    return entities.map((client, index) => ({
      ...client,
      balance: Number(raw[index]?.balance || 0),
    }));
  }

  async create(companyId: string, dto: CreateClientInput): Promise<Client> {
    // El código de cliente es correlativo POR EMPRESA (ver el índice único
    // companyId+clientCode en la entidad). Nota: esto no está protegido
    // contra una condición de carrera si dos usuarios de la misma empresa
    // crean un cliente en el mismo instante exacto — para el volumen de
    // este sistema es un riesgo aceptable, pero si en el futuro se vuelve
    // un problema real, esto debería envolverse en una transacción con
    // bloqueo pesimista (igual que se hizo en SaleController).
    const { max } = await this.clientRepository
      .createQueryBuilder('client')
      .select('MAX(client.clientCode)', 'max')
      .where('client.companyId = :companyId', { companyId })
      .getRawOne();

    const nextClientCode = (max || 0) + 1;

    const client = this.clientRepository.create({
      companyId,
      clientCode: nextClientCode,
      fullName: dto.fullName,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      clientType: dto.clientType,
      email: dto.email,
      phone: dto.phone,
      phoneExtension: dto.phoneExtension,
      address: dto.address,
      city: dto.city,
      status: dto.status,
      creditLimit: dto.creditLimit,
      notes: dto.notes,
    });

    return await this.clientRepository.save(client);
  }

  // CORREGIDO: no existía forma de editar un cliente ya creado (solo
  // "ver" y "crear"). companyId siempre viene del JWT en el controller,
  // nunca del cliente, así que esto nunca permite editar un cliente de
  // otra empresa aunque alguien adivine el id.
  async update(companyId: string, id: string, dto: UpdateClientInput): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id, companyId } });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // "balance" nunca se acepta aquí: no es una columna real de Client,
    // se calcula siempre en findAllByCompany.
    Object.assign(client, {
      fullName: dto.fullName ?? client.fullName,
      documentType: dto.documentType ?? client.documentType,
      documentNumber: dto.documentNumber ?? client.documentNumber,
      clientType: dto.clientType ?? client.clientType,
      email: dto.email ?? client.email,
      phone: dto.phone ?? client.phone,
      phoneExtension: dto.phoneExtension ?? client.phoneExtension,
      address: dto.address ?? client.address,
      city: dto.city ?? client.city,
      status: dto.status ?? client.status,
      creditLimit: dto.creditLimit ?? client.creditLimit,
      notes: dto.notes ?? client.notes,
    });

    return await this.clientRepository.save(client);
  }
}
