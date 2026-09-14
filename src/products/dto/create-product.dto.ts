// src/product/dto/create-product.dto.ts
//
// Archivo consolidado: existían 2 copias (src/products/dto/ y
// src/inventory/dto/), ninguna en la ruta real que usa product.controller.ts
// (src/product/dto/). Se combinaron los campos de ambas versiones.
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  Min,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '../../entities/product.entity';

export class ComboItemDto {
  @IsUUID()
  componentProductId: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  warrantyDays?: number;

  @IsOptional()
  @IsBoolean()
  printWarrantyOnInvoice?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresSerialMac?: boolean;

  @IsOptional()
  @IsBoolean()
  isCombo?: boolean;

  // NUEVO: componentes del combo, solo se usa si isCombo = true.
  // Se valida en el servicio que venga al menos 1 si isCombo es true.
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ComboItemDto)
  comboItems?: ComboItemDto[];

  // --- Campos físicos y logísticos para muebles ---
  @IsOptional()
  @IsNumber()
  @Min(0)
  lengthCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  widthCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cubicMeters?: number;

  @IsOptional()
  @IsBoolean()
  requiresAssembly?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  // QUITADO: "warehouseLocationId" ya no existe en Product. La ubicación
  // ahora vive en WarehouseInventory (una por cada almacén donde el
  // producto tenga stock), no en el producto en sí.
}
