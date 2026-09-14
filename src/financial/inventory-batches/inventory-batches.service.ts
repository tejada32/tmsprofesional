// src/inventory-batches/inventory-batches.service.ts
//
// CORREGIDO: antes usaba ProductBatch, una tabla duplicada de
// WarehouseInventory (mismos datos: companyId, productId, lote,
// vencimiento, cantidad) pero organizada por sucursal en vez de almacén.
// Se elimina esa duplicación y se usa WarehouseInventory directamente.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';

@Injectable()
export class InventoryBatchesService {
  constructor(
    @InjectRepository(WarehouseInventory)
    private readonly inventoryRepository: Repository<WarehouseInventory>,
  ) {}

  async createBatch(
    companyId: string,
    warehouseId: string,
    dto: { productId: string; batchNumber: string; expirationDate: string; quantity: number; warehouseLocationId?: string },
  ) {
    const batch = this.inventoryRepository.create({
      companyId,
      warehouseId,
      productId: dto.productId,
      batchNumber: dto.batchNumber,
      expiryDate: new Date(dto.expirationDate),
      stock: dto.quantity,
      warehouseLocationId: dto.warehouseLocationId,
    });
    return await this.inventoryRepository.save(batch);
  }

  async findBatchesByProduct(companyId: string, productId: string) {
    return await this.inventoryRepository.find({
      // Solo filas que sí llevan control de lote (batchNumber no nulo);
      // el stock "suelto" sin lote no aplica aquí.
      where: { companyId, productId, batchNumber: Not(IsNull()) },
      order: { expiryDate: 'ASC' }, // Implementa FEFO (First Expired, First Out)
    });
  }

  async updateStock(id: string, quantity: number, companyId: string) {
    const batch = await this.inventoryRepository.findOne({ where: { id, companyId } });
    if (!batch) {
      throw new NotFoundException('Lote no encontrado');
    }
    batch.stock = quantity;
    return await this.inventoryRepository.save(batch);
  }
}
