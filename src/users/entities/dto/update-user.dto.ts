import { IsEmail, IsOptional, IsString } from 'class-validator';
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
    example: 'john.doe@example.com',
    description: 'Email address of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
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
