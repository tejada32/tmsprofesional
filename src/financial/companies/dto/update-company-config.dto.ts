// src/companies/dto/update-company-config.dto.ts
import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';

export class UpdateCompanyConfigDto {
  @IsOptional()
  @IsNumber()
  sessionTimeoutMinutes?: number;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsArray()
  activeModules?: string[];
}