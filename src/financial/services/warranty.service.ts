// src/services/warranty.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warranty, WarrantyStatus } from '../entities/warranty.entity';

@Injectable()
export class WarrantyService {
  constructor(
    @InjectRepository(Warranty)
    private warrantyRepo: Repository<Warranty>,
  ) {}

  // 1. Emitir una garantía al vender un producto
  async registerWarranty(data: {
    companyId: string;
    clientId: string;
    saleId: string;
    productName: string;
    serialNumberOrMac?: string;
    durationMonths: number;
  }) {
    const saleDate = new Date();
    const expirationDate = new Date();
    expirationDate.setMonth(saleDate.getMonth() + data.durationMonths);

    const warranty = this.warrantyRepo.create({
      ...data,
      expirationDate,
      status: WarrantyStatus.ACTIVE,
    });

    return await this.warrantyRepo.save(warranty);
  }

  // 2. Procesar una reclamación de garantía por parte del cliente
  async claimWarranty(warrantyId: string, claimReason: string) {
    const warranty = await this.warrantyRepo.findOne({ where: { id: warrantyId } });
    if (!warranty) throw new NotFoundException('Registro de garantía no encontrado');

    const currentDate = new Date();
    if (currentDate > new Date(warranty.expirationDate)) {
      warranty.status = WarrantyStatus.EXPIRED;
      await this.warrantyRepo.save(warranty);
      throw new BadRequestException('La garantía de este producto ha expirado');
    }

    if (warranty.status !== WarrantyStatus.ACTIVE) {
      throw new BadRequestException(`La garantía ya no está activa. Estatus actual: ${warranty.status}`);
    }

    warranty.status = WarrantyStatus.CLAIMED;
    warranty.claimReason = claimReason;

    return await this.warrantyRepo.save(warranty);
  }
}