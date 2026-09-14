//src/warehouses/warehouses.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { Company } from '../entities/company.entity';
import { WarehouseLocation } from '../entities/warehouse-location.entity';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(WarehouseLocation)
    private locationRepo: Repository<WarehouseLocation>,
    @InjectRepository(WarehouseInventory)
    private inventoryRepo: Repository<WarehouseInventory>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWarehouseDto: any, companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: { plan: true },
    });

    if (!company || !company.plan) {
      throw new BadRequestException('Empresa o plan de suscripción no válido');
    }

    const isVehicleWarehouse = createWarehouseDto.isVehicle === true;
    const planName = company.plan.name.toLowerCase();

    if (isVehicleWarehouse && !planName.includes('profesional') && !planName.includes('enterprise')) {
      throw new BadRequestException(
        'Su plan actual no permite registrar vehículos como almacenes móviles. Requiere Plan Profesional o Enterprise.',
      );
    }

    const currentWarehousesCount = await this.warehouseRepository.count({
      where: { companyId },
    });

    const maxWarehouses = company.plan.maxWarehouses;

    if (maxWarehouses !== null && maxWarehouses !== -1 && currentWarehousesCount >= maxWarehouses) {
      throw new BadRequestException(
        `Ha alcanzado el límite máximo de almacenes (${maxWarehouses}) permitido para su [${company.plan.name}]. Actualice su plan para crear más.`,
      );
    }

    const warehouse = this.warehouseRepository.create({
      ...createWarehouseDto,
      companyId,
    });

    return await this.warehouseRepository.save(warehouse);
  }

  async findAllByCompany(companyId: string) {
    return await this.warehouseRepository.find({
      where: { companyId },
    });
  }

  // CORREGIDO: los nombres de campo ahora coinciden con WarehouseLocation
  // real (aisle, shelfOrSection, level) — antes se guardaban campos
  // (code, rack, shelf, bin) que no existen como columnas en la entidad.
  async createLocation(
    warehouseId: string,
    data: { aisle: string; shelfOrSection: string; level?: string },
  ): Promise<WarehouseLocation> {
    const warehouse = await this.warehouseRepository.findOne({ where: { id: warehouseId } });
    if (!warehouse) {
      throw new NotFoundException('Almacén o centro de distribución no encontrado');
    }

    const location = this.locationRepo.create({
      warehouseId: warehouse.id,
      aisle: data.aisle,
      shelfOrSection: data.shelfOrSection,
      level: data.level,
    });

    return await this.locationRepo.save(location);
  }

  // CORREGIDO: "quantity"/"locationId" no existían de verdad en la entidad
  // vieja (por eso todo estaba forzado con "as any"). Ahora usa los
  // nombres reales: "stock" y "warehouseLocationId". También se agrega
  // companyId al buscar/crear, para no mezclar inventario entre empresas.
  async transferStock(data: {
    companyId: string;
    productId: string;
    sourceWarehouseId: string;
    sourceLocationId?: string;
    targetWarehouseId: string;
    targetLocationId?: string;
    quantity: number;
  }): Promise<void> {
    if (data.quantity <= 0) {
      throw new BadRequestException('La cantidad a transferir debe ser mayor a cero');
    }

    const sourceWarehouse = await this.warehouseRepository.findOne({ where: { id: data.sourceWarehouseId } });
    const targetWarehouse = await this.warehouseRepository.findOne({ where: { id: data.targetWarehouseId } });

    if (!sourceWarehouse || !targetWarehouse) {
      throw new NotFoundException('Almacén de origen o destino no encontrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sourceStock = await queryRunner.manager.findOne(WarehouseInventory, {
        where: {
          companyId: data.companyId,
          warehouseId: sourceWarehouse.id,
          productId: data.productId,
          warehouseLocationId: data.sourceLocationId || null,
        },
      });

      if (!sourceStock || Number(sourceStock.stock || 0) < data.quantity) {
        throw new BadRequestException('Stock insuficiente en la ubicación u origen seleccionado');
      }

      sourceStock.stock = Number(sourceStock.stock) - data.quantity;
      await queryRunner.manager.save(sourceStock);

      let targetStock = await queryRunner.manager.findOne(WarehouseInventory, {
        where: {
          companyId: data.companyId,
          warehouseId: targetWarehouse.id,
          productId: data.productId,
          warehouseLocationId: data.targetLocationId || null,
        },
      });

      if (targetStock) {
        targetStock.stock = Number(targetStock.stock || 0) + data.quantity;
      } else {
        targetStock = queryRunner.manager.create(WarehouseInventory, {
          companyId: data.companyId,
          warehouseId: targetWarehouse.id,
          productId: data.productId,
          warehouseLocationId: data.targetLocationId || null,
          stock: data.quantity,
        });
      }

      await queryRunner.manager.save(targetStock);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getInventoryByWarehouse(warehouseId: string) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id: warehouseId } });
    if (!warehouse) {
      throw new NotFoundException('Almacén no encontrado');
    }

    return this.inventoryRepo.find({
      where: { warehouseId: warehouse.id },
      relations: { product: true, warehouseLocation: true },
    });
  }
}
