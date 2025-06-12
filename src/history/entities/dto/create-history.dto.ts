import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsInt()
  idUser: number;
}
