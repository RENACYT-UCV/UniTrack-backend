import { IsInt, IsString } from 'class-validator';

export class UpdateHistoryDto {
  @IsInt()
  idHistorial: number;

  @IsString()
  modo: string;
}
