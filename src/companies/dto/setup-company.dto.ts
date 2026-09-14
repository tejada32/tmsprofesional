// src/companies/dto/select-business-type.dto.ts

import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { BusinessType } from '../enums/business-type.enum';

export class SelectBusinessTypeDto {
  @IsNotEmpty()
  @IsEnum(BusinessType)
  businessType: BusinessType;
}

export class SetupCompanyDto {
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @IsString()
  plan: string; // Ejemplo: 'A1', 'Prueba', etc.
}