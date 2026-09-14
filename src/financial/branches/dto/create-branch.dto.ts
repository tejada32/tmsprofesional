import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la sucursal es obligatorio' })
  name: string;

  @IsBoolean({ message: 'El campo isWarehouse debe ser verdadero o falso' })
  @IsOptional()
  isWarehouse?: boolean;
}