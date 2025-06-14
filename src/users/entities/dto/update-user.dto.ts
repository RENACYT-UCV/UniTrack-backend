import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombres?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  apellidos?: string;

  @ApiProperty({
    example: 'john.doe@ucvvirtual.edu.pe',
    description: 'Email address of the user (must be @ucvvirtual.edu.pe)',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @Matches(/^[\w-.]+@ucvvirtual\.edu\.pe$/, {
    message:
      'El correo debe ser institucional y terminar en @ucvvirtual.edu.pe',
  })
  correo?: string;

  @ApiProperty({
    example: '20230001',
    description: 'Student code of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoEstudiante?: string;
}
