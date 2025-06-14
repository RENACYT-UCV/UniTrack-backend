import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches, // <-- Importa Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @ApiProperty({
    example: 'john.doe@ucvvirtual.edu.pe',
    description: 'Email address of the user (must be @ucvvirtual.edu.pe)',
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-.]+@ucvvirtual\.edu\.pe$/, {
    message:
      'El correo debe ser institucional y terminar en @ucvvirtual.edu.pe',
  })
  correo: string;

  @ApiProperty({ example: '20230001', description: 'Student code of the user' })
  @IsNotEmpty()
  @IsString()
  codigoEstudiante: string;

  @ApiProperty({
    example: 'securepassword123',
    description: 'Password for the user account',
  })
  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @ApiProperty({
    example: 'john.doe.alt@example.com',
    description: 'Alternative email address of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  correoA?: string;

  @ApiProperty({
    example: 'Ingeniería de Sistemas',
    description: 'Major/career of the student',
  })
  @IsNotEmpty()
  @IsString()
  carrera: string;

  @ApiProperty({ example: 'V', description: 'Academic cycle of the student' })
  @IsNotEmpty()
  @IsString()
  ciclo: string;

  @ApiProperty({ example: '20', description: 'Age of the student' })
  @IsNotEmpty()
  @IsString()
  edad: string;

  @ApiProperty({ example: 'Masculino', description: 'Gender of the student' })
  @IsNotEmpty()
  @IsString()
  sexo: string;
}
