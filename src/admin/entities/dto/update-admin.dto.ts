// update-admin.dto.ts
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateAdminDto {

  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  correo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  contrasena?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  edad?: string;

}
