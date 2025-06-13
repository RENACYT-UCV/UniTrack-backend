import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddBlockDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The data to be added to the new block',
    example: { sender: 'Alice', receiver: 'Bob', amount: 10 },
  })
  data: any;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the user adding the block',
    example: 1,
  })
  idUsuario: number;
}
