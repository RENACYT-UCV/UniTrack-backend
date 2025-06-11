import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @IsString()
  codigoEstudiante: string;

  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @IsOptional()
  @IsString()
  correoA?: string;

  @IsNotEmpty()
  @IsString()
  carrera: string;

  @IsNotEmpty()
  @IsString()
  ciclo: string;

  @IsNotEmpty()
  @IsString()
  edad: string;

  @IsNotEmpty()
  @IsString()
  sexo: string;
}