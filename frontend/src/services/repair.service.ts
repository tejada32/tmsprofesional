// src/services/repair.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairOrder, RepairStatus } from '../entities/repair-order.entity';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(RepairOrder)
    private readonly repairRepository: Repository<RepairOrder>,
    @InjectRepository(WarehouseInventory)
    private readonly inventoryRepository: Repository<WarehouseInventory>,
  ) {}

  async create(createDto: {
    companyId: string;
    branchId?: string;
    clientId: string;
    technicianId?: string;
    deviceModel: string;
    serialNumberOrMac?: string;
    problemDescription: string;
    aestheticCondition?: string;
    estimatedCost?: number;
  }) {
    const repair = this.repairRepository.create({
      ...createDto,
      status: RepairStatus.DIAGNOSIS,
    });

    return await this.repairRepository.save(repair);
  }

  // CORREGIDO: ahora recibe companyId y lo usa para verificar que la orden
  // pertenece a la empresa del usuario autenticado. Antes buscaba solo por
  // "id", así que cualquier usuario de cualquier empresa podía cambiar el
  // estado de la orden de reparación de otra empresa con solo conocer el id.
  async updateRepairStatus(
    id: string,
    companyId: string,
    status: RepairStatus,
    technicalDiagnosis?: string,
    technicianId?: string,
  ) {
    const repair = await this.repairRepository.findOne({ where: { id, companyId } });
    if (!repair) {
      throw new NotFoundException('Orden de reparación no encontrada');
    }

    repair.status = status;
    if (technicalDiagnosis) repair.technicalDiagnosis = technicalDiagnosis;
    if (technicianId) repair.technicianId = technicianId;

    return await this.repairRepository.save(repair);
  }

  // CORREGIDO: recibía "branchId" para descontar stock, pero una sucursal
  // puede tener varios almacenes. Ahora recibe companyId + warehouseId
  // para saber exactamente de dónde descontar (igual que en sale.controller.ts).
  // companyId ahora viene siempre del JWT (vía el controller), y se usa
  // también para verificar que la orden pertenece a esa empresa.
  async addPartsAndLabor(
    id: string,
    companyId: string,
    warehouseId: string,
    newParts: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>,
    finalCost: number,
  ) {
    const repair = await this.repairRepository.findOne({ where: { id, companyId } });
    if (!repair) {
      throw new NotFoundException('Orden de reparación no encontrada');
    }

    // Descontar del inventario del almacén por cada pieza utilizada
    for (const part of newParts) {
      const inventoryItem = await this.inventoryRepository.findOne({
        where: { companyId, warehouseId, productId: part.productId },
      });

      if (!inventoryItem || inventoryItem.stock < part.quantity) {
        throw new BadRequestException(`Stock insuficiente en el almacén para el producto ID: ${part.productId}`);
      }

      inventoryItem.stock -= part.quantity;
      await this.inventoryRepository.save(inventoryItem);
    }

    repair.partsUsed = newParts;
    repair.finalCost = finalCost;

    return await this.repairRepository.save(repair);
  }

  async getOrdersByStatus(companyId: string, status?: RepairStatus) {
    const query = this.repairRepository.createQueryBuilder('repair')
      .where('repair.companyId = :companyId', { companyId });

    if (status) {
      query.andWhere('repair.status = :status', { status });
    }

    return await query.getMany();
  }
}
