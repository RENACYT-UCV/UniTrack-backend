import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateReportsDto {
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString()
  fechaHora: string;

  @IsNotEmpty()
  @IsInt()
  idUsuario: number;
}
