import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateReportsDto {
  @IsNotEmpty()
  @IsString()
  fechaHora: string;

  @IsNotEmpty()
  @IsInt()
  idAdmin: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  historiales: number[];
}
