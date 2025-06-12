// create-admin.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  nombres: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  apellidos: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 100)
  correo: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  edad: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  sexo: string;
}
