import { ApiProperty } from '@nestjs/swagger';

export class CreateQrDto {
  @ApiProperty({
    description: 'The hash value of the QR code',
    example: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  })
  hash: string;
}
