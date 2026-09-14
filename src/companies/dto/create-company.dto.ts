// src/companies/dto/create-company.dto.ts
import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { SUBSCRIPTION_PLANS_MASTER } from '../../modules/subscriptions/subscription-plans.constant';

const validAbbreviations = SUBSCRIPTION_PLANS_MASTER.map(p => p.abbreviation);

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(validAbbreviations, { message: 'La abreviatura del plan de suscripción no es válida' })
  subscriptionPlanAbbreviation: string;
}