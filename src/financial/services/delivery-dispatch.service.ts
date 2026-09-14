// src/services/delivery-dispatch.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryDispatch, DeliveryStatus } from '../entities/delivery-dispatch.entity';

@Injectable()
export class DeliveryDispatchService {
  constructor(
    @InjectRepository(DeliveryDispatch)
    private readonly dispatchRepo: Repository<DeliveryDispatch>,
  ) {}

  // 1. Crear despacho al momento de la venta
  async create(companyId: string, saleId: string, deliveryAddress: string, freightCost: number, isCharged: boolean) {
    const dispatch = this.dispatchRepo.create({
      companyId,
      saleId,
      deliveryAddress,
      freightCost,
      isFreightChargedToClient: isCharged,
      status: DeliveryStatus.PENDING,
    });
    return await this.dispatchRepo.save(dispatch);
  }

  // 2. Asignar ruta (vehículo y chofer)
  async assignRoute(companyId: string, id: string, driverName: string, vehiclePlate: string) {
    const dispatch = await this.dispatchRepo.findOne({ where: { id, companyId } });
    if (!dispatch) throw new NotFoundException('Despacho no encontrado');

    dispatch.driverName = driverName;
    dispatch.vehiclePlate = vehiclePlate;
    dispatch.status = DeliveryStatus.READY_FOR_DISPATCH;

    return await this.dispatchRepo.save(dispatch);
  }

  // 3. Ver despachos pendientes (SOLO de la empresa del token)
  async getPendingDeliveries(companyId: string) {
    return await this.dispatchRepo.find({
      where: { companyId, status: DeliveryStatus.PENDING },
      relations: { sale: true }, // <-- Corrección clave para TypeORM
    });
  }

  // 4. Actualizar estado del despacho
  async updateStatus(companyId: string, id: string, status: DeliveryStatus) {
    const dispatch = await this.dispatchRepo.findOne({ where: { id, companyId } });
    if (!dispatch) throw new NotFoundException('Despacho no encontrado');

    dispatch.status = status;
    return await this.dispatchRepo.save(dispatch);
  }
}
