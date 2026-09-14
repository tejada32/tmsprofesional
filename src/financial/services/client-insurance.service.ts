// src/services/client-insurance.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { InsuranceCompany } from '../entities/insurance-company.entity';

@Injectable()
export class ClientInsuranceService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    @InjectRepository(InsuranceCompany)
    private insuranceRepo: Repository<InsuranceCompany>,
  ) {}

  // 1. Crear o registrar cliente con sus documentos adjuntos
  async createClient(data: Partial<Client>) {
    const client = this.clientRepo.create(data);
    return await this.clientRepo.save(client);
  }

  // 2. Actualizar las imágenes de documentos o contratos del cliente
  async updateClientDocuments(clientId: string, documentImageUrl?: string, contractImageUrl?: string) {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Cliente no encontrado');

    if (documentImageUrl) client.documentImageUrl = documentImageUrl;
    if (contractImageUrl) client.contractImageUrl = contractImageUrl;

    return await this.clientRepo.save(client);
  }

  // 3. Registrar una Compañía de Seguros
  async createInsuranceCompany(data: Partial<InsuranceCompany>) {
    const insurance = this.insuranceRepo.create(data);
    return await this.insuranceRepo.save(insurance);
  }

  async getAllInsuranceCompanies() {
    return await this.insuranceRepo.find({ where: { isActive: true } });
  }
}