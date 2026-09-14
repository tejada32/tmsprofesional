// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsIn, ValidateIf, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del administrador es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  companyName: string;

  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono de contacto es obligatorio' })
  phone: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsNotEmpty({ message: 'La región es obligatoria' })
  @IsIn(['Latam', 'Norteamérica', 'Europa', 'Asia', 'África', 'Oceanía'], { message: 'Región no válida' })
  region: string;

  @IsString()
  @IsNotEmpty({ message: 'El país es obligatorio' })
  country: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe definir su función o sector operativo' })
  userFunction: string;

  @ValidateIf((o) => o.userFunction === 'Otro')
  @IsString()
  @IsNotEmpty({ message: 'Debe especificar su función cuando selecciona la opción Otro' })
  @MinLength(4, { message: 'La función personalizada debe tener al menos 4 caracteres' })
  @IsOptional()
  customUserFunction?: string;

  @IsString()
  @IsIn(['trial', 'pro'], { message: 'Debe seleccionar si el plan es de prueba (trial) o Pro' })
  planType: 'trial' | 'pro';

  @IsString()
  @IsNotEmpty({ message: 'Debe seleccionar una categoría de plan' })
  planCategory: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe seleccionar una subcategoría de plan' })
  planSubcategory: string;

  @IsString()
  @IsNotEmpty({ message: 'El identificador del dispositivo es obligatorio' })
  deviceUuid: string;

  @IsString()
  @IsOptional()
  password?: string;
}