import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateReportsDto {
  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  fechaHora?: string;

  @IsOptional()
  @IsInt()
  idUsuario?: number;
}
