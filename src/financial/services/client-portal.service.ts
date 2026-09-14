// src/services/client-portal.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { Sale } from '../entities/sale.entity';
import { RepairOrder } from '../entities/repair-order.entity';
import { Warranty } from '../entities/warranty.entity';

@Injectable()
export class ClientPortalService {
  constructor(
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,
    @InjectRepository(RepairOrder)
    private repairRepo: Repository<RepairOrder>,
    @InjectRepository(Warranty)
    private warrantyRepo: Repository<Warranty>,
  ) {}

  // CORREGIDO: todas las consultas ahora exigen companyId (del JWT). Antes
  // se buscaba solo por clientId, así que un usuario autenticado de la
  // Empresa A podía ver el perfil, facturas, reparaciones y garantías de
  // un cliente de la Empresa B con solo conocer o adivinar su clientId.

  // 1. Obtener perfil completo del cliente y sus documentos asociados
  async getClientProfile(companyId: string, clientId: string) {
    const client = await this.clientRepo.findOne({ where: { id: clientId, companyId } as Record<string, any> });
    if (!client) throw new NotFoundException('Cliente no encontrado');
    return client;
  }

  // 2. Historial de facturas y compras del cliente
  async getClientInvoices(companyId: string, clientId: string) {
    // Usamos Record para evitar conflictos estrictos en el where de TypeORM
    return await this.saleRepo.find({
      where: { clientId, companyId } as Record<string, any>,
      order: { createdAt: 'DESC' },
    });
  }

  // 3. Estado de equipos en el taller de reparación asociados al cliente
  async getClientRepairOrders(companyId: string, clientId: string) {
    return await this.repairRepo.find({
      where: { clientId, companyId } as Record<string, any>,
      order: { createdAt: 'DESC' },
    });
  }

  // 4. Listado de garantías activas o vencidas de los productos del cliente
  async getClientWarranties(companyId: string, clientId: string) {
    return await this.warrantyRepo.find({
      where: { clientId, companyId },
      order: { expirationDate: 'DESC' },
    });
  }
}
