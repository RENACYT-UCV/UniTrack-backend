import { IsOptional, IsInt } from 'class-validator';

export class UpdateReportsHistoryDto {
  @IsOptional()
  @IsInt()
  idReporte?: number;

  @IsOptional()
  @IsInt()
  idHistorial?: number;
}
