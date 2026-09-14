import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  email: string;

  @IsString()
  password: string;
}