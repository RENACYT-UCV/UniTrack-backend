import { ApiProperty } from '@nestjs/swagger';

export class Block {
  @ApiProperty({
    description: 'The index of the block in the blockchain',
    example: 0,
  })
  index: number;
  @ApiProperty({
    description: 'The timestamp when the block was created',
    example: 1678886400000,
  })
  timestamp: number;
  @ApiProperty({
    description: 'The data stored in the block',
    example: { transaction: 'example data' },
  })
  data: any;
  @ApiProperty({
    description: 'The hash of the previous block in the chain',
    example: '0',
  })
  previousHash: string;
  @ApiProperty({
    description: 'The hash of the current block',
    example: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  })
  hash: string;
}
