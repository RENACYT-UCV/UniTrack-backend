import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ description: 'First name(s) of the admin', example: 'John' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ description: 'Last name(s) of the admin', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({
    description:
      'Email address of the admin (must be unique and @ucvvirtual.edu.pe)',
    example: 'john.doe@ucvvirtual.edu.pe',
  })
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[\w-.]+@ucvvirtual\.edu\.pe$/, {
    message:
      'El correo debe ser institucional y terminar en @ucvvirtual.edu.pe',
  })
  correo: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  contrasena: string;

  @ApiProperty({ description: 'Age of the admin', example: '30' })
  @IsString()
  @IsNotEmpty()
  edad: string;

  @ApiProperty({ description: 'Gender of the admin', example: 'Male' })
  @IsString()
  @IsNotEmpty()
  sexo: string;
}
