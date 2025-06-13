import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({
    description: 'First name(s) of the admin',
    example: 'Jane',
    required: false,
  })
  @IsString()
  @IsOptional()
  nombres?: string;

  @ApiProperty({
    description: 'Last name(s) of the admin',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  apellidos?: string;

  @ApiProperty({
    description: 'Email address of the admin (must be unique)',
    example: 'jane.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  correo?: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'newpassword123',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  contrasena?: string;

  @ApiProperty({
    description: 'Age of the admin',
    example: '31',
    required: false,
  })
  @IsString()
  @IsOptional()
  edad?: string;

  @ApiProperty({
    description: 'Gender of the admin',
    example: 'Female',
    required: false,
  })
  @IsString()
  @IsOptional()
  sexo?: string;
}
