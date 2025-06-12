import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  ubicacion: string;

  @IsNotEmpty()
  @IsString()
  fechaHora: string;

  @IsNotEmpty()
  @IsString()
  temperatura: string;

  @IsNotEmpty()
  @IsInt()
  idQr: number;
}
