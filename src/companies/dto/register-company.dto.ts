// src/companies/dto/register-company.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { BusinessType } from '../enums/business-type.enum';

export class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsString()
  plan: string; // Recibe la abreviatura o nombre del plan (ej: 'VG1', 'SP03')
  
  @IsString()
  @IsOptional()
  planType?: string;

  @IsString()
  @IsOptional()
  billingCycle?: string;

  @IsEnum(BusinessType)
  businessType: BusinessType;
}