// src/warehouse-inventory.controller.ts
import { Controller, Get, Post, Body, Param, Put, Req, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseInventory } from './entities/warehouse-inventory.entity';

@Controller('warehouse-inventory')
export class WarehouseInventoryController {
  constructor(
    @InjectRepository(WarehouseInventory)
    private readonly inventoryRepo: Repository<WarehouseInventory>,
  ) {}

  // CORREGIDO: antes devolvía el inventario de TODAS las empresas sin
  // ningún filtro. Ahora solo devuelve el de la empresa del token.
  @Get()
  async findAll(@Req() req: any) {
    const companyId = req.user.companyId;
    return await this.inventoryRepo.find({
      where: { companyId },
      relations: { warehouse: true, warehouseLocation: true, product: true },
    });
  }

  // CORREGIDO: companyId ya no se acepta del body, siempre viene del JWT.
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const companyId = req.user.companyId;
    const {
      warehouseId,
      warehouseLocationId,
      productId,
      stock,
      minStockLevel,
      maxStockLevel,
      batchNumber,
      expiryDate,
    } = body;

    const newItem = this.inventoryRepo.create({
      companyId,
      warehouseId,
      warehouseLocationId,
      productId,
      stock,
      minStockLevel,
      maxStockLevel,
      batchNumber,
      expiryDate,
    });

    return await this.inventoryRepo.save(newItem);
  }

  // CORREGIDO: antes buscaba el registro SOLO por "id", así que cualquier
  // usuario autenticado de cualquier empresa podía editar el stock de
  // cualquier otra empresa con solo conocer el id. Ahora se exige que el
  // registro pertenezca a la empresa del token.
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const companyId = req.user.companyId;
    const { stock, minStockLevel, maxStockLevel, warehouseLocationId, batchNumber, expiryDate } = body;
    const inventoryItem = await this.inventoryRepo.findOne({ where: { id, companyId } });

    if (!inventoryItem) {
      throw new NotFoundException('Registro de inventario no encontrado');
    }

    if (stock !== undefined) inventoryItem.stock = stock;
    if (minStockLevel !== undefined) inventoryItem.minStockLevel = minStockLevel;
    if (maxStockLevel !== undefined) inventoryItem.maxStockLevel = maxStockLevel;
    if (warehouseLocationId !== undefined) inventoryItem.warehouseLocationId = warehouseLocationId;
    if (batchNumber !== undefined) inventoryItem.batchNumber = batchNumber;
    if (expiryDate !== undefined) inventoryItem.expiryDate = expiryDate;

    return await this.inventoryRepo.save(inventoryItem);
  }
}
