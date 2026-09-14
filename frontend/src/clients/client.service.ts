// src/clients/client.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientDocumentType, ClientType, ClientStatus } from '../entities/client.entity';

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

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAllByCompany(companyId: string): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { companyId },
      order: { clientCode: 'ASC' },
    });
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
}
