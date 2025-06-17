import { IsNumber, IsString } from 'class-validator';

export class VerificarQrDto {
  @IsNumber()
  idUsuario: number;

  @IsString()
  hash: string;

  @IsString()
  tipo: string;
}
