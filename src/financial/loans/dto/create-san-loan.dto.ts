// src/loans/dto/create-san-loan.dto.ts
import { IsNotEmpty, IsNumber, IsPositive, IsInt, IsUUID } from 'class-validator';

export class CreateSanLoanDto {
  @IsUUID('4', { message: 'El ID del cliente debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El cliente es obligatorio' })
  clientId: string;

  @IsNumber({}, { message: 'El monto principal debe ser un valor numérico' })
  @IsPositive({ message: 'El monto principal debe ser mayor a cero' })
  @IsNotEmpty({ message: 'El monto principal es obligatorio' })
  principalAmount: number;

  @IsNumber({}, { message: 'El total a pagar debe ser un valor numérico' })
  @IsPositive({ message: 'El total a pagar debe ser mayor a cero' })
  @IsNotEmpty({ message: 'El total a pagar es obligatorio' })
  totalPayable: number;

  @IsInt({ message: 'La cantidad de cuotas debe ser un número entero' })
  @IsPositive({ message: 'La cantidad de cuotas debe ser mayor a cero' })
  @IsNotEmpty({ message: 'La cantidad de cuotas es obligatoria' })
  installmentsCount: number;

  @IsNumber({}, { message: 'El valor de la cuota fija debe ser numérico' })
  @IsPositive({ message: 'El valor de la cuota fija debe ser mayor a cero' })
  @IsNotEmpty({ message: 'El valor de la cuota fija es obligatorio' })
  installmentAmount: number;
}