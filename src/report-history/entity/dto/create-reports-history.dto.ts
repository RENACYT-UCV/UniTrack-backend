import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateReportsHistoryDto {
  @IsNotEmpty()
  @IsInt()
  idReporte: number;

  @IsNotEmpty()
  @IsInt()
  idHistorial: number;
}
