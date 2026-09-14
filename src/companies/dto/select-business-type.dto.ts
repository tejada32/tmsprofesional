// src/companies/dto/select-business-type.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BusinessType } from '../enums/business-type.enum';

export class SelectBusinessTypeDto {
  @IsNotEmpty()
  @IsEnum(BusinessType, { message: 'El tipo de negocio seleccionado no es válido' })
  businessType: BusinessType;
}