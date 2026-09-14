// src/product/dto/update-product.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Todos los campos de creación, pero opcionales — excepto "comboItems",
// que se maneja aparte (editar la composición de un combo es una
// operación distinta a editar los datos básicos del producto).
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['comboItems'] as const),
) {}
