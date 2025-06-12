import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateHistoryDto {
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  fechaHora?: string;

  @IsOptional()
  @IsString()
  temperatura?: string;

  @IsOptional()
  @IsInt()
  idQr?: number;
}
