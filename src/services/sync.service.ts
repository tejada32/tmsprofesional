// src/services/sync.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,
  ) {}

  async processOfflineSync(companyId: string, offlineSales: any[]) {
    if (!offlineSales || !Array.isArray(offlineSales)) {
      throw new BadRequestException('Formato de sincronización inválido');
    }

    const syncedResults = [];

    for (const saleData of offlineSales) {
      try {
        if (saleData.companyId !== companyId) continue;

        const newSale = this.saleRepo.create({
          ...saleData,
          isSyncedFromOffline: true,
        });

        // Usamos un doble casteo seguro (unknown -> Sale) para evitar el conflicto de sobrecarga de TypeORM
        const savedSale = (await this.saleRepo.save(newSale)) as unknown as Sale;

        syncedResults.push({
          localId: saleData.localId || saleData.id,
          serverId: savedSale.id,
          status: 'SUCCESS',
        });
      } catch (error) {
        syncedResults.push({
          localId: saleData.localId || saleData.id,
          status: 'FAILED',
          error: error.message,
        });
      }
    }

    return {
      message: 'Sincronización procesada con éxito',
      results: syncedResults,
    };
  }
}