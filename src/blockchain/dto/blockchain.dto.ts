import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddBlockDto {
  @IsNotEmpty()
  data: any;

  @IsNotEmpty()
  @IsNumber()
  idUsuario: number;
}
