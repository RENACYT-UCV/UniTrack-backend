import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerificarQrDto {
  @IsNumber()
  idUsuario: number;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
