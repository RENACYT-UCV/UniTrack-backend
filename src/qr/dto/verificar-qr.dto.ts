import { IsString } from 'class-validator';

export class VerificarQrDto {
  @IsString()
  hash: string;
}
