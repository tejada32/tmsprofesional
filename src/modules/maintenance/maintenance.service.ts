// src/modules/maintenance/maintenance.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { AssetEquipment } from './entities/asset-equipment.entity';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderPart } from './entities/work-order-part.entity';
import { MaintenanceSchedule } from './entities/maintenance-schedule.entity';
import { TireLog } from './entities/tire-log.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepo: Repository<Building>,
    @InjectRepository(AssetEquipment)
    private readonly assetRepo: Repository<AssetEquipment>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepo: Repository<WorkOrder>,
    @InjectRepository(WorkOrderPart)
    private readonly workOrderPartRepo: Repository<WorkOrderPart>,
    @InjectRepository(MaintenanceSchedule)
    private readonly scheduleRepo: Repository<MaintenanceSchedule>,
    @InjectRepository(TireLog)
    private readonly tireLogRepo: Repository<TireLog>,
  ) {}

  // ===================== EDIFICIOS =====================

  async createBuilding(companyId: string, dto: { name: string; address?: string; description?: string }) {
    const building = this.buildingRepo.create({ ...dto, companyId });
    return await this.buildingRepo.save(building);
  }

  async findAllBuildings(companyId: string) {
    return await this.buildingRepo.find({ where: { companyId }, relations: { assets: true } });
  }

  // ===================== ACTIVOS / EQUIPOS =====================

  async createAsset(companyId: string, dto: { buildingId?: string; name: string; category: string; serialNumber?: string }) {
    if (dto.buildingId) {
      const building = await this.buildingRepo.findOne({ where: { id: dto.buildingId, companyId } });
      if (!building) throw new NotFoundException('Edificio no encontrado');
    }
    const asset = this.assetRepo.create({ ...dto, companyId });
    return await this.assetRepo.save(asset);
  }

  async findAllAssets(companyId: string, buildingId?: string) {
    return await this.assetRepo.find({
      where: buildingId ? { companyId, buildingId } : { companyId },
    });
  }

  async updateAssetStatus(companyId: string, id: string, status: string) {
    const asset = await this.assetRepo.findOne({ where: { id, companyId } });
    if (!asset) throw new NotFoundException('Activo/equipo no encontrado');
    asset.status = status;
    return await this.assetRepo.save(asset);
  }

  // ===================== ÓRDENES DE TRABAJO =====================

  async createWorkOrder(companyId: string, dto: {
    branchId?: string;
    vehicleId?: string;
    targetType?: string;
    targetId?: string;
    type?: string;
    description?: string;
  }) {
    const workOrder = this.workOrderRepo.create({ ...dto, companyId, status: 'OPEN' });
    return await this.workOrderRepo.save(workOrder);
  }

  async findAllWorkOrders(companyId: string, status?: string) {
    return await this.workOrderRepo.find({
      where: status ? { companyId, status } : { companyId },
      relations: { parts: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateWorkOrderStatus(companyId: string, id: string, status: string) {
    const workOrder = await this.workOrderRepo.findOne({ where: { id, companyId } });
    if (!workOrder) throw new NotFoundException('Orden de trabajo no encontrada');

    workOrder.status = status;
    if (status === 'IN_PROGRESS' && !workOrder.startDate) {
      workOrder.startDate = new Date();
    }
    if (status === 'COMPLETED') {
      workOrder.completionDate = new Date();
    }

    return await this.workOrderRepo.save(workOrder);
  }

  // Agrega un repuesto a la orden y recalcula los costos totales.
  // Nota: descuenta el costo del repuesto pero NO descuenta stock de
  // WarehouseInventory — si se quiere enlazar con el almacén real, hay
  // que decidir de qué almacén sale cada repuesto (igual que en
  // RepairService.addPartsAndLabor).
  async addWorkOrderPart(companyId: string, workOrderId: string, dto: { productId: string; quantity: number; unitCost: number }) {
    const workOrder = await this.workOrderRepo.findOne({ where: { id: workOrderId, companyId }, relations: { parts: true } });
    if (!workOrder) throw new NotFoundException('Orden de trabajo no encontrada');

    const totalCost = dto.quantity * dto.unitCost;
    const part = this.workOrderPartRepo.create({
      workOrderId,
      productId: dto.productId,
      quantity: dto.quantity,
      unitCost: dto.unitCost,
      totalCost,
    });
    await this.workOrderPartRepo.save(part);

    const existingPartsCost = Number(workOrder.partsCost || 0) + totalCost;
    workOrder.partsCost = existingPartsCost;
    workOrder.totalCost = Number(workOrder.laborCost || 0) + existingPartsCost;
    return await this.workOrderRepo.save(workOrder);
  }

  // ===================== PROGRAMAS DE MANTENIMIENTO PREVENTIVO =====================

  async createSchedule(companyId: string, dto: {
    vehicleId: string;
    serviceName: string;
    triggerType?: string;
    intervalValue: number;
    lastServiceValue?: number;
  }) {
    const lastServiceValue = dto.lastServiceValue ?? 0;
    const schedule = this.scheduleRepo.create({
      ...dto,
      companyId,
      lastServiceValue,
      nextServiceValue: lastServiceValue + dto.intervalValue,
      status: 'PENDING',
    });
    return await this.scheduleRepo.save(schedule);
  }

  async findAllSchedules(companyId: string, vehicleId?: string) {
    return await this.scheduleRepo.find({
      where: vehicleId ? { companyId, vehicleId } : { companyId },
    });
  }

  // Marca el servicio como completado y calcula automáticamente el
  // próximo vencimiento sumando el intervalo configurado.
  async completeSchedule(companyId: string, id: string, serviceValueAtCompletion: number) {
    const schedule = await this.scheduleRepo.findOne({ where: { id, companyId } });
    if (!schedule) throw new NotFoundException('Programa de mantenimiento no encontrado');

    schedule.lastServiceValue = serviceValueAtCompletion;
    schedule.nextServiceValue = serviceValueAtCompletion + schedule.intervalValue;
    schedule.status = 'COMPLETED';
    return await this.scheduleRepo.save(schedule);
  }

  // ===================== BITÁCORA DE LLANTAS =====================

  async createTireLog(companyId: string, dto: {
    vehicleId?: string;
    serialNumber: string;
    position: string;
    installationDate?: string;
    installationMileage?: number;
  }) {
    const tireLog = this.tireLogRepo.create({
      ...dto,
      companyId,
      installationDate: dto.installationDate ? new Date(dto.installationDate) : undefined,
      status: 'ACTIVE',
    });
    return await this.tireLogRepo.save(tireLog);
  }

  async findAllTireLogs(companyId: string, vehicleId?: string) {
    return await this.tireLogRepo.find({
      where: vehicleId ? { companyId, vehicleId } : { companyId },
    });
  }

  async updateTireLogStatus(companyId: string, id: string, status: string, currentDepthMm?: number) {
    const tireLog = await this.tireLogRepo.findOne({ where: { id, companyId } });
    if (!tireLog) throw new NotFoundException('Registro de llanta no encontrado');

    tireLog.status = status;
    if (currentDepthMm !== undefined) tireLog.currentDepthMm = currentDepthMm;
    return await this.tireLogRepo.save(tireLog);
  }
}
